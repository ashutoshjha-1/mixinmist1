import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useAdminCheck } from "@/hooks/use-admin-check";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "@/components/dashboard/orders/OrdersTable";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
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

      // First fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq('store_id', user.id)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      // Then fetch order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: items, error: itemsError } = await supabase
            .from("order_items")
            .select("*")
            .eq('order_id', order.id);

          if (itemsError) {
            console.error("Error fetching items for order", order.id, itemsError);
            return { ...order, order_items: [] };
          }

          return { ...order, order_items: items || [] };
        })
      );

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
      setIsRefreshing(true);
      // First fetch all orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: items, error: itemsError } = await supabase
            .from("order_items")
            .select("*")
            .eq('order_id', order.id);

          if (itemsError) {
            console.error("Error fetching items for order", order.id, itemsError);
            return { ...order, order_items: [] };
          }

          return { ...order, order_items: items || [] };
        })
      );

      // Fetch store names
      const uniqueStoreIds = [...new Set(ordersWithItems.map(order => order.store_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, store_name")
        .in("id", uniqueStoreIds);

      if (profilesError) throw profilesError;

      const storeNameMap = new Map(
        profilesData?.map(profile => [profile.id, profile.store_name])
      );

      const ordersWithStoreNames = ordersWithItems.map(order => ({
        ...order,
        store_name: storeNameMap.get(order.store_id) || "Unknown Store"
      }));

      console.log("All user orders with items:", ordersWithStoreNames);
      setAllUserOrders(ordersWithStoreNames);

      toast({
        title: "Orders refreshed successfully",
        description: "The orders list has been updated with the latest data.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching all user orders",
        description: error.message,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchAllUserOrders();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="ml-64 p-8">
        <Tabs defaultValue="customer-orders" className="w-full">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
            <div className="flex items-center gap-4">
              <TabsList>
                <TabsTrigger value="customer-orders">Customer Orders</TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="all-orders">All User Orders</TabsTrigger>
                )}
              </TabsList>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}
            </div>
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