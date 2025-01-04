import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddProductDialog } from "./AddProductDialog";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    description?: string;
  };
  onAddToStore: (productId: string, customPrice: number, customName: string, customDescription: string) => void;
  isAdded: boolean;
}

export const ProductCard = ({ product, onAddToStore, isAdded }: ProductCardProps) => {
  const [showPriceDialog, setShowPriceDialog] = React.useState(false);

  const handleAddToStore = (customPrice: number, customName: string, customDescription: string) => {
    onAddToStore(product.id, customPrice, customName, customDescription);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-2">{product.name}</h3>
          <p className="text-primary mb-2">${product.price.toFixed(2)}</p>
          <Button
            variant={isAdded ? "secondary" : "outline"}
            className="w-full"
            onClick={() => setShowPriceDialog(true)}
            disabled={isAdded}
          >
            {isAdded ? "Added" : "Add to My Store"}
          </Button>
        </CardContent>
      </Card>

      <AddProductDialog
        isOpen={showPriceDialog}
        onClose={() => setShowPriceDialog(false)}
        onConfirm={handleAddToStore}
        product={product}
      />
    </>
  );
};