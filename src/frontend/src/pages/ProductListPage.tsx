import { useState, useMemo } from 'react';
import { Link, useSearch } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetProducts } from '../hooks/useProducts';
import { Search, Smartphone } from 'lucide-react';
import { formatPrice } from '../utils/format';
import { LoadingState, EmptyState } from '../components/States';

export default function ProductListPage() {
  const search = useSearch({ strict: false }) as { category?: string; brand?: string; search?: string };
  const { data: products = [], isLoading, isError } = useGetProducts();

  const [searchTerm, setSearchTerm] = useState(search.search || '');
  const [selectedBrand, setSelectedBrand] = useState(search.brand || 'all');
  const [selectedCategory, setSelectedCategory] = useState(search.category || 'all');

  const brands = useMemo(() => {
    const brandSet = new Set<string>();
    products.forEach((p) => {
      const brand = p.name.split(' ')[0];
      if (brand) brandSet.add(brand);
    });
    return Array.from(brandSet).sort();
  }, [products]);

  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    products.forEach((p) => {
      const desc = p.description.toLowerCase();
      if (desc.includes('battery')) categorySet.add('battery');
      if (desc.includes('screen') || desc.includes('display')) categorySet.add('screen');
      if (desc.includes('camera')) categorySet.add('camera');
      if (desc.includes('charging') || desc.includes('port')) categorySet.add('charging');
      if (desc.includes('speaker')) categorySet.add('speaker');
      if (desc.includes('flex') || desc.includes('cable')) categorySet.add('flex');
    });
    return Array.from(categorySet).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product.active) return false;

      const matchesSearch =
        searchTerm === '' ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBrand =
        selectedBrand === 'all' || product.name.toLowerCase().includes(selectedBrand.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' ||
        product.description.toLowerCase().includes(selectedCategory.toLowerCase());

      return matchesSearch && matchesBrand && matchesCategory;
    });
  }, [products, searchTerm, selectedBrand, selectedCategory]);

  if (isLoading) {
    return <LoadingState message="Loading products..." />;
  }

  if (isError) {
    return (
      <EmptyState
        icon={Smartphone}
        title="Failed to load products"
        description="Please try again later"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="mt-2 text-muted-foreground">Browse our complete catalog of mobile spare parts</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger>
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No products found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <Link key={product.id} to="/products/$productId" params={{ productId: product.id }}>
                <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:border-accent/50">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <div className="flex h-full items-center justify-center p-8">
                      <Smartphone className="h-20 w-20 text-muted-foreground/30 transition-transform group-hover:scale-110" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-base">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">
                      {product.description}
                    </CardDescription>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-bold text-accent">
                        {formatPrice(Number(product.price))}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        In Stock
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
