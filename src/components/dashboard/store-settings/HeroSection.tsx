import { Input } from "@/components/ui/input";
import { SectionTitle } from "./SectionTitle";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface HeroSectionProps {
  isEditing: boolean;
  settings: {
    hero_title: string | null;
    hero_subtitle: string | null;
    hero_image_url: string | null;
    show_hero: boolean;
  };
  onVisibilityChange?: (value: boolean) => void;
}

export function HeroSection({ isEditing, settings, onVisibilityChange }: HeroSectionProps) {
  if (isEditing) {
    return (
      <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center">
          <SectionTitle 
            title="Hero Section Settings"
            description="Configure your store's hero section content and appearance"
          />
          <div className="flex items-center space-x-2">
            <Switch
              id="show-hero"
              name="show_hero"
              checked={settings.show_hero}
              onCheckedChange={onVisibilityChange}
            />
            <Label htmlFor="show-hero">Show Hero Section</Label>
          </div>
        </div>
        
        {settings.show_hero && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
              <Input
                name="hero_title"
                defaultValue={settings.hero_title || ""}
                placeholder="Welcome to our store"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
              <Input
                name="hero_subtitle"
                defaultValue={settings.hero_subtitle || ""}
                placeholder="Discover our amazing products"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image URL</label>
              <Input
                name="hero_image_url"
                defaultValue={settings.hero_image_url || ""}
                placeholder="https://example.com/hero-image.jpg"
                className="w-full"
              />
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <SectionTitle 
        title="Hero Section"
        description="Current hero section configuration"
      />
      <div className="space-y-2">
        <p className="text-gray-700">
          <span className="font-medium">Visibility:</span> {settings.show_hero ? 'Visible' : 'Hidden'}
        </p>
        {settings.show_hero && (
          <>
            <p className="text-gray-700">
              <span className="font-medium">Title:</span> {settings.hero_title}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Subtitle:</span> {settings.hero_subtitle}
            </p>
            {settings.hero_image_url && (
              <img
                src={settings.hero_image_url}
                alt="Hero"
                className="mt-2 rounded-lg h-40 w-full object-cover"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}