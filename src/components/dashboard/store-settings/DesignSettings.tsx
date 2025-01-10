import React from "react";
import { StoreSettings } from "@/integrations/supabase/types/store-settings";
import { CarouselSection } from "./CarouselSection";
import { HeroSection } from "./HeroSection";
import { FooterSection } from "./FooterSection";
import { HeaderSection } from "./HeaderSection";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleCarouselImagesChange = (carouselImages: any[]) => {
    onSettingsChange({ carousel_images: carouselImages });
  };

  const handleHeroVisibilityChange = (show_hero: boolean) => {
    if (show_hero && settings.show_carousel) {
      toast({
        title: "Warning",
        description: "Carousel will be hidden when Hero section is shown",
      });
    }
    onSettingsChange({ 
      show_hero,
      show_carousel: show_hero ? false : settings.show_carousel 
    });
  };

  const handleCarouselVisibilityChange = (show_carousel: boolean) => {
    if (show_carousel && settings.show_hero) {
      toast({
        title: "Warning",
        description: "Hero section will be hidden when Carousel is shown",
      });
    }
    onSettingsChange({ 
      show_carousel,
      show_hero: show_carousel ? false : settings.show_hero 
    });
  };

  return (
    <div className="space-y-8">
      <HeaderSection isEditing={isEditing} settings={settings} />
      <HeroSection 
        isEditing={isEditing} 
        settings={settings}
        onVisibilityChange={handleHeroVisibilityChange}
      />
      <CarouselSection
        isEditing={isEditing}
        carouselImages={settings.carousel_images || []}
        show_carousel={settings.show_carousel}
        onChange={handleCarouselImagesChange}
        onVisibilityChange={handleCarouselVisibilityChange}
      />
      <FooterSection isEditing={isEditing} settings={settings} />
    </div>
  );
};