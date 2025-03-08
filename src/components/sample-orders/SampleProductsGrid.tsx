import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SampleCheckoutDialog } from "./SampleCheckoutDialog";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string;
}

interface SampleProductsGridProps {
  products: Product[];
}

export const SampleProductsGrid = ({ products }: SampleProductsGridProps) => {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<{
    customerName: string;
    customerEmail: string;
    storeName: string;
  } | null>(null);

  const handleBuyNow = async (product: Product) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to place a sample order.",
        });
        return;
      }

      // Get user profile information
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch your profile information.",
        });
        return;
      }

      setSelectedProduct(product);
      setPrefillData({
        customerName: profile.full_name,
        customerEmail: user.email,
        storeName: profile.store_name,
      });
      setDialogOpen(true);
    } catch (error) {
      console.error("Error handling buy now:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while processing your request.",
      });
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_sample: false })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product removed from samples",
      });

      // Refresh the page to update the product list
      window.location.reload();
    } catch (error) {
      console.error("Error removing sample product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove product from samples",
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
            <div className="aspect-square relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
              {product.description && (
                <p className="text-sm text-gray-500 mb-4 flex-grow">{product.description}</p>
              )}
              <div className="space-y-2 mt-auto">
                <Button 
                  className="w-full"
                  onClick={() => handleBuyNow(product)}
                >
                  Buy Now
                </Button>
                <Button 
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleDelete(product.id)}
                >
                  Remove from Samples
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && prefillData && (
        <SampleCheckoutDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          product={selectedProduct}
          prefillData={prefillData}
        />
      )}
    </>
  );
};