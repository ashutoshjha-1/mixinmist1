import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  onChange: (images: CarouselImage[]) => void;
}

export const CarouselSection = ({
  isEditing,
  carouselImages = [],
  onChange,
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
    <div className="space-y-6">
      <SectionTitle
        title="Carousel Images"
        description="Add images to display in your store's carousel"
      />

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid gap-4">
            {carouselImages.map((image, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <img
                  src={image.url}
                  alt={`Carousel image ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="space-y-2">
                  <Label>Button Text (Optional)</Label>
                  <Input
                    value={image.buttonText || ""}
                    onChange={(e) =>
                      handleUpdateImage(index, "buttonText", e.target.value)
                    }
                    placeholder="Click here"
                  />
                  <Label>Button URL (Optional)</Label>
                  <Input
                    value={image.buttonUrl || ""}
                    onChange={(e) =>
                      handleUpdateImage(index, "buttonUrl", e.target.value)
                    }
                    placeholder="https://example.com"
                  />
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Remove Image
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div>
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
    </div>
  );
};