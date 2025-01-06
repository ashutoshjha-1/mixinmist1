import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const SubscriptionGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/signin");
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;

      setIsSubscribed(data.subscribed);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Subscription check error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify subscription status",
      });
    }
  };

  const handleSubscribe = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to start subscription process",
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isSubscribed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="p-6 max-w-md w-full space-y-4">
          <h2 className="text-2xl font-bold text-center">Subscription Required</h2>
          <p className="text-gray-600 text-center">
            You need an active subscription to access this feature.
          </p>
          <div className="flex justify-center">
            <Button onClick={handleSubscribe} className="w-full">
              Subscribe Now
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};