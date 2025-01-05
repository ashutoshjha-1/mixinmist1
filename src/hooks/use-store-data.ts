import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FooterLink } from "@/integrations/supabase/types/footer";
import { MenuItem } from "@/integrations/supabase/types/menu";

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
    footer_text: string | null;
    hero_image_url: string | null;
    hero_subtitle: string;
    hero_title: string;
    icon_image_url: string | null;
    id: string;
    menu_items: MenuItem[];
    bottom_menu_items: MenuItem[];
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

export const useStoreData = (username: string | undefined) => {
  return useQuery({
    queryKey: ["store", username?.toLowerCase()],
    queryFn: async () => {
      if (!username) throw new Error("Store username is required");

      console.log("Fetching store data for username:", username);

      // First get the profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .ilike("username", username)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }

      if (!profile) {
        console.error("Profile not found for username:", username);
        throw new Error("Store not found");
      }

      console.log("Found profile:", profile);

      // Then get store settings
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

      // Get user products directly without joins
      const { data: userProducts, error: userProductsError } = await supabase
        .from("user_products")
        .select("product_id, custom_price")
        .eq("user_id", profile.id);

      if (userProductsError) {
        console.error("User products fetch error:", userProductsError);
        throw userProductsError;
      }

      // Get product details in a separate query
      const productIds = userProducts.map(up => up.product_id);
      
      if (productIds.length === 0) {
        // Return empty products array if no products found
        return {
          profile,
          settings: {
            ...settings,
            menu_items: Array.isArray(settings.menu_items) ? settings.menu_items : [],
            footer_links: Array.isArray(settings.footer_links) ? settings.footer_links : [],
            bottom_menu_items: Array.isArray(settings.bottom_menu_items) ? settings.bottom_menu_items : [],
          },
          products: [],
        };
      }

      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("id, name, image_url")
        .in("id", productIds);

      if (productsError) {
        console.error("Products fetch error:", productsError);
        throw productsError;
      }

      // Combine the data manually
      const products = productsData.map(product => {
        const userProduct = userProducts.find(up => up.product_id === product.id);
        return {
          id: product.id,
          name: product.name,
          price: userProduct?.custom_price || 0,
          image_url: product.image_url,
        };
      });

      // Parse menu items and footer links
      const menuItems = Array.isArray(settings.menu_items) 
        ? settings.menu_items.map((item: any) => ({
            label: String(item.label || ''),
            url: String(item.url || '')
          }))
        : [];

      const footerLinks = Array.isArray(settings.footer_links)
        ? settings.footer_links.map((link: any) => ({
            label: String(link.label || ''),
            url: String(link.url || '')
          }))
        : [];

      const bottomMenuItems = Array.isArray(settings.bottom_menu_items)
        ? settings.bottom_menu_items.map((item: any) => ({
            label: String(item.label || ''),
            url: String(item.url || '')
          }))
        : [];

      return {
        profile,
        settings: {
          ...settings,
          menu_items: menuItems,
          footer_links: footerLinks,
          bottom_menu_items: bottomMenuItems,
        },
        products,
      };
    },
    enabled: !!username,
  });
};