import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/order";

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

  // Debug logging
  console.log(`Order ${order.id} details:`, {
    orderItems: order.order_items,
    totalItems: totalItems,
    isArray: Array.isArray(order.order_items),
    itemsLength: order.order_items?.length
  });

  return (
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
        {totalItems} item(s)
      </TableCell>
    </TableRow>
  );
}