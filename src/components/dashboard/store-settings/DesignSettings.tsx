import { WaveSection } from "./WaveSection";
import { CarouselSection } from "./CarouselSection";
import { StoreSettings } from "@/integrations/supabase/types/store-settings";

interface DesignSettingsProps {
  isEditing: boolean;
  settings: StoreSettings;
}

export const DesignSettings = ({ isEditing, settings }: DesignSettingsProps) => {
  return (
    <div className="space-y-6">
      <WaveSection isEditing={isEditing} settings={settings} />
      <CarouselSection isEditing={isEditing} settings={settings} />
    </div>
  );
};