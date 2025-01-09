import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StoreSettings } from "@/integrations/supabase/types/store-settings";

export const useStoreSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ["store-settings"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("store_name")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) throw profileError;
        if (!profile) throw new Error("Profile not found");

        const { data, error } = await supabase
          .from("store_settings")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error("Store settings not found");

        // Parse JSON fields
        const menuItems = Array.isArray(data.menu_items) 
          ? data.menu_items.map((item: any) => ({
              label: String(item?.label || ''),
              url: String(item?.url || '')
            }))
          : [];

        const bottomMenuItems = Array.isArray(data.bottom_menu_items)
          ? data.bottom_menu_items.map((item: any) => ({
              label: String(item?.label || ''),
              url: String(item?.url || '')
            }))
          : [];

        const footerLinks = Array.isArray(data.footer_links)
          ? data.footer_links.map((link: any) => ({
              label: String(link?.label || ''),
              url: String(link?.url || '')
            }))
          : [];

        const carouselImages = Array.isArray(data.carousel_images)
          ? data.carousel_images.map((image: any) => ({
              url: String(image?.url || ''),
              buttonText: image?.buttonText ? String(image.buttonText) : undefined,
              buttonUrl: image?.buttonUrl ? String(image.buttonUrl) : undefined
            }))
          : [];

        return { 
          ...data, 
          store_name: profile.store_name,
          menu_items: menuItems,
          bottom_menu_items: bottomMenuItems,
          footer_links: footerLinks,
          carousel_images: carouselImages,
          wave_color: data.wave_color || '#4F46E5',
          show_wave_design: data.show_wave_design ?? true
        } as StoreSettings;
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error fetching settings",
          description: error.message,
        });
        throw error;
      }
    },
    retry: 1,
  });

  const updateSettings = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const menuItems = formData.get("menu_items");
      const bottomMenuItems = formData.get("bottom_menu_items");
      const footerLinks = formData.get("footer_links");
      const carouselImages = formData.get("carousel_images");
      
      const newSettings = {
        hero_title: String(formData.get("hero_title") || ""),
        hero_subtitle: String(formData.get("hero_subtitle") || ""),
        hero_image_url: String(formData.get("hero_image_url") || ""),
        footer_text: String(formData.get("footer_text") || ""),
        theme_color: String(formData.get("theme_color") || ""),
        custom_domain: String(formData.get("custom_domain") || ""),
        icon_image_url: String(formData.get("icon_image_url") || ""),
        menu_items: menuItems ? JSON.parse(menuItems as string) : [],
        bottom_menu_items: bottomMenuItems ? JSON.parse(bottomMenuItems as string) : [],
        footer_links: footerLinks ? JSON.parse(footerLinks as string) : [],
        carousel_images: carouselImages ? JSON.parse(carouselImages as string) : [],
        wave_color: String(formData.get("wave_color") || "#4F46E5"),
        show_wave_design: formData.get("show_wave_design") === "true"
      };

      const { data, error } = await supabase
        .from("store_settings")
        .update(newSettings)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-settings"] });
      toast({
        title: "Settings updated",
        description: "Your store settings have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings: " + error.message,
      });
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateSettings
  };
};