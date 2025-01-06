import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string;
}

const SampleOrders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery({
    queryKey: ["sample-products"],
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
        .eq('is_sample', true)
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

  const handleBuyNow = (product: Product) => {
    navigate(`/store/sample/product/${product.id}`);
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="ml-64 p-8">
        <DashboardHeader onSignOut={handleSignOut} />

        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-4">SAMPLE ORDERS</h1>
        </div>

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
      </div>
    </div>
  );
};

export default SampleOrders;