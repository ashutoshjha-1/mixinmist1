import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

interface AddToCartSectionProps {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
}

export const AddToCartSection = ({ 
  productId, 
  productName, 
  productPrice, 
  productImage 
}: AddToCartSectionProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: productId,
      name: productName,
      price: productPrice,
      quantity: 1,
      image_url: productImage,
    });
    toast({
      title: "Added to cart",
      description: "Product has been added to your cart",
    });
  };

  return (
    <div className="space-y-4">
      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
      >
        <ShoppingCart className="mr-2" />
        Add to Cart
      </Button>
    </div>
  );
};