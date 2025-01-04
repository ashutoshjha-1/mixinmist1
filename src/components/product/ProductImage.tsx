interface ProductImageProps {
  imageUrl: string;
  productName: string;
}

export const ProductImage = ({ imageUrl, productName }: ProductImageProps) => {
  return (
    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
      <img
        src={imageUrl}
        alt={productName}
        className="w-full h-full object-cover"
      />
    </div>
  );
};