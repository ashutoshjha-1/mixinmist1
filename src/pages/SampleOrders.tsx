import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminCheck } from "@/hooks/use-admin-check";
import { SampleProductsGrid } from "@/components/sample-orders/SampleProductsGrid";
import { SampleOrdersList } from "@/components/sample-orders/SampleOrdersList";

const SampleOrders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: isAdmin } = useAdminCheck();

  const { data: products, isLoading: productsLoading } = useQuery({
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

  const { data: sampleOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ["sample-orders"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error("User error:", userError);
        navigate("/signin");
        return [];
      }

      // Changed from 'orders' to 'sample_orders' table
      const { data, error } = await supabase
        .from("sample_orders")
        .select(`
          *,
          order_items:sample_order_items (
            id,
            order_id,
            product_id,
            quantity,
            price,
            created_at,
            products (
              is_sample
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching sample orders:", error);
        throw error;
      }

      // Fetch store names for the orders
      const storeIds = [...new Set(data?.map(order => order.store_id) || [])];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, store_name")
        .in('id', storeIds);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      const storeNameMap = new Map(profilesData?.map(profile => [profile.id, profile.store_name]));

      const processedOrders = data?.map(order => ({
        ...order,
        store_name: storeNameMap.get(order.store_id) || "Unknown Store",
        order_items: Array.isArray(order.order_items) ? order.order_items : []
      })) || [];

      return processedOrders;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="ml-64 p-8">
        <DashboardHeader onSignOut={handleSignOut} />

        <Tabs defaultValue="sample-products" className="w-full">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">SAMPLE ORDERS</h1>
            <TabsList>
              <TabsTrigger value="sample-products">Sample Products</TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="sample-orders">My Sample Orders</TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="sample-products">
            <SampleProductsGrid products={products || []} />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="sample-orders">
              <SampleOrdersList 
                orders={sampleOrders || []} 
                isLoading={ordersLoading}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default SampleOrders;