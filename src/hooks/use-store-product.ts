import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useStoreProduct = (storename: string | undefined, productId: string | undefined) => {
  return useQuery({
    queryKey: ["store-product", storename, productId],
    queryFn: async () => {
      if (!storename || !productId) {
        console.error("Missing required parameters:", { storename, productId });
        throw new Error("Store name and product ID are required");
      }

      console.log("Fetching product data for store:", storename, "product:", productId);

      // First get the profile using store_name
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .ilike("store_name", storename)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch store profile",
        });
        throw profileError;
      }

      if (!profile) {
        console.error("Store not found for name:", storename);
        toast({
          variant: "destructive",
          title: "Store Not Found",
          description: "The store you're looking for doesn't exist.",
        });
        throw new Error("Store not found");
      }

      // Get the product with user-specific pricing and description
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
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch product details",
        });
        throw userProductError;
      }

      if (!userProduct || !userProduct.products) {
        console.error("Product not found:", productId);
        toast({
          variant: "destructive",
          title: "Product Not Found",
          description: "The product you're looking for doesn't exist in this store.",
        });
        throw new Error("Product not found");
      }

      // Return the product with store-specific details
      return {
        id: userProduct.products.id,
        name: userProduct.products.name,
        price: userProduct.custom_price,
        image_url: userProduct.products.image_url,
        description: userProduct.custom_description || userProduct.products.description,
      };
    },
    enabled: !!storename && !!productId,
    retry: false, // Don't retry if store/product is not found
  });
};