import React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    description?: string;
  };
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
    });
    toast({
      title: "Added to cart",
      description: "Product has been added to your cart",
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full rounded-lg shadow-lg"
        />
      </div>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold text-primary">
          ${product.price.toFixed(2)}
        </p>
        {product.description && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>
        )}
        <Button
          size="lg"
          className="w-full"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};