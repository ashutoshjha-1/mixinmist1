import { WaveSection } from "./WaveSection";
import { CarouselSection } from "./CarouselSection";

interface DesignSettingsProps {
  isEditing: boolean;
  settings: any;
}

export const DesignSettings = ({ isEditing, settings }: DesignSettingsProps) => {
  return (
    <div className="space-y-6">
      <WaveSection isEditing={isEditing} settings={settings} />
      <CarouselSection isEditing={isEditing} settings={settings} />
    </div>
  );
};