import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useStoreProduct } from "@/hooks/use-store-product";
import { StoreHeader } from "@/components/store/StoreHeader";
import { ProductDetails } from "@/components/store/ProductDetails";
import { useStoreData } from "@/hooks/use-store-data";
import { toast } from "@/components/ui/use-toast";

export default function ProductPage() {
  const { storename, productId } = useParams<{ storename: string; productId: string }>();
  
  console.log("ProductPage mounted with params:", { storename, productId });

  // First fetch store data
  const { 
    data: storeData, 
    isLoading: isLoadingStore, 
    error: storeError 
  } = useStoreData(storename);

  // Then fetch product data
  const { 
    data: product, 
    isLoading: isLoadingProduct,
    error: productError
  } = useStoreProduct(storename, productId);

  // Handle loading state
  if (isLoadingStore || isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Handle store error
  if (storeError) {
    console.error("Store error:", storeError);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load store data. Please try again later.",
    });
    return <Navigate to="/" replace />;
  }

  // Handle missing store data
  if (!storeData) {
    console.error("Store data not found");
    toast({
      variant: "destructive",
      title: "Store Not Found",
      description: "The store you're looking for doesn't exist.",
    });
    return <Navigate to="/" replace />;
  }

  // Handle product error
  if (productError) {
    console.error("Product error:", productError);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load product data. Please try again later.",
    });
    return <Navigate to={`/store/${storename}`} replace />;
  }

  // Handle missing product data
  if (!product) {
    console.error("Product not found");
    toast({
      variant: "destructive",
      title: "Product Not Found",
      description: "The product you're looking for doesn't exist in this store.",
    });
    return <Navigate to={`/store/${storename}`} replace />;
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