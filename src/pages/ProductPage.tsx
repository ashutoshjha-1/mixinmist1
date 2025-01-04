import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductDetails } from "@/components/product/ProductDetails";
import { AddToCartSection } from "@/components/product/AddToCartSection";
import { MenuItem } from "@/integrations/supabase/types/menu";
import { FooterLink } from "@/integrations/supabase/types/footer";

export default function ProductPage() {
  const { username, productId } = useParams<{ username: string; productId: string }>();

  const { data: productData, isLoading, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID is required");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading product...</div>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-gray-600">
          The product you're looking for doesn't exist or might have been removed.
        </p>
      </div>
    );
  }

  const { name, price, image_url, description } = productData;

  return (
    <div className="min-h-screen">
      <StoreHeader username={username} />
      <main className="container mx-auto px-4 py-8">
        <ProductImage imageUrl={image_url} />
        <ProductDetails name={name} price={price} description={description} />
        <AddToCartSection productId={productId} />
      </main>
      <StoreFooter />
    </div>
  );
}
