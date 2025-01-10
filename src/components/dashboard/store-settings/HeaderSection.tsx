import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

interface MenuItem {
  label: string;
  url: string;
}

interface HeaderSectionProps {
  isEditing: boolean;
  settings: {
    icon_image_url: string | null;
    menu_items: MenuItem[] | null;
  };
  onChange?: (data: { icon_image_url?: string; menu_items?: MenuItem[] }) => void;
}

export function HeaderSection({ isEditing, settings, onChange }: HeaderSectionProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(
    settings.menu_items || []
  );

  const addMenuItem = () => {
    const newItems = [...menuItems, { label: "", url: "" }];
    setMenuItems(newItems);
    onChange?.({ menu_items: newItems });
  };

  const removeMenuItem = (index: number) => {
    const newItems = menuItems.filter((_, i) => i !== index);
    setMenuItems(newItems);
    onChange?.({ menu_items: newItems });
  };

  const handleIconUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({ icon_image_url: e.target.value });
  };

  const handleMenuItemChange = (index: number, field: keyof MenuItem, value: string) => {
    const newItems = [...menuItems];
    newItems[index][field] = value;
    setMenuItems(newItems);
    onChange?.({ menu_items: newItems });
  };

  if (isEditing) {
    return (
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <SectionTitle 
          title="Header Settings"
          description="Customize your store's header appearance and navigation"
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store Icon URL</label>
          <Input
            name="icon_image_url"
            defaultValue={settings.icon_image_url || ""}
            placeholder="https://example.com/store-icon.png"
            className="w-full"
            onChange={handleIconUrlChange}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">Menu Items</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addMenuItem}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </div>

          <div className="space-y-4">
            {menuItems.map((item, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <Input
                    placeholder="Menu Label"
                    value={item.label}
                    onChange={(e) => handleMenuItemChange(index, "label", e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Menu URL"
                    value={item.url}
                    onChange={(e) => handleMenuItemChange(index, "url", e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMenuItem(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <SectionTitle 
        title="Header"
        description="Current header configuration and menu items"
      />
      {settings.icon_image_url && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Store Icon</p>
          <img
            src={settings.icon_image_url}
            alt="Store Icon"
            className="w-16 h-16 rounded-lg object-cover"
          />
        </div>
      )}
      {settings.menu_items && settings.menu_items.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Menu Items</p>
          <ul className="space-y-2">
            {settings.menu_items.map((item, index) => (
              <li key={index} className="text-gray-600">
                {item.label} - <span className="text-blue-500">{item.url}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}