import React from "react";
import { MinusIcon, PlusIcon } from "lucide-react";

interface CartItemRowProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
  };
  onQuantityChange: (itemId: string, newQuantity: number) => void;
}

export function CartItemRow({ item, onQuantityChange }: CartItemRowProps) {
  return (
    <div className="flex justify-between items-center py-3">
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
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="text-sm">Qty: {item.quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
    </div>
  );
}