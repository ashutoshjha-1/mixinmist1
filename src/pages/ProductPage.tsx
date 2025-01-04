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
import { CartProvider } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

export default function ProductPage() {
  const { username, productId } = useParams<{ username: string; productId: string }>();
  const { toast } = useToast();

  const { data: productData, isLoading: productLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID is required");
      console.log("Fetching product with ID:", productId);
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Product not found");
      return data;
    },
    meta: {
      onError: (error: Error) => {
        console.error("Product fetch error:", error);
        toast({
          variant: "destructive",
          title: "Error loading product",
          description: error.message
        });
      }
    }
  });

  const { data: storeData, isLoading: storeLoading } = useQuery({
    queryKey: ["store-settings", username],
    queryFn: async () => {
      if (!username) throw new Error("Store username is required");
      console.log("Fetching store data for username:", username);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", username)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error("Store not found");
      console.log("Found profile:", profile);

      const { data: settings, error: settingsError } = await supabase
        .from("store_settings")
        .select("*")
        .eq("user_id", profile.id)
        .maybeSingle();

      if (settingsError) throw settingsError;
      if (!settings) throw new Error("Store settings not found");

      return settings;
    },
    meta: {
      onError: (error: Error) => {
        console.error("Store data fetch error:", error);
        toast({
          variant: "destructive",
          title: "Error loading store",
          description: error.message
        });
      }
    }
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

  const menuItems: MenuItem[] = Array.isArray(storeData.menu_items) 
    ? (storeData.menu_items as any[]).map(item => ({
        label: String(item.label || ''),
        url: String(item.url || '')
      }))
    : [];

  const footerLinks: FooterLink[] = Array.isArray(storeData.footer_links)
    ? (storeData.footer_links as any[]).map(link => ({
        label: String(link.label || ''),
        url: String(link.url || '')
      }))
    : [];

  const { name, price, image_url, description } = productData;

  return (
    <CartProvider>
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
    </CartProvider>
  );
}