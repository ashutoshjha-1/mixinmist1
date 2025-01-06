import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";
import { OrderItemsDialog } from "./OrderItemsDialog";
import { Badge } from "@/components/ui/badge";
import { useAdminCheck } from "@/hooks/use-admin-check";

interface OrdersTableRowProps {
  order: Order;
  showStoreName?: boolean;
  showUsername?: boolean;
  getStatusColor: (status: string) => string;
  formatDate: (date: string) => string;
  formatOrderId: (orderId: string, storeName?: string) => string;
}

export function OrdersTableRow({ 
  order, 
  showStoreName,
  showUsername,
  getStatusColor, 
  formatDate,
  formatOrderId,
}: OrdersTableRowProps) {
  const [showItems, setShowItems] = useState(false);
  const [status, setStatus] = useState(order.status);
  const { toast } = useToast();
  const { data: isAdmin } = useAdminCheck();

  const totalItems = React.useMemo(() => {
    if (!order.order_items || !Array.isArray(order.order_items)) {
      console.error(`Order ${order.id} has invalid order_items:`, order.order_items);
      return 0;
    }

    return order.order_items.reduce((sum, item) => {
      if (!item || typeof item.quantity !== 'number') {
        console.error(`Invalid item in order ${order.id}:`, item);
        return sum;
      }
      return sum + item.quantity;
    }, 0);
  }, [order.id, order.order_items]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      console.log("Updating status to:", newStatus);
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', order.id);

      if (error) throw error;

      setStatus(newStatus);
      toast({
        title: "Status Updated",
        description: `Order status has been updated to ${newStatus}`,
      });
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status",
      });
    }
  };

  const StatusComponent = () => {
    if (isAdmin) {
      return (
        <Select
          value={status}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className={`w-[130px] ${getStatusColor(status)}`}>
            <SelectValue>{status}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PAID">PAID</SelectItem>
            <SelectItem value="PROCESSING">PROCESSING</SelectItem>
            <SelectItem value="DELIVERED">DELIVERED</SelectItem>
            <SelectItem value="RETURNED">RETURNED</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    return (
      <Badge className={getStatusColor(status)}>
        {status}
      </Badge>
    );
  };

  return (
    <>
      <TableRow key={order.id} className="hover:bg-muted/50">
        {!showUsername && (
          <TableCell className="font-mono text-sm">
            {formatOrderId(order.id, order.store_name)}
          </TableCell>
        )}
        {showUsername && (
          <TableCell className="font-mono text-sm">
            {order.username || 'Unknown User'}
          </TableCell>
        )}
        {showStoreName && (
          <TableCell>{order.store_name}</TableCell>
        )}
        <TableCell className="text-muted-foreground">
          {formatDate(order.created_at)}
        </TableCell>
        <TableCell className="font-medium">
          ${order.total_amount.toFixed(2)}
        </TableCell>
        <TableCell>
          <StatusComponent />
        </TableCell>
        <TableCell className="text-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowItems(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            {totalItems} item(s)
          </Button>
        </TableCell>
      </TableRow>

      <OrderItemsDialog
        isOpen={showItems}
        onClose={() => setShowItems(false)}
        items={order.order_items || []}
        orderId={order.id}
        customerName={order.customer_name}
        customerAddress={order.customer_address}
        storeName={order.store_name}
      />
    </>
  );
}