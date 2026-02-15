import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Product {
    id: string;
    active: boolean;
    name: string;
    description: string;
    price: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface Order {
    id: string;
    status: OrderStatus;
    user: Principal;
    totalAmount: bigint;
    timestamp: Time;
    items: Array<ShoppingItem>;
    stripeSessionId: string;
}
export interface UserProfile {
    name: string;
    email?: string;
}
export interface http_header {
    value: string;
    name: string;
}
export enum OrderStatus {
    cancelled = "cancelled",
    pending = "pending",
    paid = "paid"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    archiveProduct(productId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createProduct(product: Product): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrder(orderId: string): Promise<Order>;
    getOrdersByUser(): Promise<Array<Order>>;
    getProduct(productId: string): Promise<Product>;
    getProducts(): Promise<Array<Product>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    recordOrder(orderId: string, items: Array<ShoppingItem>, totalAmount: bigint, stripeSessionId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
