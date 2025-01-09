import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "./SectionTitle";
import { useState } from "react";

interface CarouselImage {
  url: string;
  buttonText?: string;
  buttonUrl?: string;
}

interface CarouselSectionProps {
  isEditing: boolean;
  settings: {
    carousel_images?: CarouselImage[];
  };
}

export function CarouselSection({ isEditing, settings }: CarouselSectionProps) {
  const [images, setImages] = useState<CarouselImage[]>(settings.carousel_images || []);

  const handleAddImage = () => {
    setImages([...images, { url: "" }]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImageChange = (index: number, field: keyof CarouselImage, value: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    setImages(newImages);
  };

  if (isEditing) {
    return (
      <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <SectionTitle>Carousel Settings</SectionTitle>
        
        <input
          type="hidden"
          name="carousel_images"
          value={JSON.stringify(images)}
        />

        {images.map((image, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL {index + 1}
              </label>
              <Input
                value={image.url}
                onChange={(e) => handleImageChange(index, "url", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Text (Optional)
              </label>
              <Input
                value={image.buttonText || ""}
                onChange={(e) => handleImageChange(index, "buttonText", e.target.value)}
                placeholder="Click here"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button URL (Optional)
              </label>
              <Input
                value={image.buttonUrl || ""}
                onChange={(e) => handleImageChange(index, "buttonUrl", e.target.value)}
                placeholder="https://example.com"
                className="w-full"
              />
            </div>

            <Button
              type="button"
              variant="destructive"
              onClick={() => handleRemoveImage(index)}
            >
              Remove Image
            </Button>
          </div>
        ))}

        <Button type="button" onClick={handleAddImage} className="mt-4">
          Add Image
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <SectionTitle>Carousel Images</SectionTitle>
      <div className="space-y-2">
        {images.map((image, index) => (
          <div key={index} className="flex items-center gap-4">
            <img
              src={image.url}
              alt={`Carousel ${index + 1}`}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <p className="text-sm text-gray-600">Button: {image.buttonText || "None"}</p>
              <p className="text-sm text-gray-600">URL: {image.buttonUrl || "None"}</p>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <p className="text-gray-500">No carousel images added yet.</p>
        )}
      </div>
    </div>
  );
}