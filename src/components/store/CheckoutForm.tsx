
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { CartItemRow } from "./checkout/CartItemRow";
import { CustomerForm } from "./checkout/CustomerForm";

interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
  customerAddress: string;
}

interface CheckoutFormProps {
  onSuccess: () => void;
  prefillData?: {
    customerName?: string;
    customerEmail?: string;
    customerAddress?: string;
  };
}

export function CheckoutForm({ onSuccess, prefillData }: CheckoutFormProps) {
  const { username } = useParams<{ username: string }>();
  const { items, total, clearCart, updateQuantity } = useCart();
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
      console.log("Searching for profile with username:", username);
      
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", username || '')
        .single();

      if (profileError || !profile) {
        console.error("Profile error:", profileError);
        throw new Error("Store not found");
      }

      console.log("Found profile:", profile);

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

      if (orderError) {
        console.error("Order error:", orderError);
        throw orderError;
      }

      if (!order) {
        throw new Error("Failed to create order");
      }

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Order items error:", itemsError);
        throw itemsError;
      }

      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase.",
      });

      clearCart();
      onSuccess();
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        variant: "destructive",
        title: "Error placing order",
        description: error.message,
      });
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Cart Items Section */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Cart Items</h3>
        <div className="space-y-3 divide-y">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </div>
      </div>

      {/* Customer Information */}
      <CustomerForm register={register} errors={errors} />

      {/* Total and Submit */}
      <div className="pt-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-lg font-semibold">${total.toFixed(2)}</span>
        </div>
        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </form>
  );
}
