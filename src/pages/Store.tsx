import { useParams } from "react-router-dom";
import { StoreHero } from "@/components/store/StoreHero";
import { StoreProducts } from "@/components/store/StoreProducts";
import { StoreFooter } from "@/components/store/StoreFooter";
import { StoreHeader } from "@/components/store/StoreHeader";
import { CartProvider } from "@/contexts/CartContext";
import { useStoreData } from "@/hooks/use-store-data";
import { MenuItem } from "@/integrations/supabase/types/menu";
import { FooterLink } from "@/integrations/supabase/types/footer";
import { Carousel } from "@/components/ui/carousel";

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

  return (
    <CartProvider>
      <div className="min-h-screen">
        <StoreHeader 
          iconImageUrl={settings.icon_image_url}
          menuItems={menuItems}
        />
        {settings.show_hero && (
          <StoreHero
            heroImageUrl={settings.hero_image_url}
            themeColor={settings.theme_color}
            title={settings.hero_title}
            subtitle={settings.hero_subtitle}
          />
        )}
        {settings.show_carousel && settings.carousel_images && settings.carousel_images.length > 0 && (
          <Carousel className="w-full">
            {settings.carousel_images.map((image, index) => (
              <div key={index} className="relative h-[500px]">
                <img 
                  src={image.url} 
                  alt={`Carousel image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {image.buttonText && image.buttonUrl && (
                  <a
                    href={image.buttonUrl}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    {image.buttonText}
                  </a>
                )}
              </div>
            ))}
          </Carousel>
        )}
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