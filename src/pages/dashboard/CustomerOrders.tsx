import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useAdminCheck } from "@/hooks/use-admin-check";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "@/components/dashboard/orders/OrdersTable";
import { Order } from "@/types/order";

const CustomerOrders = () => {
  const { toast } = useToast();
  const { data: isAdmin } = useAdminCheck();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allUserOrders, setAllUserOrders] = useState<Order[]>([]);

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
        setUserId(user.id);

        // Fetch orders for the current user
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select(`
            *,
            order_items (
              id,
              order_id,
              product_id,
              quantity,
              price,
              created_at
            )
          `)
          .eq('store_id', user.id)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        console.log("Fetched orders:", ordersData);
        setOrders(ordersData || []);

        // If admin, fetch all user orders
        if (isAdmin) {
          const { data: allOrdersData, error: allOrdersError } = await supabase
            .from("orders")
            .select(`
              *,
              order_items (
                id,
                order_id,
                product_id,
                quantity,
                price,
                created_at
              )
            `)
            .order('created_at', { ascending: false });

          if (allOrdersError) throw allOrdersError;

          // Fetch store names
          const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("id, store_name");

          if (profilesError) throw profilesError;

          const storeNameMap = new Map(
            profilesData?.map(profile => [profile.id, profile.store_name])
          );

          const ordersWithStoreNames = allOrdersData?.map(order => ({
            ...order,
            store_name: storeNameMap.get(order.store_id) || "Unknown Store"
          })) || [];

          console.log("All user orders with items:", ordersWithStoreNames);
          setAllUserOrders(ordersWithStoreNames);
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