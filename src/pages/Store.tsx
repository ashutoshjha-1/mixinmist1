import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FooterLink {
  label: string;
  url: string;
}

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

      // First get the profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("store_name", decodeURIComponent(storeName))
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error("Store not found");

      // Then get the store settings
      const { data: settings, error: settingsError } = await supabase
        .from("store_settings")
        .select("*")
        .eq("user_id", profile.id)
        .maybeSingle();

      if (settingsError) throw settingsError;
      if (!settings) throw new Error("Store settings not found");

      // Get the products
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

      // Parse the footer_links JSON
      const parsedSettings = {
        ...settings,
        footer_links: (settings.footer_links || []) as FooterLink[],
      };

      return {
        profile,
        settings: parsedSettings,
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

  const { profile, settings, products } = storeData;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: settings.hero_image_url
            ? `url(${settings.hero_image_url})`
            : "none",
          backgroundColor: settings.hero_image_url ? undefined : settings.theme_color,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
          <h1 className="text-5xl font-bold mb-4">{settings.hero_title}</h1>
          <p className="text-xl">{settings.hero_subtitle}</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Our Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-lg font-bold text-primary">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer
        className="py-12 px-4"
        style={{ backgroundColor: settings.theme_color }}
      >
        <div className="max-w-7xl mx-auto text-white">
          <p className="text-center mb-4">{settings.footer_text}</p>
          <div className="flex justify-center space-x-4">
            {settings.footer_links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}