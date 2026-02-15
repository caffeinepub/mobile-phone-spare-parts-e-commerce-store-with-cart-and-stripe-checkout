import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetProducts } from '../hooks/useProducts';
import { Battery, Smartphone, Camera, Cable, Speaker, Wrench } from 'lucide-react';
import { formatPrice } from '../utils/format';

const categories = [
  { name: 'Battery', icon: Battery, filter: 'battery' },
  { name: 'Screen', icon: Smartphone, filter: 'screen' },
  { name: 'Camera', icon: Camera, filter: 'camera' },
  { name: 'Charging Port', icon: Cable, filter: 'charging' },
  { name: 'Speaker', icon: Speaker, filter: 'speaker' },
  { name: 'Flex Cable', icon: Wrench, filter: 'flex' },
];

export default function HomePage() {
  const { data: products = [], isLoading } = useGetProducts();
  const activeProducts = products.filter((p) => p.active).slice(0, 6);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5">
        <div className="relative z-10 px-6 py-16 md:px-12 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Quality Mobile Spare Parts
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Find genuine replacement parts for all major phone brands. Fast shipping, guaranteed compatibility.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="text-base">
                <Link to="/products">Browse All Parts</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link to="/cart">View Cart</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/generated/hero-banner.dim_1600x600.png"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                to="/products"
                search={{ category: category.filter }}
                className="group"
              >
                <Card className="transition-all hover:shadow-md hover:border-accent/50">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <Icon className="h-10 w-10 text-accent transition-transform group-hover:scale-110" />
                    <p className="mt-3 text-sm font-medium">{category.name}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Button asChild variant="ghost">
            <Link to="/products">View All →</Link>
          </Button>
        </div>
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square animate-pulse bg-muted" />
                <CardHeader>
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-muted" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : activeProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeProducts.map((product) => (
              <Link key={product.id} to="/products/$productId" params={{ productId: product.id }}>
                <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-accent/50">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <div className="flex h-full items-center justify-center p-8">
                      <Smartphone className="h-24 w-24 text-muted-foreground/30 transition-transform group-hover:scale-110" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1 text-lg">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xl font-bold text-accent">
                        {formatPrice(Number(product.price))}
                      </span>
                      <Badge variant="secondary">In Stock</Badge>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Smartphone className="h-16 w-16 text-muted-foreground/30" />
              <p className="mt-4 text-muted-foreground">No products available yet</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Trust Indicators */}
      <section className="rounded-xl bg-muted/50 px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Wrench className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold">Genuine Parts</h3>
            <p className="mt-1 text-sm text-muted-foreground">100% authentic replacement parts</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Cable className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold">Fast Shipping</h3>
            <p className="mt-1 text-sm text-muted-foreground">Quick delivery to your door</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Battery className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold">Quality Guaranteed</h3>
            <p className="mt-1 text-sm text-muted-foreground">Tested for reliability</p>
          </div>
        </div>
      </section>
    </div>
  );
}
