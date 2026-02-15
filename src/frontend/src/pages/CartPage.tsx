import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCart } from '../state/cart';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { formatPrice } from '../utils/format';
import { EmptyState } from '../components/States';
import CheckoutButton from '../components/checkout/CheckoutButton';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        description="Add some products to get started"
        action={
          <Button asChild size="lg">
            <Link to="/products">Browse Products</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="mt-2 text-muted-foreground">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <Button variant="ghost" onClick={clearCart} className="text-destructive">
          Clear Cart
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <Card key={item.product.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    <div className="flex h-full items-center justify-center">
                      <ShoppingCart className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link to="/products/$productId" params={{ productId: item.product.id }}>
                        <h3 className="font-semibold hover:text-accent">{item.product.name}</h3>
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                        {item.product.description}
                      </p>
                      <p className="mt-2 font-semibold text-accent">
                        {formatPrice(Number(item.product.price))}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.product.id, Math.max(1, parseInt(e.target.value) || 1))
                          }
                          className="h-8 w-16 text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.product.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-accent">{formatPrice(getTotal())}</span>
                </div>
              </div>
              <CheckoutButton />
              <Button variant="outline" asChild className="w-full">
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
