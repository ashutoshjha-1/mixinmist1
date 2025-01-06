import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SampleCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
  prefillData: {
    customerName: string;
    customerEmail: string;
    storeName: string;
  };
}

interface CheckoutFormData {
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
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    defaultValues: prefillData,
  });

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          store_id: user.id,
          customer_name: data.customerName,
          customer_email: data.customerEmail,
          customer_address: data.customerAddress,
          total_amount: product.price,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert({
          order_id: order.id,
          product_id: product.id,
          quantity: 1,
          price: product.price,
        });

      if (itemsError) throw itemsError;

      toast({
        title: "Sample order placed successfully!",
        description: "Thank you for your order.",
      });

      onOpenChange(false);
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        variant: "destructive",
        title: "Error placing order",
        description: error.message,
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Sample Order Checkout</AlertDialogTitle>
          <AlertDialogDescription>
            Please confirm your details to place this sample order.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
            </div>
          </div>

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
                type="email"
                placeholder="Your Email"
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

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}