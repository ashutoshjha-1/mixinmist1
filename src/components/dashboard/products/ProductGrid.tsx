import { ProductCard } from "@/components/store/ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string;
  is_sample?: boolean;
}

interface ProductGridProps {
  products: Product[] | null;
  isAdmin?: boolean;
  addedProducts: Set<string>;
  onAddToStore: (productId: string, price: number, name: string, description: string) => void;
  onEdit?: (product: Product) => void;
  showSampleProducts?: boolean;
}

export const ProductGrid = ({ 
  products, 
  isAdmin, 
  addedProducts, 
  onAddToStore,
  onEdit,
  showSampleProducts = false
}: ProductGridProps) => {
  if (!products) return null;

  // Filter out sample products unless specifically requested
  const filteredProducts = products.filter(product => 
    showSampleProducts ? product.is_sample : !product.is_sample
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToStore={onAddToStore}
          isAdded={addedProducts.has(product.id)}
          isAdmin={isAdmin}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};