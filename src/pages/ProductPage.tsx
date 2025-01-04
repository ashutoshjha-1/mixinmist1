import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";
import { Card } from "@/components/ui/card";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductDetails } from "@/components/product/ProductDetails";
import { AddToCartSection } from "@/components/product/AddToCartSection";
import type { MenuItem, FooterLink } from "@/integrations/supabase/types";

export default function ProductPage() {
  const { storeName, productId } = useParams();

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!product || !storeData) return <div>Product not found</div>;

  // Parse and validate menu items
  const menuItems: MenuItem[] = Array.isArray(storeData.menu_items) 
    ? (storeData.menu_items as any[]).map(item => ({
        label: String(item.label || ''),
        url: String(item.url || '')
      }))
    : [];

  // Parse and validate footer links
  const footerLinks: FooterLink[] = Array.isArray(storeData.footer_links)
    ? (storeData.footer_links as any[]).map(link => ({
        label: String(link.label || ''),
        url: String(link.url || '')
      }))
    : [];

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
              <div className="space-y-4">
                <ProductImage 
                  imageUrl={product.image_url} 
                  productName={product.name} 
                />
              </div>

              <div className="space-y-6">
                <ProductDetails 
                  name={product.name}
                  price={product.price}
                  description={product.description}
                  productId={product.id}
                />

                <AddToCartSection 
                  productId={product.id}
                  productName={product.name}
                  productPrice={product.price}
                  productImage={product.image_url}
                />
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