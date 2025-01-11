import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useAdminCheck } from "@/hooks/use-admin-check";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "@/components/dashboard/orders/OrdersTable";
import { useOrders } from "@/hooks/use-orders";

const CustomerOrders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: isAdmin } = useAdminCheck();
  const [userId, setUserId] = useState<string | undefined>(undefined);

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
  }, [navigate, toast]);

  const { orders, allUserOrders } = useOrders(userId, isAdmin);

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="ml-64 p-8">
        <DashboardHeader onSignOut={() => {}} />
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