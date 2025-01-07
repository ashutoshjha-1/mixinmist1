import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useStoreProduct } from "@/hooks/use-store-product";
import { StoreHeader } from "@/components/store/StoreHeader";
import { ProductDetails } from "@/components/store/ProductDetails";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export default function ProductPage() {
  const { storename, productId } = useParams<{ storename: string; productId: string }>();
  
  console.log("ProductPage params:", { storename, productId });

  // Redirect if store name is undefined
  if (!storename || storename === "undefined") {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Store name is required",
    });
    return <Navigate to="/" />;
  }
  
  const { data: storeSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["store-settings", storename],
    queryFn: async () => {
      console.log("Fetching store settings for store name:", storename);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .ilike("store_name", storename)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load store settings",
        });
        throw profileError;
      }

      if (!profile) {
        console.error("Store not found for store name:", storename);
        toast({
          variant: "destructive",
          title: "Store Not Found",
          description: "The store you're looking for doesn't exist",
        });
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
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load store settings",
        });
        throw settingsError;
      }

      if (!settings) {
        console.error("Store settings not found for user:", profile.id);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Store settings not found",
        });
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
    enabled: !!storename && storename !== "undefined",
    retry: false,
  });

  const { data: product, isLoading, error } = useStoreProduct(storename, productId);

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
}