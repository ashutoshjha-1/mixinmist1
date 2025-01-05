import { useParams } from "react-router-dom";
import { StoreHero } from "@/components/store/StoreHero";
import { StoreProducts } from "@/components/store/StoreProducts";
import { StoreFooter } from "@/components/store/StoreFooter";
import { StoreHeader } from "@/components/store/StoreHeader";
import { CartProvider } from "@/contexts/CartContext";
import { useStoreData } from "@/hooks/use-store-data";

export default function Store() {
  const { username } = useParams<{ username: string }>();
  const { data: storeData, isLoading, error } = useStoreData(username);

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

  return (
    <CartProvider>
      <div className="min-h-screen">
        <StoreHeader 
          iconImageUrl={settings.icon_image_url}
          menuItems={settings.menu_items}
        />
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
          bottomMenuItems={settings.bottom_menu_items}
        />
      </div>
    </CartProvider>
  );
}