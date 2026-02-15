import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Blob "mo:core/Blob";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import OutCall "http-outcalls/outcall";
import Stripe "stripe/stripe";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profiles
  public type UserProfile = {
    name : Text;
    email : ?Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Catalog
  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat; // Cents
    active : Bool;
  };

  let products = Map.empty<Text, Product>();

  // Orders
  public type Order = {
    id : Text;
    items : [Stripe.ShoppingItem];
    totalAmount : Nat;
    stripeSessionId : Text;
    status : OrderStatus;
    timestamp : Time.Time;
    user : Principal;
  };

  public type OrderStatus = {
    #pending;
    #paid;
    #cancelled;
  };

  let orders = Map.empty<Text, Order>();
  let sessionToOrder = Map.empty<Text, Text>(); // Maps Stripe session ID to order ID

  // Stripe Integration
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public query ({ caller }) func isStripeConfigured() : async Bool {
    switch (stripeConfig) {
      case (null) { false };
      case (?_) { true };
    };
  };

  public shared ({ caller }) func createProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func archiveProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can archive products");
    };
    let existing = products.get(productId);
    switch (existing) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let updated = {
          product with
          active = false;
        };
        products.add(productId, updated);
      };
    };
  };

  public query ({ caller }) func getProducts() : async [Product] {
    // Public access - anyone can view products in storefront
    products.values().toArray();
  };

  public query ({ caller }) func getProduct(productId : Text) : async Product {
    // Public access - anyone can view product details
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    // Verify caller owns this session or is admin
    switch (sessionToOrder.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?orderId) {
        switch (orders.get(orderId)) {
          case (null) { Runtime.trap("Order not found") };
          case (?order) {
            if (order.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Can only check your own session status");
            };
          };
        };
      };
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    // Only authenticated users can create checkout sessions
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    // Public transform function for HTTP outcalls
    OutCall.transform(input);
  };

  public shared ({ caller }) func recordOrder(orderId : Text, items : [Stripe.ShoppingItem], totalAmount : Nat, stripeSessionId : Text) : async () {
    // Only authenticated users can record orders, and only for themselves
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can record orders");
    };

    let order : Order = {
      id = orderId;
      items;
      totalAmount;
      stripeSessionId;
      status = #pending;
      timestamp = Time.now();
      user = caller;
    };
    orders.add(orderId, order);
    sessionToOrder.add(stripeSessionId, orderId);
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    let existing = orders.get(orderId);
    switch (existing) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updated = {
          order with
          status;
        };
        orders.add(orderId, updated);
      };
    };
  };

  public query ({ caller }) func getOrder(orderId : Text) : async Order {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        // Only order owner or admin can view order details
        if (order.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
    };
  };

  public query ({ caller }) func getOrdersByUser() : async [Order] {
    // Only authenticated users can view their order history
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view order history");
    };
    orders.values().filter(func(o) { o.user == caller }).toArray();
  };
};
