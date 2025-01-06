import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { supabase } from "@/integrations/supabase/client";

interface OrderItemsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  orderId: string;
  customerName: string;
  customerAddress: string;
}

interface ProductInfo {
  id: string;
  name: string;
}

export function OrderItemsDialog({
  isOpen,
  onClose,
  items,
  orderId,
  customerName,
  customerAddress,
}: OrderItemsDialogProps) {
  const [products, setProducts] = useState<Record<string, ProductInfo>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      if (!Array.isArray(items) || items.length === 0) return;

      const productIds = items.map(item => item.product_id);
      
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .in('id', productIds);

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      const productsMap = (data || []).reduce((acc, product) => ({
        ...acc,
        [product.id]: product
      }), {});

      setProducts(productsMap);
    };

    fetchProducts();
  }, [items]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Order Items - {orderId}</DialogTitle>
          <DialogDescription>
            <div className="mt-2 space-y-1">
              <p><span className="font-medium">Customer:</span> {customerName}</p>
              <p><span className="font-medium">Shipping Address:</span> {customerAddress}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(items) && items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{products[item.product_id]?.name || 'Loading...'}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}