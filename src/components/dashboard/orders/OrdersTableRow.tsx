import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";
import { OrderItemsDialog } from "./OrderItemsDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface OrdersTableRowProps {
  order: Order;
  showStoreName?: boolean;
  getStatusColor: (status: string) => string;
  formatDate: (date: string) => string;
  formatOrderId: (orderId: string, storeName?: string) => string;
  isAdmin?: boolean;
}

export function OrdersTableRow({ 
  order, 
  showStoreName, 
  getStatusColor, 
  formatDate,
  formatOrderId,
  isAdmin = false
}: OrdersTableRowProps) {
  const [showItems, setShowItems] = useState(false);
  const [status, setStatus] = useState(order.status);
  const { toast } = useToast();

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
      console.log("Updating order status:", { orderId: order.id, newStatus, isAdmin });
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

  return (
    <>
      <TableRow key={order.id} className="hover:bg-muted/50">
        <TableCell className="font-mono text-sm">
          {formatOrderId(order.id, order.store_name)}
        </TableCell>
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
          {isAdmin ? (
            <Select
              value={status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className={`w-[130px] ${getStatusColor(status)}`}>
                <SelectValue>{status.toUpperCase()}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">PENDING</SelectItem>
                <SelectItem value="processing">PROCESSING</SelectItem>
                <SelectItem value="completed">COMPLETED</SelectItem>
                <SelectItem value="cancelled">CANCELLED</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge
              variant="secondary"
              className={`${getStatusColor(status)}`}
            >
              {status.toUpperCase()}
            </Badge>
          )}
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