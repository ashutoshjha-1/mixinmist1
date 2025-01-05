import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { StoreHeader } from "@/components/store/StoreHeader";
import { MenuItem } from "@/integrations/supabase/types/menu";

export default function ProductPage() {
  const { storeName, productId } = useParams();
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: storeSettings } = useQuery({
    queryKey: ["store-settings", storeName?.toLowerCase()],
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

      // Parse and validate menu_items
      const menuItems = Array.isArray(settings.menu_items) 
        ? settings.menu_items.map((item: any) => ({
            label: String(item.label || ''),
            url: String(item.url || '')
          }))
        : [];

      return {
        ...settings,
        menu_items: menuItems
      };
    },
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ["store-product", storeName, productId],
    queryFn: async () => {
      console.log("Fetching product for store:", storeName, "product:", productId);
      
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", storeName)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }

      if (!profile) {
        console.error("Store not found for username:", storeName);
        throw new Error("Store not found");
      }

      console.log("Found profile:", profile);

      const { data: userProduct, error: productError } = await supabase
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
        .maybeSingle();

      if (productError) {
        console.error("Product fetch error:", productError);
        throw productError;
      }

      if (!userProduct) {
        console.error("Product not found:", productId);
        throw new Error("Product not found");
      }

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
      image_url: product.image_url,
    });
    toast({
      title: "Added to cart",
      description: "Product has been added to your cart",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {storeSettings && (
        <StoreHeader
          iconImageUrl={storeSettings.icon_image_url}
          menuItems={storeSettings.menu_items}
        />
      )}
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