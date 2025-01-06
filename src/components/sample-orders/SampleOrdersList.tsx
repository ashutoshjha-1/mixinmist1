import React from 'react';
import { OrdersTable } from "@/components/dashboard/orders/OrdersTable";
import { Order } from "@/types/order";
import { useAdminCheck } from "@/hooks/use-admin-check";

interface SampleOrdersListProps {
  orders: Order[];
  isLoading: boolean;
}

export const SampleOrdersList = ({ orders, isLoading }: SampleOrdersListProps) => {
  const { data: isAdmin } = useAdminCheck();

  if (isLoading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  // Filter orders that contain sample products
  const sampleOrders = orders.filter(order => 
    order.order_items?.some(item => item.products?.is_sample)
  );

  // Only show orders to admin users
  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        Only administrators can view sample orders.
      </div>
    );
  }

  return (
    <OrdersTable 
      orders={sampleOrders} 
      showStoreName={true}
      showUsername={false}
    />
  );
};