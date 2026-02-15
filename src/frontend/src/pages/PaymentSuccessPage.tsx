import { useEffect, useState } from 'react';
import { Link, useSearch } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Package } from 'lucide-react';
import { useCart } from '../state/cart';
import { LoadingState } from '../components/States';

export default function PaymentSuccessPage() {
  const search = useSearch({ strict: false }) as { session_id?: string };
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      clearCart();
      setIsProcessing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [clearCart]);

  if (isProcessing) {
    return <LoadingState message="Processing your order..." />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="border-accent/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <CheckCircle2 className="h-10 w-10 text-accent" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>Thank you for your order</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Package className="h-4 w-4" />
            <AlertDescription>
              Your order has been confirmed and will be processed shortly. You will receive a confirmation
              email with tracking details.
            </AlertDescription>
          </Alert>

          {search.session_id && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Session ID</p>
              <p className="mt-1 font-mono text-xs break-all">{search.session_id}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1">
              <Link to="/products">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
