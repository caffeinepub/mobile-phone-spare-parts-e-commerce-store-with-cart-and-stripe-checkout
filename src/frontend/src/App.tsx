import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import StoreLayout from './components/layout/StoreLayout';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminRouteGuard from './components/admin/AdminRouteGuard';

const rootRoute = createRootRoute({
  component: () => (
    <StoreLayout>
      <Outlet />
    </StoreLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductListPage,
});

const productDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$productId',
  component: ProductDetailsPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailurePage,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/products',
  component: () => (
    <AdminRouteGuard>
      <AdminProductsPage />
    </AdminRouteGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  productDetailsRoute,
  cartRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  adminProductsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
