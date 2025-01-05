import React, { useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckoutForm } from "./CheckoutForm";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

interface StoreProductsProps {
  products: Product[];
}

export const StoreProducts = ({ products }: StoreProductsProps) => {
  const { username } = useParams();
  const { items, addItem } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Our Products</h2>
        {items.length > 0 && (
          <Button onClick={() => setShowCheckout(true)}>
            Checkout ({items.length} items)
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg overflow-hidden shadow-lg"
          >
            <Link to={`/store/${username}/product/${product.id}`}>
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
            </Link>
            <div className="p-4">
              <Link 
                to={`/store/${username}/product/${product.id}`}
                className="hover:underline"
              >
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              </Link>
              <p className="text-lg font-bold text-primary">
                ${product.price.toFixed(2)}
              </p>
              <Button
                onClick={() => handleAddToCart(product)}
                className="w-full mt-4"
                variant="outline"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-[600px]">
          <CheckoutForm onSuccess={() => setShowCheckout(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};