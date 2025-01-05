import { Store, ShoppingCart, X, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuItem } from "@/integrations/supabase/types/menu";
import { useCart } from "@/contexts/CartContext";
import { CheckoutForm } from "./CheckoutForm";

interface StoreHeaderProps {
  iconImageUrl: string | null;
  menuItems: MenuItem[] | null;
}

export function StoreHeader({ iconImageUrl, menuItems }: StoreHeaderProps) {
  const { items, total, removeItem, updateQuantity } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleQuantityChange = (id: string, change: number) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false); // Close the cart sheet
    setShowCheckout(true); // Show the checkout dialog
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {iconImageUrl ? (
              <img
                src={iconImageUrl}
                alt="Store Icon"
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <Store className="h-8 w-8 text-gray-400" />
            )}
          </div>
          
          <div className="flex items-center space-x-8">
            {menuItems && menuItems.length > 0 && (
              <nav className="hidden md:flex space-x-8">
                {menuItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            )}

            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {items.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Shopping Cart</SheetTitle>
                </SheetHeader>
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-auto">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-4 border-b"
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="h-16 w-16 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                ${item.price.toFixed(2)} x {item.quantity}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span>{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-4">
                        <span className="font-medium">Total</span>
                        <span className="font-medium">${total.toFixed(2)}</span>
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleCheckoutClick}
                      >
                        Checkout
                      </Button>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Checkout</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCheckout(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CheckoutForm onSuccess={() => setShowCheckout(false)} />
          </div>
        </div>
      )}
    </header>
  );
}