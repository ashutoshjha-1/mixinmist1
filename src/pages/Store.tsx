import { useParams } from "react-router-dom";
import { StoreHero } from "@/components/store/StoreHero";
import { StoreProducts } from "@/components/store/StoreProducts";
import { StoreFooter } from "@/components/store/StoreFooter";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreCarousel } from "@/components/store/StoreCarousel";
import { WaveDesign } from "@/components/store/WaveDesign";
import { CartProvider } from "@/contexts/CartContext";
import { useStoreData } from "@/hooks/use-store-data";
import { MenuItem } from "@/integrations/supabase/types/menu";
import { FooterLink } from "@/integrations/supabase/types/footer";

export default function Store() {
  const { storename } = useParams<{ storename: string }>();
  const { data: storeData, isLoading, error } = useStoreData(storename);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading store...</div>
      </div>
    );
  }

  if (error || !storeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Store not found</h1>
        <p className="text-gray-600">
          The store you're looking for doesn't exist or might have been removed.
        </p>
      </div>
    );
  }

  const { settings, products } = storeData;

  // Ensure menu items and footer links are properly typed
  const menuItems = (settings.menu_items || []) as MenuItem[];
  const footerLinks = (settings.footer_links || []) as FooterLink[];
  const bottomMenuItems = (settings.bottom_menu_items || []) as MenuItem[];
  const carouselImages = (settings.carousel_images || []).map((image: any) => ({
    url: image.url,
    buttonText: image.buttonText,
    buttonUrl: image.buttonUrl,
  }));

  return (
    <CartProvider>
      <div className="min-h-screen">
        <StoreHeader 
          iconImageUrl={settings.icon_image_url}
          menuItems={menuItems}
        />
        <StoreHero
          heroImageUrl={settings.hero_image_url}
          themeColor={settings.theme_color}
          title={settings.hero_title}
          subtitle={settings.hero_subtitle}
        />
        {settings.show_wave_design && (
          <WaveDesign 
            color={settings.wave_color || settings.theme_color} 
            className="transform -mt-1"
          />
        )}
        <StoreCarousel images={carouselImages} />
        <StoreProducts products={products} />
        <StoreFooter
          themeColor={settings.theme_color}
          footerText={settings.footer_text}
          footerLinks={footerLinks}
          bottomMenuItems={bottomMenuItems}
        />
      </div>
    </CartProvider>
  );
}