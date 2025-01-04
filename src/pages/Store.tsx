import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FooterLink } from "@/integrations/supabase/types/footer";
import { StoreHero } from "@/components/store/StoreHero";
import { StoreProducts } from "@/components/store/StoreProducts";
import { StoreFooter } from "@/components/store/StoreFooter";

interface StoreData {
  profile: {
    created_at: string;
    full_name: string;
    id: string;
    phone: string | null;
    store_name: string;
    updated_at: string;
    username: string;
  };
  settings: {
    created_at: string;
    custom_domain: string | null;
    footer_links: FooterLink[];
    footer_text: string;
    hero_image_url: string | null;
    hero_subtitle: string;
    hero_title: string;
    id: string;
    store_name: string;
    theme_color: string;
    updated_at: string;
    user_id: string;
  };
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  }[];
}

export default function Store() {
  const { storeName } = useParams<{ storeName: string }>();

  const { data: storeData, isLoading } = useQuery<StoreData>({
    queryKey: ["store", storeName],
    queryFn: async () => {
      if (!storeName) throw new Error("Store name is required");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("store_name", decodeURIComponent(storeName))
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

      const { data: userProducts, error: userProductsError } = await supabase
        .from("user_products")
        .select("product_id")
        .eq("user_id", profile.id);

      if (userProductsError) throw userProductsError;

      const productIds = userProducts.map((up) => up.product_id);
      
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds);

      if (productsError) throw productsError;

      const parsedFooterLinks = (settings.footer_links || []) as FooterLink[];

      return {
        profile,
        settings: {
          ...settings,
          footer_links: parsedFooterLinks,
        },
        products: products || [],
      };
    },
  });

  if (isLoading) {
    return <div>Loading store...</div>;
  }

  if (!storeData) {
    return <div>Store not found</div>;
  }

  const { settings, products } = storeData;

  return (
    <div className="min-h-screen">
      <StoreHero
        heroImageUrl={settings.hero_image_url}
        themeColor={settings.theme_color}
        title={settings.hero_title}
        subtitle={settings.hero_subtitle}
      />
      <StoreProducts products={products} />
      <StoreFooter
        themeColor={settings.theme_color}
        footerText={settings.footer_text}
        footerLinks={settings.footer_links}
      />
    </div>
  );
}