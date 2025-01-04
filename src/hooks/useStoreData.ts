import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "@/integrations/supabase/types/menu";
import { FooterLink } from "@/integrations/supabase/types/footer";
import { useToast } from "@/hooks/use-toast";

export const useStoreData = (username: string | undefined) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["store", username],
    queryFn: async () => {
      if (!username) throw new Error("Store username is required");

      console.log("Fetching store data for username:", username);

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

      const { data: userProducts, error: userProductsError } = await supabase
        .from("user_products")
        .select(`
          product_id,
          custom_price,
          products (
            id,
            name,
            image_url
          )
        `)
        .eq("user_id", profile.id);

      if (userProductsError) {
        console.error("Products fetch error:", userProductsError);
        throw userProductsError;
      }

      const products = userProducts.map((up) => ({
        id: up.products.id,
        name: up.products.name,
        price: up.custom_price,
        image_url: up.products.image_url,
      }));

      const menuItemsJson = settings.menu_items || [];
      const footerLinksJson = settings.footer_links || [];

      const parsedMenuItems = (Array.isArray(menuItemsJson) ? menuItemsJson : []).map((item: any) => ({
        label: String(item.label || ''),
        url: formatUrl(String(item.url || ''))
      })) as MenuItem[];

      const parsedFooterLinks = (Array.isArray(footerLinksJson) ? footerLinksJson : []).map((link: any) => ({
        label: String(link.label || ''),
        url: formatUrl(String(link.url || ''))
      })) as FooterLink[];

      return {
        profile,
        settings: {
          ...settings,
          footer_links: parsedFooterLinks,
          menu_items: parsedMenuItems,
        },
        products,
      };
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
};

const formatUrl = (url: string): string => {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.includes('.') && !url.includes(' ')) {
    return `https://${url}`;
  }
  if (url.startsWith('/')) {
    return url;
  }
  return `/${url}`;
};