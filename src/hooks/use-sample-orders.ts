import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/order";
import { useToast } from "@/components/ui/use-toast";

export const useSampleOrders = (userId: string | undefined, isAdmin: boolean | undefined) => {
  const [sampleOrders, setSampleOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  const fetchSampleOrders = async (userId: string) => {
    try {
      console.log("Fetching sample orders for user:", userId);
      
      const { data: ordersData, error: ordersError } = await supabase
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
          ),
          store:profiles!store_id(
            store_name,
            username
          )
        `)
        .eq('store_id', userId)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error("Error fetching sample orders:", ordersError);
        throw ordersError;
      }

      console.log("Fetched sample orders data:", ordersData);
      
      const processedOrders = ordersData?.map(order => ({
        ...order,
        store_name: order.store?.store_name || "Unknown Store",
        username: order.store?.username,
        order_items: Array.isArray(order.order_items) ? order.order_items : []
      })) || [];
      
      console.log("Processed sample orders:", processedOrders);
      setSampleOrders(processedOrders);
    } catch (error: any) {
      console.error("Error in fetchSampleOrders:", error);
      toast({
        variant: "destructive",
        title: "Error fetching sample orders",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSampleOrders(userId);
    }
  }, [userId]);

  return { sampleOrders };
};