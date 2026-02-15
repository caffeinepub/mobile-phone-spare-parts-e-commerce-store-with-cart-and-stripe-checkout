import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCart } from '../../state/cart';
import { useCreateCheckoutSession } from '../../hooks/useCreateCheckoutSession';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetProducts } from '../../hooks/useProducts';
import { Loader2, AlertCircle } from 'lucide-react';
import type { ShoppingItem } from '../../backend';

export default function CheckoutButton() {
  const { items } = useCart();
  const { identity, login } = useInternetIdentity();
  const { data: products = [] } = useGetProducts();
  const createCheckoutSession = useCreateCheckoutSession();
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!identity;

  const handleCheckout = async () => {
    setError(null);

    if (!isAuthenticated) {
      login();
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      const shoppingItems: ShoppingItem[] = items.map((item) => {
        const product = products.find((p) => p.id === item.product.id);
        const price = product ? Number(product.price) : Number(item.product.price);

        return {
          productName: item.product.name,
          productDescription: item.product.description,
          priceInCents: BigInt(price),
          quantity: BigInt(item.quantity),
          currency: 'USD',
        };
      });

      const session = await createCheckoutSession.mutateAsync(shoppingItems);

      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }

      window.location.href = session.url;
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to initiate checkout. Please try again.');
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button
        onClick={handleCheckout}
        disabled={createCheckoutSession.isPending || items.length === 0}
        size="lg"
        className="w-full"
      >
        {createCheckoutSession.isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : isAuthenticated ? (
          'Proceed to Checkout'
        ) : (
          'Sign In to Checkout'
        )}
      </Button>
    </div>
  );
}
