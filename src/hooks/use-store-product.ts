import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStoreProduct = (storeName: string | undefined, productId: string | undefined) => {
  return useQuery({
    queryKey: ["store-product", storeName?.toLowerCase(), productId],
    queryFn: async () => {
      if (!storeName || !productId) {
        console.error("Store name and product ID are required");
        throw new Error("Store name and product ID are required");
      }
      
      console.log("Fetching product for store:", storeName, "product:", productId);
      
      // First get the profile ID for the store
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", storeName)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }

      if (!profile) {
        console.error("Store not found for username:", storeName);
        throw new Error("Store not found");
      }

      console.log("Found profile:", profile);

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

      console.log("User product query result:", userProduct);

      if (userProductError) {
        console.error("Product fetch error:", userProductError);
        throw userProductError;
      }

      if (!userProduct) {
        console.error("Product not found for store:", storeName, "product:", productId);
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
    enabled: !!storeName && !!productId,
  });
};