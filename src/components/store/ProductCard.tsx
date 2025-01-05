import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddProductDialog } from "./AddProductDialog";
import { Pencil } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    description?: string;
  };
  onAddToStore: (productId: string, price: number, name: string, description: string) => void;
  isAdded?: boolean;
  isAdmin?: boolean;
  onEdit?: (product: any) => void;
}

export const ProductCard = ({ 
  product, 
  onAddToStore, 
  isAdded,
  isAdmin,
  onEdit
}: ProductCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-4">${product.price.toFixed(2)}</p>
          <div className="space-y-2">
            <Button
              variant={isAdded ? "secondary" : "default"}
              className="w-full"
              onClick={() => setIsDialogOpen(true)}
              disabled={isAdded}
            >
              {isAdded ? "Added to Store" : "Add to Store"}
            </Button>
            {isAdmin && onEdit && (
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => onEdit(product)}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <AddProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={(price, name, description) => {
          onAddToStore(product.id, price, name, description);
          setIsDialogOpen(false);
        }}
        product={product}
      />
    </Card>
  );
};