import { Store, ShoppingCart } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

interface MenuItem {
  label: string;
  url: string;
}

interface StoreHeaderProps {
  iconImageUrl: string | null;
  menuItems: MenuItem[] | null;
}

export function StoreHeader({ iconImageUrl, menuItems }: StoreHeaderProps) {
  const { username } = useParams();
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

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
            
            <Link to={`/store/${username}/cart`}>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}