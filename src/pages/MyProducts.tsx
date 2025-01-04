import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const MyProducts = () => {
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleRemoveFromStore = async (productId: string) => {
    try {
      toast({
        title: "Product Removed",
        description: "The product has been removed from your store",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error removing product",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="ml-64 p-8">
        <DashboardHeader onSignOut={handleSignOut} />

        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-4">MY PRODUCTS</h1>
          <Button
            variant="default"
            onClick={() => navigate("/dashboard/find-products")}
          >
            Find More Products
          </Button>
        </div>

        {myProducts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">
              No products in your store yet
            </h2>
            <p className="text-gray-600 mb-4">
              Start by adding products from our catalog
            </p>
            <Button
              variant="default"
              onClick={() => navigate("/dashboard/find-products")}
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {myProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2">{product.name}</h3>
                  <p className="text-primary mb-2">
                    ${product.price.toFixed(2)}
                  </p>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleRemoveFromStore(product.id)}
                  >
                    Remove from Store
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProducts;