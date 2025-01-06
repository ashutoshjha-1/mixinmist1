import React from 'react';
import { OrdersTable } from "@/components/dashboard/orders/OrdersTable";
import { useAdminCheck } from "@/hooks/use-admin-check";
import { useSampleOrders } from "@/hooks/use-sample-orders";
import { useAuth } from "@/hooks/use-auth";

export const SampleOrdersList = () => {
  const { data: isAdmin } = useAdminCheck();
  const { user } = useAuth();
  const { sampleOrders } = useSampleOrders(user?.id, isAdmin);

  if (!sampleOrders) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  if (sampleOrders.length === 0) {
    return (
      <div className="text-center py-12">
        No sample orders found.
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