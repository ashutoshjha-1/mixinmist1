import React from "react";
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface CustomerFormData {
  customerName: string;
  customerEmail: string;
  customerAddress: string;
}

interface CustomerFormProps {
  register: UseFormRegister<CustomerFormData>;
  errors: FieldErrors<CustomerFormData>;
}

export function CustomerForm({ register, errors }: CustomerFormProps) {
  return (
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
  );
}