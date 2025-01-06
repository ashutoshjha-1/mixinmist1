import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrdersTableRow } from "./OrdersTableRow";
import { Order } from "@/types/order";

interface OrdersTableProps {
  orders: Order[];
  showStoreName?: boolean;
  isAdmin?: boolean;
}

export function OrdersTable({ orders, showStoreName = false, isAdmin = false }: OrdersTableProps) {
  console.log("OrdersTable rendered with isAdmin:", isAdmin);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-primary-100 text-primary-800 hover:bg-primary-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
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

  const formatOrderId = (rawOrderId: string, storeName: string = "STORE") => {
    const numericPart = rawOrderId.slice(-6);
    const storePrefix = storeName.toUpperCase().replace(/\s+/g, '');
    return `${storePrefix}-${numericPart}`;
  };

  return (
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
            <OrdersTableRow
              key={order.id}
              order={order}
              showStoreName={showStoreName}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
              formatOrderId={formatOrderId}
              isAdmin={isAdmin}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}