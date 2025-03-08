import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: {
    name: string;
    price: number;
    description: string;
    image_url: string;
    is_sample?: boolean;
  }) => void;
  product?: {
    id: string;
    name: string;
    price: number;
    description?: string;
    image_url: string;
    is_sample?: boolean;
  } | null;
}

export const AdminProductDialog = ({
  isOpen,
  onClose,
  onSave,
  product,
}: AdminProductDialogProps) => {
  const [name, setName] = React.useState(product?.name || "");
  const [price, setPrice] = React.useState(product?.price?.toString() || "");
  const [description, setDescription] = React.useState(product?.description || "");
  const [imageUrl, setImageUrl] = React.useState(product?.image_url || "");
  const [isSample, setIsSample] = React.useState(product?.is_sample || false);
  const [isUploading, setIsUploading] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price.toString());
      setDescription(product.description || "");
      setImageUrl(product.image_url);
      setIsSample(product.is_sample || false);
    } else {
      setName("");
      setPrice("");
      setDescription("");
      setImageUrl("");
      setIsSample(false);
    }
  }, [product]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `lovable-uploads/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('carousel-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('carousel-images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    if (!name || !imageUrl) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onSave({
      name,
      price: parsedPrice,
      description,
      image_url: imageUrl,
      is_sample: isSample,
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to your product here. Click save when you're done.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Product Name*
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                Price* ($)
              </label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                rows={3}
              />
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                Image*
              </label>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="mb-2"
                />
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or enter image URL directly"
                />
                {imageUrl && (
                  <img 
                    src={imageUrl} 
                    alt="Product preview" 
                    className="mt-2 max-w-full h-auto max-h-40 object-contain rounded-md"
                  />
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isSample"
                checked={isSample}
                onCheckedChange={(checked) => setIsSample(checked as boolean)}
              />
              <label
                htmlFor="isSample"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Add as a Sample Product
              </label>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <Button onClick={handleSave} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Save"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};