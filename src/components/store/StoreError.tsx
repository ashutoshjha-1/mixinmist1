import { Button } from "@/components/ui/button";

interface StoreErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const StoreError = ({ 
  message = "The store you're looking for doesn't exist or might have been removed.",
  onRetry 
}: StoreErrorProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Store not found</h1>
      <p className="text-gray-600">{message}</p>
      {onRetry && (
        <Button onClick={onRetry}>Try Again</Button>
      )}
    </div>
  );
};