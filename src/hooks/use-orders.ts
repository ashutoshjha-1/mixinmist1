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
        .eq('store_id', userId)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        throw ordersError;
      }

      console.log("Fetched orders data:", ordersData);
      
      // Ensure order_items is always an array
      const processedOrders = ordersData?.map(order => ({
        ...order,
        order_items: Array.isArray(order.order_items) ? order.order_items : []
      })) || [];
      
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
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error("Error fetching all orders:", ordersError);
        throw ordersError;
      }

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, store_name");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      const storeNameMap = new Map(
        profilesData?.map(profile => [profile.id, profile.store_name]) || []
      );

      // Process orders to ensure order_items is always an array
      const processedOrders = ordersData?.map(order => ({
        ...order,
        store_name: storeNameMap.get(order.store_id) || "Unknown Store",
        order_items: Array.isArray(order.order_items) ? order.order_items : []
      })) || [];

      console.log("Processed all orders with store names:", processedOrders);
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