import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useAdminCheck } from "@/hooks/use-admin-check";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            product_id,
            quantity,
            price
          )
        `)
        .eq('store_id', user.id)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      setOrders(ordersData || []);
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
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            product_id,
            quantity,
            price
          ),
          profiles!orders_store_id_fkey (
            store_name
          )
        `)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      const ordersWithStoreName = ordersData?.map(order => ({
        ...order,
        store_name: order.profiles?.store_name
      })) || [];

      setAllUserOrders(ordersWithStoreName);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching all user orders",
        description: error.message,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-primary-100 text-primary-800 hover:bg-primary-200";
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const OrdersTable = ({ orders, showStoreName = false }: { orders: Order[], showStoreName?: boolean }) => (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[200px] font-medium">Order ID</TableHead>
            {showStoreName && (
              <TableHead className="font-medium">Store</TableHead>
            )}
            <TableHead className="font-medium">Customer</TableHead>
            <TableHead className="font-medium">Date</TableHead>
            <TableHead className="font-medium">Amount</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="font-medium text-right">Items</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-muted/50">
              <TableCell className="font-mono text-sm">{order.id}</TableCell>
              {showStoreName && (
                <TableCell>{order.store_name}</TableCell>
              )}
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium leading-none">
                    {order.customer_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer_email}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(order.created_at)}
              </TableCell>
              <TableCell className="font-medium">
                ${order.total_amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={`${getStatusColor(order.status)}`}
                >
                  {order.status.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {order.order_items.length} item(s)
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

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