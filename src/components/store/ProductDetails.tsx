import React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckoutForm } from "./CheckoutForm";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string | null;
}

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const { addItem, items } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-lg"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </p>
          {product.description && (
            <p className="text-gray-600">{product.description}</p>
          )}
          <div className="space-y-4">
            <Button onClick={handleAddToCart} className="w-full">
              Add to Cart
            </Button>
            {items.length > 0 && (
              <Button
                onClick={() => setShowCheckout(true)}
                variant="outline"
                className="w-full"
              >
                Checkout ({items.length} items)
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
          </DialogHeader>
          <CheckoutForm onSuccess={() => setShowCheckout(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};