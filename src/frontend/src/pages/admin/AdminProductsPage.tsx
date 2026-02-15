import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetProducts } from '../../hooks/useProducts';
import { useCreateProduct, useUpdateProduct, useArchiveProduct } from '../../hooks/useAdminProducts';
import { Plus, Edit, Archive, Search } from 'lucide-react';
import { formatPrice } from '../../utils/format';
import { LoadingState } from '../../components/States';
import { toast } from 'sonner';
import type { Product } from '../../backend';

export default function AdminProductsPage() {
  const { data: products = [], isLoading } = useGetProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const archiveProduct = useArchiveProduct();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    active: true,
  });

  const resetForm = () => {
    setFormData({ id: '', name: '', description: '', price: '', active: true });
    setEditingProduct(null);
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        id: product.id,
        name: product.name,
        description: product.description,
        price: (Number(product.price) / 100).toString(),
        active: product.active,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(resetForm, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price) {
      toast.error('Please fill in all fields');
      return;
    }

    const priceInCents = Math.round(parseFloat(formData.price) * 100);
    if (isNaN(priceInCents) || priceInCents <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const productData: Product = {
      id: editingProduct ? editingProduct.id : `product-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: BigInt(priceInCents),
      active: formData.active,
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync(productData);
        toast.success('Product updated successfully');
      } else {
        await createProduct.mutateAsync(productData);
        toast.success('Product created successfully');
      }
      handleCloseDialog();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    }
  };

  const handleArchive = async (productId: string) => {
    try {
      await archiveProduct.mutateAsync(productId);
      toast.success('Product archived successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to archive product');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <LoadingState message="Loading products..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="mt-2 text-muted-foreground">Create, edit, and manage your product catalog</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle>{product.name}</CardTitle>
                    <Badge variant={product.active ? 'secondary' : 'destructive'}>
                      {product.active ? 'Active' : 'Archived'}
                    </Badge>
                  </div>
                  <CardDescription className="mt-2">{product.description}</CardDescription>
                  <p className="mt-2 text-lg font-semibold text-accent">
                    {formatPrice(Number(product.price))}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleOpenDialog(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  {product.active && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleArchive(product.id)}
                      disabled={archiveProduct.isPending}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Create Product'}</DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? 'Update the product details below'
                  : 'Add a new product to your catalog'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., iPhone 13 Battery"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the product, compatibility, features..."
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="29.99"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createProduct.isPending || updateProduct.isPending}
              >
                {createProduct.isPending || updateProduct.isPending
                  ? 'Saving...'
                  : editingProduct
                  ? 'Update Product'
                  : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
