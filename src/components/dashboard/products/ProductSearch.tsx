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
  console.log("ProductSearch rendered, isAdmin:", isAdmin); // Debug log

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {isAdmin && (
          <Button 
            onClick={onAddNewProduct}
            className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>
      <Button 
        className="w-32 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
      >
        EDIT PRODUCTS
      </Button>
    </div>
  );
};