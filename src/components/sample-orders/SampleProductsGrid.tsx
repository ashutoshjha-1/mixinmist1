import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string;
}

interface SampleProductsGridProps {
  products: Product[];
}

export const SampleProductsGrid = ({ products }: SampleProductsGridProps) => {
  const navigate = useNavigate();

  const handleBuyNow = (product: Product) => {
    navigate(`/store/sample/product/${product.id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products?.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="aspect-square relative">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
            {product.description && (
              <p className="text-sm text-gray-500 mb-4">{product.description}</p>
            )}
            <Button 
              className="w-full"
              onClick={() => handleBuyNow(product)}
            >
              Buy Now
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};