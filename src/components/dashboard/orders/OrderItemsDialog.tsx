import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderItem } from "@/types/order";

interface OrderItemsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  orderId: string;
}

export function OrderItemsDialog({
  isOpen,
  onClose,
  items,
  orderId,
}: OrderItemsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Order Items - {orderId}</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item ID</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono">{item.id}</TableCell>
                <TableCell className="font-mono">{item.product_id}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}