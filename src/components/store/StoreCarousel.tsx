import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

interface CarouselImage {
  url: string;
  buttonText?: string;
  buttonUrl?: string;
}

interface StoreCarouselProps {
  images: CarouselImage[];
}

export const StoreCarousel = ({ images }: StoreCarouselProps) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="relative">
              <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
                <img
                  src={image.url}
                  alt={`Carousel image ${index + 1}`}
                  className="object-cover w-full h-full"
                />
                {image.buttonText && image.buttonUrl && (
                  <div className="absolute bottom-4 left-4">
                    <Button
                      asChild
                      className="bg-white text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <a href={image.buttonUrl} target="_blank" rel="noopener noreferrer">
                        {image.buttonText}
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};