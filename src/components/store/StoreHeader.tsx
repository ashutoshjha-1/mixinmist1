import { Store } from "lucide-react";
import { MenuItem } from "@/integrations/supabase/types/menu";

interface StoreHeaderProps {
  iconImageUrl: string | null;
  menuItems: MenuItem[] | null;
}

export function StoreHeader({ iconImageUrl, menuItems }: StoreHeaderProps) {
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
        </div>
      </div>
    </header>
  );
}