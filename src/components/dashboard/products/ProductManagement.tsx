import { useState, useEffect } from "react";
import { AdminProductDialog } from "@/components/store/AdminProductDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductManagementProps {
  isAdminDialogOpen: boolean;
  setIsAdminDialogOpen: (open: boolean) => void;
  onSuccess?: () => void;
  editingProduct?: any;
}

export const ProductManagement = ({ 
  isAdminDialogOpen, 
  setIsAdminDialogOpen,
  onSuccess,
  editingProduct 
}: ProductManagementProps) => {
  const { toast } = useToast();

  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        // If the product is marked as sample, create a new sample product
        if (productData.is_sample && !editingProduct.is_sample) {
          // Create a new sample product as a copy
          const { error: insertError } = await supabase
            .from("products")
            .insert([{
              name: `${productData.name} (Sample)`,
              price: productData.price,
              description: productData.description,
              image_url: productData.image_url,
              is_sample: true,
            }]);

          if (insertError) throw insertError;

          toast({
            title: "Success",
            description: "Sample product created successfully",
          });
        } else {
          // Regular update
          const { error } = await supabase
            .from("products")
            .update({
              name: productData.name,
              price: productData.price,
              description: productData.description,
              image_url: productData.image_url,
              is_sample: productData.is_sample,
            })
            .eq("id", editingProduct.id);

          if (error) throw error;

          toast({
            title: "Success",
            description: "Product updated successfully",
          });
        }
      } else {
        // New product creation
        const { error } = await supabase
          .from("products")
          .insert([{
            name: productData.is_sample ? `${productData.name} (Sample)` : productData.name,
            price: productData.price,
            description: productData.description,
            image_url: productData.image_url,
            is_sample: productData.is_sample,
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: productData.is_sample ? "Sample product added successfully" : "Product added successfully",
        });
      }

      setIsAdminDialogOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <>
      <AdminProductDialog
        isOpen={isAdminDialogOpen}
        onClose={() => {
          setIsAdminDialogOpen(false);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </>
  );
};