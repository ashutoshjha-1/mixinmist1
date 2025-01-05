import React from "react";
import { useParams } from "react-router-dom";
import { useStoreProduct } from "@/hooks/use-store-product";
import { StoreHeader } from "@/components/store/StoreHeader";
import { ProductDetails } from "@/components/store/ProductDetails";
import { CartProvider } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProductPageContent = () => {
  // Explicitly type the parameters to match the route structure
  const params = useParams<{ store: string; productId: string }>();
  const store = params.store;
  const productId = params.productId;
  
  console.log("ProductPage params:", { store, productId });
  
  const { data: storeSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["store-settings", store],
    queryFn: async () => {
      if (!store) {
        console.error("Store name is required but was undefined");
        throw new Error("Store name is required");
      }

      console.log("Fetching store settings for store name:", store);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", store)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }

      if (!profile) {
        console.error("Store not found for store name:", store);
        throw new Error("Store not found");
      }

      console.log("Found profile:", profile);

      const { data: settings, error: settingsError } = await supabase
        .from("store_settings")
        .select("*")
        .eq("user_id", profile.id)
        .maybeSingle();

      if (settingsError) {
        console.error("Settings fetch error:", settingsError);
        throw settingsError;
      }

      if (!settings) {
        console.error("Store settings not found for user:", profile.id);
        throw new Error("Store settings not found");
      }

      console.log("Found store settings:", settings);

      const menuItems = Array.isArray(settings.menu_items) 
        ? settings.menu_items.map((item: any) => ({
            label: String(item?.label || ''),
            url: String(item?.url || '')
          }))
        : [];

      return {
        ...settings,
        menu_items: menuItems
      };
    },
    enabled: !!store,
  });

  const { data: product, isLoading, error } = useStoreProduct(store, productId);

  console.log("Product query result:", { product, isLoading, error });

  if (isLoading || isLoadingSettings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    console.error("Product fetch error:", error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">
          {error instanceof Error ? error.message : "Failed to load product"}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {storeSettings && (
        <StoreHeader
          iconImageUrl={storeSettings.icon_image_url}
          menuItems={storeSettings.menu_items}
        />
      )}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProductDetails product={product} />
      </div>
    </div>
  );
};

export default function ProductPage() {
  return (
    <CartProvider>
      <ProductPageContent />
    </CartProvider>
  );
}