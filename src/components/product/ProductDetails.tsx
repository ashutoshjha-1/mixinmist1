import { Star } from "lucide-react";

interface ProductDetailsProps {
  name: string;
  price: number;
  description?: string;
  productId: string;
}

export const ProductDetails = ({ name, price, description, productId }: ProductDetailsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
        <div className="flex items-center gap-2 text-yellow-400">
          <Star className="fill-current" />
          <Star className="fill-current" />
          <Star className="fill-current" />
          <Star className="fill-current" />
          <Star className="fill-current" />
        </div>
      </div>

      <div className="text-3xl font-bold text-primary">
        ${price.toFixed(2)}
      </div>

      {description && (
        <div className="prose prose-sm">
          <h2 className="text-lg font-semibold text-gray-900">Description</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      )}

      <div className="border-t pt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-900">Availability:</span>
            <span className="text-green-600 ml-2">In Stock</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">SKU:</span>
            <span className="text-gray-600 ml-2">{productId.slice(0, 8)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};