import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const navigate = useNavigate();
  const { toast } = useToast();

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

      // Navigate to checkout with prefilled data
      navigate(`/store/sample/product/${product.id}`, {
        state: {
          prefillData: {
            customerName: profile.full_name,
            customerEmail: user.email,
            customerAddress: '', // This would need to be added to the profiles table if you want to prefill it
          }
        }
      });
    } catch (error) {
      console.error("Error handling buy now:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while processing your request.",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products?.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="aspect-square relative">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
            {product.description && (
              <p className="text-sm text-gray-500 mb-4">{product.description}</p>
            )}
            <Button 
              className="w-full"
              onClick={() => handleBuyNow(product)}
            >
              Buy Now
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};