import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductDetails } from "@/components/product/ProductDetails";
import { AddToCartSection } from "@/components/product/AddToCartSection";
import { MenuItem } from "@/integrations/supabase/types/menu";
import { FooterLink } from "@/integrations/supabase/types/footer";

export default function ProductPage() {
  const { username, productId } = useParams<{ username: string; productId: string }>();

  const { data: productData, isLoading: productLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID is required");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: storeData, isLoading: storeLoading } = useQuery({
    queryKey: ["store-settings", username],
    queryFn: async () => {
      if (!username) throw new Error("Store username is required");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", username)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error("Store not found");

      const { data: settings, error: settingsError } = await supabase
        .from("store_settings")
        .select("*")
        .eq("user_id", profile.id)
        .maybeSingle();

      if (settingsError) throw settingsError;
      if (!settings) throw new Error("Store settings not found");

      return settings;
    },
  });

  if (productLoading || storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading product...</div>
      </div>
    );
  }

  if (!productData || !storeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-gray-600">
          The product you're looking for doesn't exist or might have been removed.
        </p>
      </div>
    );
  }

  const menuItems = Array.isArray(storeData.menu_items) 
    ? storeData.menu_items.map(item => ({
        label: String(item.label || ''),
        url: String(item.url || '')
      }))
    : [];

  const footerLinks = Array.isArray(storeData.footer_links)
    ? storeData.footer_links.map(link => ({
        label: String(link.label || ''),
        url: String(link.url || '')
      }))
    : [];

  const { name, price, image_url, description } = productData;

  return (
    <div className="min-h-screen">
      <StoreHeader 
        iconImageUrl={storeData.icon_image_url} 
        menuItems={menuItems}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductImage 
            imageUrl={image_url} 
            productName={name}
          />
          <div className="space-y-8">
            <ProductDetails 
              name={name} 
              price={price} 
              description={description}
              productId={productId || ''}
            />
            <AddToCartSection 
              productId={productId || ''} 
              productName={name}
              productPrice={price}
              productImage={image_url}
            />
          </div>
        </div>
      </main>
      <StoreFooter 
        themeColor={storeData.theme_color || '#4F46E5'}
        footerText={storeData.footer_text || ''}
        footerLinks={footerLinks}
      />
    </div>
  );
}