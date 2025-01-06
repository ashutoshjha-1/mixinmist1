import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/order";
import { useToast } from "@/components/ui/use-toast";

export const useOrders = (userId: string | undefined, isAdmin: boolean | undefined) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [allUserOrders, setAllUserOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  const fetchOrders = async (userId: string) => {
    try {
      console.log("Fetching orders for user:", userId);
      
      // First get the store name for this user
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("store_name")
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }

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
          profiles!orders_store_id_fkey (
            store_name,
            username
          )
        `)
        .eq('store_id', userId)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        throw ordersError;
      }

      console.log("Fetched orders data:", ordersData);
      
      const processedOrders = ordersData?.map(order => ({
        ...order,
        store_name: order.profiles?.store_name || "Unknown Store",
        username: order.profiles?.username,
        order_items: Array.isArray(order.order_items) ? order.order_items : []
      })) || [];
      
      console.log("Processed orders:", processedOrders);
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
          profiles!orders_store_id_fkey (
            store_name,
            username
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error("Error fetching all orders:", ordersError);
        throw ordersError;
      }

      // Filter out orders that contain sample products
      const nonSampleOrders = ordersData?.filter(order => 
        !order.order_items.some(item => item.products?.is_sample)
      ) || [];

      // Process orders and ensure order_items is always an array
      const processedOrders = nonSampleOrders.map(order => ({
        ...order,
        store_name: order.profiles?.store_name || "Unknown Store",
        username: order.profiles?.username,
        order_items: Array.isArray(order.order_items) ? order.order_items : []
      }));

      console.log("Processed all orders:", processedOrders);
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