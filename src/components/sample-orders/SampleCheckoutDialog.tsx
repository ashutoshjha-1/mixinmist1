
import React from 'react';
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SampleCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string;
    name: string;
    price: number;
  };
  prefillData: {
    customerName: string;
    customerEmail: string;
    storeName: string;
  };
}

interface FormData {
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  storeName: string;
}

export function SampleCheckoutDialog({
  open,
  onOpenChange,
  product,
  prefillData,
}: SampleCheckoutDialogProps) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      customerName: prefillData.customerName,
      customerEmail: prefillData.customerEmail,
      storeName: prefillData.storeName,
      customerAddress: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User not authenticated");

      // Create the sample order
      const { data: orderData, error: orderError } = await supabase
        .from("sample_orders")
        .insert([
          {
            store_id: user.id,
            customer_name: data.customerName,
            customer_email: data.customerEmail,
            customer_address: data.customerAddress,
            total_amount: product.price,
            status: "PAID",
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;
      
      // Add a check to ensure orderData is not null
      if (!orderData) throw new Error("Failed to create order");

      // Create the sample order item
      const { error: orderItemError } = await supabase
        .from("sample_order_items")
        .insert([
          {
            order_id: orderData.id,
            product_id: product.id,
            quantity: 1,
            price: product.price,
          },
        ]);

      if (orderItemError) throw orderItemError;

      toast({
        title: "Sample order placed successfully!",
        description: "Your sample order has been placed.",
      });

      onOpenChange(false);
      reset();
    } catch (error: any) {
      console.error("Error placing sample order:", error);
      toast({
        variant: "destructive",
        title: "Error placing sample order",
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sample Order Checkout</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                {...register("storeName", { required: "Store name is required" })}
                placeholder="Store Name"
                readOnly
              />
              {errors.storeName && (
                <p className="text-sm text-red-500 mt-1">{errors.storeName.message}</p>
              )}
            </div>

            <div>
              <Input
                {...register("customerName", { required: "Name is required" })}
                placeholder="Your Name"
                readOnly
              />
              {errors.customerName && (
                <p className="text-sm text-red-500 mt-1">{errors.customerName.message}</p>
              )}
            </div>

            <div>
              <Input
                {...register("customerEmail", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Email Address"
                type="email"
                readOnly
              />
              {errors.customerEmail && (
                <p className="text-sm text-red-500 mt-1">{errors.customerEmail.message}</p>
              )}
            </div>

            <div>
              <Input
                {...register("customerAddress", { required: "Address is required" })}
                placeholder="Delivery Address"
              />
              {errors.customerAddress && (
                <p className="text-sm text-red-500 mt-1">{errors.customerAddress.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Product:</span>
              <span>{product.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Price:</span>
              <span>${product.price}</span>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Place Order
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
