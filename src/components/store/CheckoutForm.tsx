import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { DialogTitle } from "@/components/ui/dialog";
import { MinusIcon, PlusIcon } from "lucide-react";

interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
  customerAddress: string;
}

export function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const { username } = useParams<{ username: string }>();
  const { items, total, clearCart, updateQuantity } = useCart();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>();

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
      <DialogTitle className="text-xl font-semibold">Checkout</DialogTitle>
      
      {/* Cart Items Section */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Cart Items</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-12 w-12 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <span className="text-sm">Qty: {item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Information */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Customer Information</h3>
        <div className="space-y-3">
          <div>
            <Input
              {...register("customerName", { required: "Name is required" })}
              placeholder="Your Name"
              className="w-full"
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
              className="w-full"
            />
            {errors.customerEmail && (
              <p className="text-sm text-red-500 mt-1">{errors.customerEmail.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register("customerAddress", { required: "Address is required" })}
              placeholder="Delivery Address"
              className="w-full"
            />
            {errors.customerAddress && (
              <p className="text-sm text-red-500 mt-1">{errors.customerAddress.message}</p>
            )}
          </div>
        </div>
      </div>

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