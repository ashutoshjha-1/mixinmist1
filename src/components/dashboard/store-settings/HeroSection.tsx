import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface HeroSectionProps {
  isEditing: boolean;
  settings: {
    hero_title: string | null;
    hero_subtitle: string | null;
    hero_image_url: string | null;
  };
}

export function HeroSection({ isEditing, settings }: HeroSectionProps) {
  if (isEditing) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Hero Title</label>
          <Input
            name="hero_title"
            defaultValue={settings.hero_title || ""}
            placeholder="Welcome to our store"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
          <Input
            name="hero_subtitle"
            defaultValue={settings.hero_subtitle || ""}
            placeholder="Discover our amazing products"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hero Image URL</label>
          <Input
            name="hero_image_url"
            defaultValue={settings.hero_image_url || ""}
            placeholder="https://example.com/hero-image.jpg"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Hero Section</h3>
      <p className="text-gray-600">Title: {settings.hero_title}</p>
      <p className="text-gray-600">Subtitle: {settings.hero_subtitle}</p>
      {settings.hero_image_url && (
        <img
          src={settings.hero_image_url}
          alt="Hero"
          className="mt-2 rounded-lg h-40 object-cover"
        />
      )}
    </div>
  );
}