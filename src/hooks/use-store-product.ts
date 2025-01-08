import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useStoreProduct = (storename: string | undefined, productId: string | undefined) => {
  return useQuery({
    queryKey: ["store-product", storename, productId],
    queryFn: async () => {
      if (!storename || !productId) {
        throw new Error("Store name and product ID are required");
      }

      console.log("Fetching product data for store:", storename, "product:", productId);

      // First get the profile using store_name
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("store_name", storename)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }

      if (!profile) {
        console.error("Store not found:", storename);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Store not found",
        });
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
        console.error("Product fetch error:", userProductError);
        throw userProductError;
      }

      if (!userProduct || !userProduct.products) {
        console.error("Product not found:", productId);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Product not found",
        });
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
    retry: false,
  });
};