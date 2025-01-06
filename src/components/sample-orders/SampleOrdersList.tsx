import React from 'react';
import { OrdersTable } from "@/components/dashboard/orders/OrdersTable";
import { useAdminCheck } from "@/hooks/use-admin-check";
import { useSampleOrders } from "@/hooks/use-sample-orders";
import { useAuth } from "@/hooks/use-auth";
import { Order } from "@/types/order";

interface SampleOrdersListProps {
  orders?: Order[];
  isLoading?: boolean;
}

export const SampleOrdersList: React.FC<SampleOrdersListProps> = ({ orders: externalOrders, isLoading }) => {
  const { data: isAdmin } = useAdminCheck();
  const { user } = useAuth();
  const { sampleOrders } = useSampleOrders(user?.id, isAdmin);

  const ordersToDisplay = externalOrders || sampleOrders;

  if (isLoading || !ordersToDisplay) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  if (ordersToDisplay.length === 0) {
    return (
      <div className="text-center py-12">
        No sample orders found.
      </div>
    );
  }

  return (
    <OrdersTable 
      orders={ordersToDisplay} 
      showStoreName={true}
      showUsername={false}
    />
  );
};