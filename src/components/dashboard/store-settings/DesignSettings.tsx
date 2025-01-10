import React from "react";
import { StoreSettings } from "@/integrations/supabase/types/store-settings";
import { CarouselSection } from "./CarouselSection";
import { HeroSection } from "./HeroSection";
import { FooterSection } from "./FooterSection";
import { HeaderSection } from "./HeaderSection";

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
      <HeaderSection isEditing={isEditing} settings={settings} />
      <HeroSection isEditing={isEditing} settings={settings} />
      <CarouselSection
        isEditing={isEditing}
        carouselImages={settings.carousel_images || []}
        onChange={handleCarouselImagesChange}
      />
      <FooterSection isEditing={isEditing} settings={settings} />
    </div>
  );
};