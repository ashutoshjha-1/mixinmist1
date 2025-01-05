import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isAdmin?: boolean;
  onAddNewProduct: () => void;
}

export const ProductSearch = ({ 
  searchQuery, 
  onSearchChange,
  isAdmin,
  onAddNewProduct
}: ProductSearchProps) => {
  return (
    <div className="flex justify-between items-center">
      <Input
        type="search"
        placeholder="Search products..."
        className="max-w-sm"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="space-x-4">
        {isAdmin && (
          <Button 
            variant="default"
            onClick={onAddNewProduct}
          >
            Add New Product
          </Button>
        )}
        <Button variant="default">ADD MY LOGO TO PRODUCTS</Button>
      </div>
    </div>
  );
};