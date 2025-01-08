import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStoreProduct = (storename: string | undefined, productId: string | undefined) => {
  return useQuery({
    queryKey: ["store-product", storename, productId],
    queryFn: async () => {
      if (!storename || !productId) {
        throw new Error("Store name and product ID are required");
      }

      // First get the profile using store_name (case-insensitive search)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .ilike("store_name", storename)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (!profile) {
        throw new Error("Store not found");
      }

      // Get the product with user-specific pricing
      const { data: userProduct, error: userProductError } = await supabase
        .from("user_products")
        .select(`
          custom_price,
          custom_description,
          products (
            id,
            name,
            image_url,
            description
          )
        `)
        .eq("user_id", profile.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (userProductError) {
        throw userProductError;
      }

      if (!userProduct || !userProduct.products) {
        throw new Error("Product not found");
      }

      return {
        id: userProduct.products.id,
        name: userProduct.products.name,
        price: userProduct.custom_price,
        image_url: userProduct.products.image_url,
        description: userProduct.custom_description || userProduct.products.description,
      };
    },
    enabled: !!storename && !!productId,
  });
};