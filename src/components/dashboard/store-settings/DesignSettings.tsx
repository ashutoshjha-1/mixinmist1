import React from "react";
import { StoreSettings } from "@/integrations/supabase/types/store-settings";
import { CarouselSection } from "./CarouselSection";

interface DesignSettingsProps {
  isEditing: boolean;
  settings: StoreSettings;
  onSettingsChange: (settings: Partial<StoreSettings>) => void;
}

export const DesignSettings = ({
  isEditing,
  settings,
  onSettingsChange,
}: DesignSettingsProps) => {
  const handleCarouselImagesChange = (carouselImages: any[]) => {
    onSettingsChange({ carousel_images: carouselImages });
  };

  return (
    <div className="space-y-8">
      <CarouselSection
        isEditing={isEditing}
        carouselImages={settings.carousel_images || []}
        onChange={handleCarouselImagesChange}
      />
    </div>
  );
};