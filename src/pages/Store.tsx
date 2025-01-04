import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Store() {
  const { storeName } = useParams();
  const { toast } = useToast();

  const { data: storeData, isLoading: isLoadingStore } = useQuery({
    queryKey: ["store", storeName],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select(`
          *,
          store_settings(*),
          user_products(
            products(*)
          )
        `)
        .eq("store_name", storeName)
        .single();

      if (error) throw error;
      return profiles;
    },
  });

  if (isLoadingStore) {
    return <div>Loading store...</div>;
  }

  if (!storeData) {
    return <div>Store not found</div>;
  }

  const settings = storeData.store_settings;
  const products = storeData.user_products.map((up: any) => up.products);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-[500px] flex items-center justify-center"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${settings.hero_image_url || '/placeholder.svg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">{settings.hero_title}</h1>
          <p className="text-xl">{settings.hero_subtitle}</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Our Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: any) => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">${product.price}</p>
                <Button className="w-full">View Details</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer 
        className="bg-gray-900 text-white py-12"
        style={{ backgroundColor: settings.theme_color }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">{storeData.store_name}</h3>
              <p>{settings.footer_text}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {settings.footer_links.map((link: any) => (
                  <li key={link.url}>
                    <a href={link.url} className="hover:underline">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p>Get in touch with us</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}