import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Star } from "lucide-react";

export default function ProductPage() {
  const { storeName, productId } = useParams();
  const { addItem } = useCart();
  const { toast } = useToast();

  // Fetch store settings and product data
  const { data: storeData } = useQuery({
    queryKey: ["store-settings", storeName],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", storeName)
        .single();

      if (!profile) throw new Error("Store not found");

      const { data: settings } = await supabase
        .from("store_settings")
        .select("*")
        .eq("user_id", profile.id)
        .single();

      return settings;
    },
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ["store-product", storeName, productId],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", storeName)
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

  const handleAddToCart = () => {
    if (product) {
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
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!product || !storeData) return <div>Product not found</div>;

  const menuItems = storeData.menu_items ? JSON.parse(storeData.menu_items as string) : [];
  const footerLinks = storeData.footer_links ? JSON.parse(storeData.footer_links as string) : [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <StoreHeader 
        iconImageUrl={storeData.icon_image_url} 
        menuItems={menuItems} 
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-6">
              {/* Product Image Section */}
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Product Details Section */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Star className="fill-current" />
                    <Star className="fill-current" />
                    <Star className="fill-current" />
                    <Star className="fill-current" />
                    <Star className="fill-current" />
                  </div>
                </div>

                <div className="text-3xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </div>

                {product.description && (
                  <div className="prose prose-sm">
                    <h2 className="text-lg font-semibold text-gray-900">Description</h2>
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                )}

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

                {/* Additional Product Information */}
                <div className="border-t pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Availability:</span>
                      <span className="text-green-600 ml-2">In Stock</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">SKU:</span>
                      <span className="text-gray-600 ml-2">{product.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <StoreFooter
        themeColor={storeData.theme_color}
        footerText={storeData.footer_text || ""}
        footerLinks={footerLinks}
      />
    </div>
  );
}