import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isAdmin?: boolean;
  onAddNewProduct: () => void;
}

export const ProductSearch = ({ 
  searchQuery, 
  onSearchChange,
  isAdmin = false,
  onAddNewProduct
}: ProductSearchProps) => {
  return (
    <div className="flex justify-between items-center gap-4">
      <Input
        type="search"
        placeholder="Search products..."
        className="max-w-sm"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {isAdmin && (
        <Button 
          variant="default"
          onClick={onAddNewProduct}
          className="whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      )}
    </div>
  );
};