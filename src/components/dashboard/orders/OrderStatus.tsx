import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface OrderStatusProps {
  orderId: string;
  initialStatus: string;
  isAdmin: boolean;
  getStatusColor: (status: string) => string;
}

export function OrderStatus({ orderId, initialStatus, isAdmin, getStatusColor }: OrderStatusProps) {
  const [status, setStatus] = React.useState(initialStatus);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    try {
      console.log("Updating order status:", { orderId, newStatus, isAdmin });
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setStatus(newStatus);
      toast({
        title: "Status Updated",
        description: `Order status has been updated to ${newStatus}`,
      });
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status",
      });
    }
  };

  if (isAdmin) {
    return (
      <Select
        value={status}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className={`w-[130px] ${getStatusColor(status)}`}>
          <SelectValue>{status.toUpperCase()}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">PENDING</SelectItem>
          <SelectItem value="processing">PROCESSING</SelectItem>
          <SelectItem value="completed">COMPLETED</SelectItem>
          <SelectItem value="cancelled">CANCELLED</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Badge
      variant="secondary"
      className={`${getStatusColor(status)}`}
    >
      {status.toUpperCase()}
    </Badge>
  );
}