import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FooterSectionProps {
  isEditing: boolean;
  settings: {
    footer_text: string | null;
    footer_links: any[] | null;
  };
}

export function FooterSection({ isEditing, settings }: FooterSectionProps) {
  if (isEditing) {
    return (
      <div>
        <label className="block text-sm font-medium mb-2">Footer Text</label>
        <Textarea
          name="footer_text"
          defaultValue={settings.footer_text || ""}
          placeholder="© 2024 All rights reserved"
        />
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Footer</h3>
      <p className="text-gray-600">{settings.footer_text}</p>
    </div>
  );
}