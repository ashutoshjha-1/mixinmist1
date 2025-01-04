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
import { useToast } from "@/hooks/use-toast";

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (price: number, customName: string, customDescription: string) => void;
  product: {
    name: string;
    price: number;
    description?: string;
  };
}

export const AddProductDialog = ({
  isOpen,
  onClose,
  onConfirm,
  product,
}: AddProductDialogProps) => {
  const [customPrice, setCustomPrice] = React.useState<string>("");
  const [customName, setCustomName] = React.useState(product.name);
  const [customDescription, setCustomDescription] = React.useState(product.description || "");
  const { toast } = useToast();

  const handleConfirm = () => {
    const price = parseFloat(customPrice);
    if (isNaN(price)) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }
    if (price <= product.price) {
      toast({
        title: "Invalid Price",
        description: `Price must be higher than ${product.price.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }
    onConfirm(price, customName, customDescription);
    onClose();
  };

  const earning = React.useMemo(() => {
    const price = parseFloat(customPrice);
    if (isNaN(price) || price <= product.price) return 0;
    return price - product.price;
  }, [customPrice, product.price]);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Customize Product</AlertDialogTitle>
          <AlertDialogDescription>
            Customize the product details for your store. Default price is ${product.price.toFixed(2)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Product Name
              </label>
              <Input
                id="name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                id="description"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Enter product description"
                rows={3}
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                Your Price ($)
              </label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min={product.price}
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                placeholder="Enter your price"
              />
            </div>
            <div className="bg-green-50 p-3 rounded-md">
              <p className="text-sm text-green-700">
                Your Earning: ${earning.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <Button onClick={handleConfirm}>Add to Store</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};