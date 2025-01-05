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
    fetchOrders();
    if (isAdmin) {
      fetchAllUserOrders();
    }
  }, [isAdmin]);

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            price,
            created_at
          )
        `)
        .eq('store_id', user.id)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      const ordersWithItems = ordersData?.map(order => ({
        ...order,
        order_items: order.order_items || []
      })) || [];

      console.log("Fetched orders with items:", ordersWithItems);
      setOrders(ordersWithItems);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching orders",
        description: error.message,
      });
    }
  };

  const fetchAllUserOrders = async () => {
    try {
      // First fetch all orders with order items
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            price,
            created_at
          )
        `)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      // Then fetch store names for all unique store IDs
      const uniqueStoreIds = [...new Set(ordersData?.map(order => order.store_id) || [])];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, store_name")
        .in("id", uniqueStoreIds);

      if (profilesError) throw profilesError;

      // Create a map of store IDs to store names
      const storeNameMap = new Map(
        profilesData?.map(profile => [profile.id, profile.store_name])
      );

      // Combine orders with store names
      const ordersWithStoreNames = ordersData?.map(order => ({
        ...order,
        order_items: order.order_items || [],
        store_name: storeNameMap.get(order.store_id) || "Unknown Store"
      })) || [];

      console.log("All user orders with items:", ordersWithStoreNames);
      setAllUserOrders(ordersWithStoreNames);
    } catch (error: any) {
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