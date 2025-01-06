import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useAdminCheck } from "@/hooks/use-admin-check";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "@/components/dashboard/orders/OrdersTable";
import { useOrders } from "@/hooks/use-orders";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CustomerOrders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: isAdmin } = useAdminCheck();
  const [userId, setUserId] = useState<string | undefined>(undefined);

  // Fetch all products for the sample orders section
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Create sample orders from products
  const sampleOrders = products?.map((product) => ({
    id: product.id,
    store_id: userId || "",
    customer_name: "Sample Customer",
    customer_email: "sample@example.com",
    customer_address: "123 Sample St",
    total_amount: product.price,
    status: "PAID",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    order_items: [{
      id: product.id,
      order_id: product.id,
      product_id: product.id,
      quantity: 1,
      price: product.price,
      created_at: new Date().toISOString()
    }]
  }));

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          navigate("/signin");
          return;
        }

        if (!session) {
          console.log("No session found, redirecting to signin");
          navigate("/signin");
          return;
        }

        console.log("Session found:", session.user.id);
        setUserId(session.user.id);

      } catch (error: any) {
        console.error("Auth check error:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please sign in to view orders",
        });
        navigate("/signin");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUserId(session.user.id);
      } else {
        navigate("/signin");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const { orders, allUserOrders } = useOrders(userId, isAdmin);

  if (!userId) {
    return null;
  }

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
              <TabsTrigger value="sample-orders">Sample Orders</TabsTrigger>
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

          <TabsContent value="sample-orders">
            <Card>
              <CardHeader>
                <CardTitle>Sample Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <OrdersTable orders={sampleOrders || []} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerOrders;