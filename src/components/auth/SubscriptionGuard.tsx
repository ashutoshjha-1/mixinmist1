import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminCheck } from "@/hooks/use-admin-check";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const { data: isAdmin } = useAdminCheck();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        // If user is admin, bypass subscription check
        if (isAdmin) {
          setLoading(false);
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Auth error:", userError);
          throw userError;
        }

        if (!user) {
          console.error("No authenticated user found");
          navigate("/signin");
          return;
        }

        console.log("Checking subscription for user:", user.email);
        
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          body: { email: user.email },
        });

        if (error) {
          console.error("Subscription check error:", error);
          throw error;
        }

        console.log("Subscription check response:", data);

        if (!data?.hasActiveSubscription) {
          navigate("/pricing");
          return;
        }

        setLoading(false);
      } catch (error: any) {
        console.error("Subscription guard error:", error);
        toast({
          variant: "destructive",
          title: "Error checking subscription",
          description: error.message || "Please try again later",
        });
        navigate("/pricing");
      }
    };

    checkSubscription();
  }, [navigate, toast, isAdmin]);

  if (loading && !isAdmin) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};