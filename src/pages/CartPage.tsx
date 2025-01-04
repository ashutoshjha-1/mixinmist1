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

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const { username } = useParams();
  const navigate = useNavigate();

  const { data: storeData } = useQuery({
    queryKey: ["store-settings", username],
    queryFn: async () => {
      if (!username) throw new Error("Store username is required");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", username)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error("Store not found");

      const { data: settings, error: settingsError } = await supabase
        .from("store_settings")
        .select("*")
        .eq("user_id", profile.id)
        .maybeSingle();

      if (settingsError) throw settingsError;
      if (!settings) throw new Error("Store settings not found");

      return settings;
    },
  });

  if (!storeData) return null;

  const menuItems: MenuItem[] = Array.isArray(storeData.menu_items) 
    ? (storeData.menu_items as any[]).map(item => ({
        label: String(item.label || ''),
        url: String(item.url || '')
      }))
    : [];

  const footerLinks: FooterLink[] = Array.isArray(storeData.footer_links)
    ? (storeData.footer_links as any[]).map(link => ({
        label: String(link.label || ''),
        url: String(link.url || '')
      }))
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <StoreHeader 
        iconImageUrl={storeData.icon_image_url} 
        menuItems={menuItems}
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
        footerLinks={footerLinks}
      />
    </div>
  );
}
