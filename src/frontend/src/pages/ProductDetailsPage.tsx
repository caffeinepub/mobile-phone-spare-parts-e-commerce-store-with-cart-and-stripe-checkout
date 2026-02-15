import { useState } from 'react';
import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetProduct } from '../hooks/useProducts';
import { useCart } from '../state/cart';
import { ArrowLeft, Smartphone, ShoppingCart, Check } from 'lucide-react';
import { formatPrice } from '../utils/format';
import { LoadingState, EmptyState } from '../components/States';
import { toast } from 'sonner';

export default function ProductDetailsPage() {
  const { productId } = useParams({ strict: false }) as { productId: string };
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useGetProduct(productId);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    toast.success('Added to cart', {
      description: `${quantity}x ${product.name}`,
      action: {
        label: 'View Cart',
        onClick: () => navigate({ to: '/cart' }),
      },
    });
  };

  if (isLoading) {
    return <LoadingState message="Loading product details..." />;
  }

  if (isError || !product) {
    return (
      <EmptyState
        icon={Smartphone}
        title="Product not found"
        description="The product you're looking for doesn't exist"
        action={
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        }
      />
    );
  }

  const isAvailable = product.active;

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link to="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <Card className="overflow-hidden">
          <div className="aspect-square bg-muted">
            <div className="flex h-full items-center justify-center p-12">
              <Smartphone className="h-48 w-48 text-muted-foreground/30" />
            </div>
          </div>
        </Card>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant={isAvailable ? 'secondary' : 'destructive'}>
                {isAvailable ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-2 text-2xl font-bold text-accent">{formatPrice(Number(product.price))}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{product.description}</p>
            </CardContent>
          </Card>

          {!isAvailable && (
            <Alert variant="destructive">
              <AlertDescription>
                This product is currently unavailable and cannot be added to cart.
              </AlertDescription>
            </Alert>
          )}

          {isAvailable && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <div className="mt-2 flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleAddToCart} size="lg" className="w-full">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-accent/5">
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-accent" />
                  <span>Genuine replacement part</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-accent" />
                  <span>Quality tested and verified</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-accent" />
                  <span>Fast and secure shipping</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
