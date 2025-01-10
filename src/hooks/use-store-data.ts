import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FooterLink } from "@/integrations/supabase/types/footer";
import { MenuItem } from "@/integrations/supabase/types/menu";
import { CarouselImage } from "@/integrations/supabase/types/store-settings";
import { toast } from "@/components/ui/use-toast";

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
    carousel_images: CarouselImage[];
    show_hero: boolean;
    show_carousel: boolean;
  };
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  }[];
}

export const useStoreData = (storeName: string | undefined) => {
  return useQuery({
    queryKey: ["store", storeName],
    queryFn: async () => {
      if (!storeName) {
        console.error("Store name is required but was undefined");
        throw new Error("Store name is required");
      }

      console.log("Fetching store data for store name:", storeName);

      // First get the profile using store_name
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .ilike("store_name", storeName)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch store profile. Please try again later.",
        });
        throw profileError;
      }

      if (!profile) {
        console.error("Profile not found for store name:", storeName);
        toast({
          variant: "destructive",
          title: "Store Not Found",
          description: "The store you're looking for doesn't exist.",
        });
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
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch store settings. Please try again later.",
        });
        throw settingsError;
      }

      if (!settings) {
        console.error("Store settings not found for user:", profile.id);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Store settings not found. Please try again later.",
        });
        throw new Error("Store settings not found");
      }

      // Get products with a single query
      const { data: userProducts, error: productsError } = await supabase
        .from("user_products")
        .select(`
          custom_price,
          products (
            id,
            name,
            image_url
          )
        `)
        .eq("user_id", profile.id);

      if (productsError) {
        console.error("Products fetch error:", productsError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch store products. Please try again later.",
        });
        throw productsError;
      }

      // Transform the products data
      const products = (userProducts || []).map((up) => ({
        id: up.products.id,
        name: up.products.name,
        price: up.custom_price,
        image_url: up.products.image_url,
      }));

      // Parse and type-check menu items and footer links
      const menuItems = Array.isArray(settings.menu_items) 
        ? (settings.menu_items as any[]).map((item) => ({
            label: String(item?.label || ''),
            url: String(item?.url || '')
          }))
        : [];

      const footerLinks = Array.isArray(settings.footer_links)
        ? (settings.footer_links as any[]).map((link) => ({
            label: String(link?.label || ''),
            url: String(link?.url || '')
          }))
        : [];

      const bottomMenuItems = Array.isArray(settings.bottom_menu_items)
        ? (settings.bottom_menu_items as any[]).map((item) => ({
            label: String(item?.label || ''),
            url: String(item?.url || '')
          }))
        : [];

      // Parse carousel images
      const carouselImages = Array.isArray(settings.carousel_images)
        ? (settings.carousel_images as any[]).map((image) => ({
            url: String(image?.url || ''),
            buttonText: image?.buttonText || undefined,
            buttonUrl: image?.buttonUrl || undefined,
          }))
        : [];

      return {
        profile,
        settings: {
          ...settings,
          menu_items: menuItems,
          footer_links: footerLinks,
          bottom_menu_items: bottomMenuItems,
          carousel_images: carouselImages,
          show_hero: settings.show_hero ?? true,
          show_carousel: settings.show_carousel ?? false
        },
        products,
      } as StoreData;
    },
    enabled: !!storeName,
    retry: false, // Don't retry if store is not found
  });
};