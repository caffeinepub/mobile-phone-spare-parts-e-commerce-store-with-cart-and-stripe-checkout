import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, ShoppingCart } from 'lucide-react';

export default function PaymentFailurePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="border-destructive/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
          <CardDescription>Your order was not completed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertDescription>
              Your payment was cancelled or failed. No charges have been made to your account. Your cart
              items are still saved.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">What would you like to do?</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="flex-1">
                <Link to="/cart">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Return to Cart
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
