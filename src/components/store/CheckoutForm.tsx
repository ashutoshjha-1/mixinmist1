import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";

interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
  customerAddress: string;
}

export function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const { username } = useParams<{ username: string }>();
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>();

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      // Get store owner's ID from their username
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .single();

      if (!profile) {
        throw new Error("Store not found");
      }

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          store_id: profile.id,
          customer_name: data.customerName,
          customer_email: data.customerEmail,
          customer_address: data.customerAddress,
          total_amount: total,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase.",
      });

      clearCart();
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error placing order",
        description: error.message,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          {...register("customerName", { required: "Name is required" })}
          placeholder="Your Name"
        />
        {errors.customerName && (
          <p className="text-sm text-red-500">{errors.customerName.message}</p>
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
          <p className="text-sm text-red-500">{errors.customerEmail.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register("customerAddress", { required: "Address is required" })}
          placeholder="Delivery Address"
        />
        {errors.customerAddress && (
          <p className="text-sm text-red-500">{errors.customerAddress.message}</p>
        )}
      </div>

      <div className="pt-4">
        <p className="text-lg font-semibold mb-4">
          Total: ${total.toFixed(2)}
        </p>
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </form>
  );
}