import React from 'react';
import { OrdersTable } from "@/components/dashboard/orders/OrdersTable";
import { Order } from "@/types/order";

interface SampleOrdersListProps {
  orders: Order[];
  isLoading: boolean;
}

export const SampleOrdersList = ({ orders, isLoading }: SampleOrdersListProps) => {
  if (isLoading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  return (
    <OrdersTable 
      orders={orders} 
      showStoreName={false}
      showUsername={true}
    />
  );
};