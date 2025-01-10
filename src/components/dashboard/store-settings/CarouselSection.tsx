import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SectionTitle } from "./SectionTitle";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CarouselImage {
  url: string;
  buttonText?: string;
  buttonUrl?: string;
}

interface CarouselSectionProps {
  isEditing: boolean;
  carouselImages: CarouselImage[];
  show_carousel: boolean;
  onChange: (images: CarouselImage[]) => void;
  onVisibilityChange?: (value: boolean) => void;
}

export const CarouselSection = ({
  isEditing,
  carouselImages = [],
  show_carousel,
  onChange,
  onVisibilityChange,
}: CarouselSectionProps) => {
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('carousel-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('carousel-images')
        .getPublicUrl(filePath);

      const newImage: CarouselImage = { url: publicUrl };
      onChange([...carouselImages, newImage]);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload image: " + error.message,
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...carouselImages];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const handleUpdateImage = (index: number, field: keyof CarouselImage, value: string) => {
    const newImages = [...carouselImages];
    newImages[index] = { ...newImages[index], [field]: value };
    onChange(newImages);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex justify-between items-center">
        <SectionTitle
          title="Carousel Images"
          description="Add images to display in your store's carousel"
        />
        {isEditing && (
          <div className="flex items-center space-x-2">
            <Switch
              id="show-carousel"
              checked={show_carousel}
              onCheckedChange={onVisibilityChange}
            />
            <Label htmlFor="show-carousel">Show Carousel</Label>
          </div>
        )}
      </div>

      {show_carousel && (
        <>
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid gap-4">
                {carouselImages.map((image, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <img
                      src={image.url}
                      alt={`Carousel image ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Button Text (Optional)</Label>
                        <Input
                          value={image.buttonText || ""}
                          onChange={(e) =>
                            handleUpdateImage(index, "buttonText", e.target.value)
                          }
                          placeholder="Click here"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Button URL (Optional)</Label>
                        <Input
                          value={image.buttonUrl || ""}
                          onChange={(e) =>
                            handleUpdateImage(index, "buttonUrl", e.target.value)
                          }
                          placeholder="https://example.com"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => handleRemoveImage(index)}
                        className="w-full"
                      >
                        Remove Image
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {carouselImages.map((image, index) => (
                <div key={index} className="space-y-2">
                  <img
                    src={image.url}
                    alt={`Carousel image ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  {(image.buttonText || image.buttonUrl) && (
                    <div className="text-sm text-gray-500">
                      {image.buttonText && <p>Button Text: {image.buttonText}</p>}
                      {image.buttonUrl && <p>Button URL: {image.buttonUrl}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};