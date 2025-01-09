import { HeroSection } from "./HeroSection";
import { FooterSection } from "./FooterSection";

interface ContentSettingsProps {
  isEditing: boolean;
  settings: any;
}

export const ContentSettings = ({ isEditing, settings }: ContentSettingsProps) => {
  return (
    <div className="space-y-6">
      <HeroSection isEditing={isEditing} settings={settings} />
      <FooterSection isEditing={isEditing} settings={settings} />
    </div>
  );
};