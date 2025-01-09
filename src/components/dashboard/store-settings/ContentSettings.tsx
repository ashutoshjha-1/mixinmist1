import { HeroSection } from "./HeroSection";
import { FooterSection } from "./FooterSection";
import { StoreSettings } from "@/integrations/supabase/types/store-settings";

interface ContentSettingsProps {
  isEditing: boolean;
  settings: StoreSettings;
}

export const ContentSettings = ({ isEditing, settings }: ContentSettingsProps) => {
  return (
    <div className="space-y-6">
      <HeroSection isEditing={isEditing} settings={settings} />
      <FooterSection isEditing={isEditing} settings={settings} />
    </div>
  );
};