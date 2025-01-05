import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { ProductGrid } from "@/components/dashboard/products/ProductGrid";
import { ProductSearch } from "@/components/dashboard/products/ProductSearch";
import { ProductManagement } from "@/components/dashboard/products/ProductManagement";
import { useAdminCheck } from "@/hooks/use-admin-check";

const FindProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: isAdmin = false, isLoading: isAdminLoading } = useAdminCheck();

  const { data: products, isLoading: isProductsLoading, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error("User error:", userError);
        navigate("/signin");
        return [];
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  const handleAddToStore = async (
    productId: string,
    customPrice: number,
    customName: string,
    customDescription: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data: existingProduct } = await supabase
        .from("user_products")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (existingProduct) {
        toast({
          title: "Product Already Added",
          description: "This product is already in your store",
        });
        setAddedProducts(prev => new Set([...prev, productId]));
        return;
      }

      const { error } = await supabase
        .from("user_products")
        .insert({
          user_id: user.id,
          product_id: productId,
          custom_price: customPrice,
          custom_description: customDescription,
        });

      if (error) throw error;

      setAddedProducts(prev => new Set([...prev, productId]));

      toast({
        title: "Product Added",
        description: "Product has been added to your store",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding product",
        description: error.message,
      });
    }
  };

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLoading = isAdminLoading || isProductsLoading;

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  console.log("Is admin:", isAdmin);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="ml-64 p-8">
        <DashboardHeader onSignOut={handleSignOut} />

        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-4">FIND PRODUCTS - ALL</h1>
          <ProductSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isAdmin={isAdmin}
            onAddNewProduct={() => setIsAdminDialogOpen(true)}
          />
        </div>

        <ProductGrid
          products={filteredProducts}
          isAdmin={isAdmin}
          addedProducts={addedProducts}
          onAddToStore={handleAddToStore}
        />

        {isAdmin && (
          <ProductManagement 
            isAdminDialogOpen={isAdminDialogOpen}
            setIsAdminDialogOpen={setIsAdminDialogOpen}
            onSuccess={() => {
              refetch();
              setIsAdminDialogOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FindProducts;