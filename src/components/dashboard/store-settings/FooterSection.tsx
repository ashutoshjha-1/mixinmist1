import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

interface MenuItem {
  label: string;
  url: string;
}

interface FooterSectionProps {
  isEditing: boolean;
  settings: {
    footer_text: string | null;
    footer_links: any[] | null;
    bottom_menu_items: MenuItem[] | null;
  };
}

export function FooterSection({ isEditing, settings }: FooterSectionProps) {
  const [bottomMenuItems, setBottomMenuItems] = useState<MenuItem[]>(
    settings.bottom_menu_items || []
  );

  const addBottomMenuItem = () => {
    setBottomMenuItems([...bottomMenuItems, { label: "", url: "" }]);
  };

  const removeBottomMenuItem = (index: number) => {
    setBottomMenuItems(bottomMenuItems.filter((_, i) => i !== index));
  };

  if (isEditing) {
    return (
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <SectionTitle 
          title="Footer Settings"
          description="Customize your store's footer content and navigation"
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Footer Text</label>
          <Textarea
            name="footer_text"
            defaultValue={settings.footer_text || ""}
            placeholder="© 2024 All rights reserved"
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">Bottom Menu Items</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addBottomMenuItem}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </div>

          <input
            type="hidden"
            name="bottom_menu_items"
            value={JSON.stringify(bottomMenuItems)}
          />

          <div className="space-y-4">
            {bottomMenuItems.map((item, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <Input
                    placeholder="Menu Label"
                    value={item.label}
                    onChange={(e) => {
                      const newItems = [...bottomMenuItems];
                      newItems[index].label = e.target.value;
                      setBottomMenuItems(newItems);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Menu URL"
                    value={item.url}
                    onChange={(e) => {
                      const newItems = [...bottomMenuItems];
                      newItems[index].url = e.target.value;
                      setBottomMenuItems(newItems);
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBottomMenuItem(index)}
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
        title="Footer"
        description="Current footer configuration and menu items"
      />
      <div className="space-y-4">
        <p className="text-gray-700">
          <span className="font-medium">Footer Text:</span> {settings.footer_text || "© 2024 All rights reserved"}
        </p>
        
        {settings.bottom_menu_items && settings.bottom_menu_items.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Bottom Menu Items</p>
            <ul className="space-y-2">
              {settings.bottom_menu_items.map((item, index) => (
                <li key={index} className="text-gray-600">
                  {item.label} - <span className="text-blue-500">{item.url}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}