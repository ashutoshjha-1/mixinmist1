import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

export default function ProductPage() {
  const { storeName, productId } = useParams();
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery({
    queryKey: ["store-product", storeName, productId],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("store_name", storeName)
        .single();

      if (!profile) throw new Error("Store not found");

      const { data: userProduct } = await supabase
        .from("user_products")
        .select(`
          custom_price,
          custom_description,
          products (
            id,
            name,
            image_url,
            description
          )
        `)
        .eq("user_id", profile.id)
        .eq("product_id", productId)
        .single();

      if (!userProduct) throw new Error("Product not found");

      return {
        id: userProduct.products.id,
        name: userProduct.products.name,
        price: userProduct.custom_price,
        image_url: userProduct.products.image_url,
        description: userProduct.custom_description || userProduct.products.description,
      };
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url, // Add the image_url here
    });
    toast({
      title: "Added to cart",
      description: "Product has been added to your cart",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
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
      </div>
    </div>
  );
}