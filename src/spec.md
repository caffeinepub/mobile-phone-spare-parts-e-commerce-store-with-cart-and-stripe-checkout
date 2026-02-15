# Specification

## Summary
**Goal:** Build a mobile-friendly mobile phone spare parts e-commerce storefront with product management, persistent cart, Stripe Checkout, order recording/confirmation, and Internet Identity-based admin access, with a consistent non-blue/purple visual theme.

**Planned changes:**
- Create responsive storefront pages: home, product listing (search + filters by brand and category), product details, and a persistent cart (local storage) with quantity updates/removals.
- Implement backend product catalog storage and APIs: list products, get product by ID, and admin-only create/update/archive (archived excluded from public listings).
- Add an admin UI on a dedicated route to create/edit/archive products and reflect changes in the storefront.
- Implement Stripe Checkout flow: create checkout session from cart server-side priced totals, redirect to Stripe, and add success/cancel return pages.
- Record orders in the backend (items snapshot, totals, currency, timestamps, payment/session identifiers, status) and render an order confirmation summary by order ID on success.
- Add Internet Identity sign-in/sign-out; enforce admin allowlist for product mutations while keeping browsing/cart available to unauthenticated users.
- Apply a coherent visual theme across all screens (mobile-first; avoid blue/purple primaries) and add commerce UX essentials (currency display, stock messaging, empty/loading/error states).
- Add static asset handling for generated brand images stored under `frontend/public/assets/generated` and use them for header logo, favicon, and homepage hero/banner.

**User-visible outcome:** Users can browse and search/filter spare parts, view details, add items to a cart that persists across reloads, and complete payment via Stripe with success/cancel pages and an order confirmation summary; admins can sign in with Internet Identity to manage the product catalog.
