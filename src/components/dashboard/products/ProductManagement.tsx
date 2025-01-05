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
        const { error } = await supabase
          .from("products")
          .insert([{
            name: productData.name,
            price: productData.price,
            description: productData.description,
            image_url: productData.image_url,
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product added successfully",
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