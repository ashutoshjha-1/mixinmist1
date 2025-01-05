import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
  store_name?: string;
}

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
  const totalItems = Array.isArray(order.order_items) 
    ? order.order_items.reduce((sum, item) => {
        if (item && typeof item.quantity === 'number') {
          return sum + item.quantity;
        }
        return sum;
      }, 0)
    : 0;

  console.log("Order items for order", order.id, ":", order.order_items);
  console.log("Calculated total items:", totalItems);

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