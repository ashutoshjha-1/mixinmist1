import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { CheckoutForm } from "@/components/store/CheckoutForm";
import { MenuItem } from "@/integrations/supabase/types/menu";
import { FooterLink } from "@/integrations/supabase/types/footer";
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const { username } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: storeData, isLoading } = useQuery({
    queryKey: ["store-settings", username],
    queryFn: async () => {
      if (!username) {
        console.error("Username is missing");
        throw new Error("Store username is required");
      }

      console.log("Fetching store data for username:", username);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
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

      // Parse menu_items and footer_links from JSON
      const menuItemsJson = settings.menu_items || [];
      const footerLinksJson = settings.footer_links || [];

      const menuItems: MenuItem[] = Array.isArray(menuItemsJson) 
        ? menuItemsJson.map((item: any) => ({
            label: String(item.label || ''),
            url: String(item.url || '')
          }))
        : [];

      const footerLinks: FooterLink[] = Array.isArray(footerLinksJson)
        ? footerLinksJson.map((link: any) => ({
            label: String(link.label || ''),
            url: String(link.url || '')
          }))
        : [];

      return {
        ...settings,
        menu_items: menuItems,
        footer_links: footerLinks
      };
    },
    retry: 1,
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching store data:", error);
        toast({
          variant: "destructive",
          title: "Error loading store",
          description: error.message
        });
      }
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading cart...</div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Store not found</h1>
        <p className="text-gray-600">
          The store you're looking for doesn't exist or might have been removed.
        </p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <StoreHeader 
        iconImageUrl={storeData.icon_image_url} 
        menuItems={storeData.menu_items}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Button onClick={() => navigate(`/store/${username}`)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-500">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value))
                        }
                        className="w-16 px-2 py-1 border rounded"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Checkout</h2>
                <CheckoutForm onSuccess={() => navigate(`/store/${username}`)} />
              </div>
            </div>
          )}
        </div>
      </main>

      <StoreFooter
        themeColor={storeData.theme_color || '#4F46E5'}
        footerText={storeData.footer_text || ''}
        footerLinks={storeData.footer_links}
      />
    </div>
  );
}