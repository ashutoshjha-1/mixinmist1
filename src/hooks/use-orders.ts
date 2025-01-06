import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/order";
import { useToast } from "@/hooks/use-toast";

export const useOrders = (userId: string | undefined, isAdmin: boolean | undefined) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [allUserOrders, setAllUserOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  const fetchOrders = async (userId: string) => {
    try {
      console.log("Fetching orders for user:", userId);
      
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
            created_at,
            products (
              is_sample
            )
          ),
          store:profiles (
            store_name
          )
        `)
        .eq('store_id', userId)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        throw ordersError;
      }

      const processedOrders = ordersData?.map(order => {
        const storeData = order.store as { store_name?: string } | null;
        return {
          ...order,
          store_name: storeData?.store_name,
          order_items: Array.isArray(order.order_items) ? order.order_items : []
        };
      }) || [];
      
      setOrders(processedOrders);
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
            created_at,
            products (
              is_sample
            )
          ),
          store:profiles (
            store_name
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error("Error fetching all orders:", ordersError);
        throw ordersError;
      }

      const processedOrders = ordersData?.map(order => {
        const storeData = order.store as { store_name?: string } | null;
        return {
          ...order,
          store_name: storeData?.store_name,
          order_items: Array.isArray(order.order_items) ? order.order_items : []
        };
      }) || [];

      setAllUserOrders(processedOrders);
    } catch (error: any) {
      console.error("Error in fetchAllUserOrders:", error);
      toast({
        variant: "destructive",
        title: "Error fetching all user orders",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchOrders(userId);
      if (isAdmin) {
        fetchAllUserOrders();
      }
    }
  }, [userId, isAdmin]);

  return { orders, allUserOrders };
};