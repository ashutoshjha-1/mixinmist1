import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useStoreProduct } from "@/hooks/use-store-product";
import { StoreHeader } from "@/components/store/StoreHeader";
import { ProductDetails } from "@/components/store/ProductDetails";
import { useStoreData } from "@/hooks/use-store-data";
import { toast } from "@/components/ui/use-toast";

export default function ProductPage() {
  const { storename, productId } = useParams<{ storename: string; productId: string }>();
  
  // Fetch store data first
  const { data: storeData, isLoading: isLoadingStore, error: storeError } = useStoreData(storename);
  
  // Then fetch product data
  const { data: product, isLoading: isLoadingProduct, error: productError } = useStoreProduct(storename, productId);

  // Handle loading states
  if (isLoadingStore || isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Handle store error
  if (storeError || !storeData) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Store not found",
    });
    return <Navigate to="/" />;
  }

  // Handle product error
  if (productError || !product) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Product not found",
    });
    return <Navigate to={`/store/${storename}`} />;
  }

  const { settings } = storeData;

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader
        iconImageUrl={settings.icon_image_url}
        menuItems={settings.menu_items}
      />
      <ProductDetails product={product} />
    </div>
  );
}