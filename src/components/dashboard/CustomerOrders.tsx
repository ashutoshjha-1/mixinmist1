import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useAdminCheck } from "@/hooks/use-admin-check";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "@/components/dashboard/orders/OrdersTable";

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
  store_id: string;
  store_name?: string;
}

const CustomerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [allUserOrders, setAllUserOrders] = useState<Order[]>([]);
  const { toast } = useToast();
  const { data: isAdmin } = useAdminCheck();

  useEffect(() => {
    const initializeData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Auth error:", userError);
          throw userError;
        }

        if (!user) {
          console.error("No authenticated user found");
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Please sign in to view orders",
          });
          return;
        }

        console.log("Current user:", user);
        await fetchOrders(user.id);
        
        if (isAdmin) {
          await fetchAllUserOrders();
        }
      } catch (error: any) {
        console.error("Initialization error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to initialize data. Please try refreshing the page.",
        });
      }
    };

    initializeData();
  }, [isAdmin]);

  const fetchOrders = async (userId: string) => {
    try {
      console.log("Fetching orders for user:", userId);
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq('store_id', userId)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        throw ordersError;
      }

      console.log("Fetched orders data:", ordersData);

      const ordersWithItems = ordersData?.map(order => ({
        ...order,
        order_items: order.order_items || []
      })) || [];

      console.log("Processed orders with items:", ordersWithItems);
      setOrders(ordersWithItems);
    } catch (error: any) {
      console.error("Error in fetchOrders:", error);
      toast({
        variant: "destructive",
        title: "Error fetching orders",
        description: error.message,
      });
    }
  };

  const fetchAllUserOrders = async () => {
    try {
      console.log("Fetching all user orders as admin");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error("Error fetching all orders:", ordersError);
        throw ordersError;
      }

      console.log("Fetched all orders data:", ordersData);

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, store_name");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      console.log("Fetched profiles data:", profilesData);

      const storeNameMap = new Map(
        profilesData?.map(profile => [profile.id, profile.store_name]) || []
      );

      const ordersWithStoreNames = ordersData?.map(order => ({
        ...order,
        order_items: order.order_items || [],
        store_name: storeNameMap.get(order.store_id) || "Unknown Store"
      })) || [];

      console.log("Processed all orders with store names:", ordersWithStoreNames);
      setAllUserOrders(ordersWithStoreNames);
    } catch (error: any) {
      console.error("Error in fetchAllUserOrders:", error);
      toast({
        variant: "destructive",
        title: "Error fetching all user orders",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="ml-64 p-8">
        <Tabs defaultValue="customer-orders" className="w-full">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
            <TabsList>
              <TabsTrigger value="customer-orders">Customer Orders</TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="all-orders">All User Orders</TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="customer-orders">
            <OrdersTable orders={orders} />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="all-orders">
              <OrdersTable orders={allUserOrders} showStoreName={true} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerOrders;