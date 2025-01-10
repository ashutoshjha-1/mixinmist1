import React from "react";
import { StoreSettings } from "@/integrations/supabase/types/store-settings";
import { CarouselSection } from "./CarouselSection";
import { HeroSection } from "./HeroSection";
import { FooterSection } from "./FooterSection";
import { HeaderSection } from "./HeaderSection";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
  const [isSaving, setIsSaving] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<StoreSettings>>(settings);

  const handleCarouselImagesChange = (carouselImages: any[]) => {
    setFormData(prev => ({
      ...prev,
      carousel_images: carouselImages
    }));
  };

  const handleHeroVisibilityChange = (show_hero: boolean) => {
    if (show_hero && formData.show_carousel) {
      toast({
        title: "Warning",
        description: "Carousel will be hidden when Hero section is shown",
      });
    }
    setFormData(prev => ({
      ...prev,
      show_hero,
      show_carousel: show_hero ? false : formData.show_carousel 
    }));
  };

  const handleCarouselVisibilityChange = (show_carousel: boolean) => {
    if (show_carousel && formData.show_hero) {
      toast({
        title: "Warning",
        description: "Hero section will be hidden when Carousel is shown",
      });
    }
    setFormData(prev => ({
      ...prev,
      show_carousel,
      show_hero: show_carousel ? false : formData.show_hero
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSettingsChange(formData);
      toast({
        title: "Success",
        description: "Store settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save store settings. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <HeaderSection 
        isEditing={isEditing} 
        settings={settings}
        onChange={(headerData) => setFormData(prev => ({ ...prev, ...headerData }))}
      />
      <HeroSection 
        isEditing={isEditing} 
        settings={settings}
        onVisibilityChange={handleHeroVisibilityChange}
        onChange={(heroData) => setFormData(prev => ({ ...prev, ...heroData }))}
      />
      <CarouselSection
        isEditing={isEditing}
        carouselImages={settings.carousel_images || []}
        show_carousel={settings.show_carousel}
        onChange={handleCarouselImagesChange}
        onVisibilityChange={handleCarouselVisibilityChange}
      />
      <FooterSection 
        isEditing={isEditing} 
        settings={settings}
        onChange={(footerData) => setFormData(prev => ({ ...prev, ...footerData }))}
      />
      
      {isEditing && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mt-8">
          <div className="max-w-4xl mx-auto">
            <Button
              className="w-full"
              size="lg"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};