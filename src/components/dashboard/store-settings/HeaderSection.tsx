import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

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
}

export function HeaderSection({ isEditing, settings }: HeaderSectionProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(
    settings.menu_items || []
  );

  const addMenuItem = () => {
    setMenuItems([...menuItems, { label: "", url: "" }]);
  };

  const removeMenuItem = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Store Icon URL</label>
          <Input
            name="icon_image_url"
            defaultValue={settings.icon_image_url || ""}
            placeholder="https://example.com/store-icon.png"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium">Menu Items</label>
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

          <input
            type="hidden"
            name="menu_items"
            value={JSON.stringify(menuItems)}
          />

          <div className="space-y-4">
            {menuItems.map((item, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <Input
                    placeholder="Menu Label"
                    value={item.label}
                    onChange={(e) => {
                      const newItems = [...menuItems];
                      newItems[index].label = e.target.value;
                      setMenuItems(newItems);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Menu URL"
                    value={item.url}
                    onChange={(e) => {
                      const newItems = [...menuItems];
                      newItems[index].url = e.target.value;
                      setMenuItems(newItems);
                    }}
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
    <div>
      <h3 className="text-lg font-medium mb-2">Header</h3>
      {settings.icon_image_url && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Store Icon</p>
          <img
            src={settings.icon_image_url}
            alt="Store Icon"
            className="w-16 h-16 rounded-lg object-cover"
          />
        </div>
      )}
      {settings.menu_items && settings.menu_items.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Menu Items</p>
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