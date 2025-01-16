import { useState } from "react";
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
        // If unchecking sample checkbox, find and delete the sample product
        if (!productData.is_sample && editingProduct.is_sample) {
          // Find the sample product with the same name pattern
          const { data: sampleProducts, error: findError } = await supabase
            .from("products")
            .select("id")
            .eq("name", editingProduct.name)
            .eq("is_sample", true);

          if (findError) throw findError;

          // Delete the found sample product
          if (sampleProducts && sampleProducts.length > 0) {
            const { error: deleteError } = await supabase
              .from("products")
              .delete()
              .eq("id", sampleProducts[0].id);

            if (deleteError) throw deleteError;

            toast({
              title: "Success",
              description: "Sample product removed successfully",
            });
          }
        }
        // If checking sample checkbox, create a new sample product
        else if (productData.is_sample && !editingProduct.is_sample) {
          // Create a new sample product as a copy
          const { error: insertError } = await supabase
            .from("products")
            .insert([{
              name: productData.name,
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
        }

        // Regular update for the original product
        const { error } = await supabase
          .from("products")
          .update({
            name: productData.name,
            price: productData.price,
            description: productData.description,
            image_url: productData.image_url,
          })
          .eq("id", editingProduct.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        // New product creation
        const { error } = await supabase
          .from("products")
          .insert([{
            name: productData.name,
            price: productData.price,
            description: productData.description,
            image_url: productData.image_url,
            is_sample: false,
          }]);

        if (error) throw error;

        // If sample is checked, create an additional sample product
        if (productData.is_sample) {
          const { error: sampleError } = await supabase
            .from("products")
            .insert([{
              name: productData.name,
              price: productData.price,
              description: productData.description,
              image_url: productData.image_url,
              is_sample: true,
            }]);

          if (sampleError) throw sampleError;

          toast({
            title: "Success",
            description: "Product and sample product added successfully",
          });
        } else {
          toast({
            title: "Success",
            description: "Product added successfully",
          });
        }
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