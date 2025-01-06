import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";
import { OrderItemsDialog } from "./OrderItemsDialog";

interface OrdersTableRowProps {
  order: Order;
  showStoreName?: boolean;
  getStatusColor: (status: string) => string;
  formatDate: (date: string) => string;
}

export function OrdersTableRow({ 
  order, 
  showStoreName, 
  getStatusColor, 
  formatDate 
}: OrdersTableRowProps) {
  const [showItems, setShowItems] = useState(false);

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

  // Debug logs
  console.log("Order items for order", order.id, ":", order.order_items);
  console.log("Total items calculated:", totalItems);

  return (
    <>
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
      />
    </>
  );
}