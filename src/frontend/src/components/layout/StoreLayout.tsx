import { ReactNode } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '../../state/cart';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsAdmin } from '../../hooks/useUserProfile';
import { ShoppingCart, Menu, User, LogOut, LogIn, Shield } from 'lucide-react';
import { SiCaffeine } from 'react-icons/si';
import ProfileSetupDialog from '../auth/ProfileSetupDialog';
import { useQueryClient } from '@tanstack/react-query';

interface StoreLayoutProps {
  children: ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { items } = useCart();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsAdmin();

  const isAuthenticated = !!identity;
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/assets/generated/logo-spareparts.dim_512x512.png"
                alt="Logo"
                className="h-10 w-10"
              />
              <span className="hidden text-lg font-bold sm:inline">SpareParts</span>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              <Link to="/" className="text-sm font-medium transition-colors hover:text-accent">
                Home
              </Link>
              <Link to="/products" className="text-sm font-medium transition-colors hover:text-accent">
                Products
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && userProfile && (
              <div className="hidden items-center gap-2 sm:flex">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{userProfile.name}</span>
                {isAdmin && (
                  <Badge variant="secondary" className="ml-1">
                    <Shield className="mr-1 h-3 w-3" />
                    Admin
                  </Badge>
                )}
              </div>
            )}

            {isAuthenticated ? (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={login} disabled={isLoggingIn}>
                <LogIn className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{isLoggingIn ? 'Logging in...' : 'Login'}</span>
              </Button>
            )}

            <Button variant="ghost" size="sm" asChild className="relative">
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-4">
                  <Link to="/" className="text-sm font-medium">
                    Home
                  </Link>
                  <Link to="/products" className="text-sm font-medium">
                    Products
                  </Link>
                  <Link to="/cart" className="text-sm font-medium">
                    Cart {cartItemCount > 0 && `(${cartItemCount})`}
                  </Link>
                  {isAdmin && (
                    <Link to="/admin/products" className="text-sm font-medium text-accent">
                      Admin Panel
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex-1 px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-3 font-semibold">About</h3>
              <p className="text-sm text-muted-foreground">
                Your trusted source for genuine mobile phone spare parts and accessories.
              </p>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/products" className="text-muted-foreground hover:text-accent">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="text-muted-foreground hover:text-accent">
                    Shopping Cart
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Shipping Information</li>
                <li>Returns & Refunds</li>
                <li>Contact Us</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} SpareParts. Built with{' '}
              <SiCaffeine className="inline h-4 w-4 text-accent" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-accent"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {showProfileSetup && <ProfileSetupDialog />}
    </div>
  );
}
