import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminCheck } from "@/hooks/use-admin-check";
import { Loader2 } from "lucide-react";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const { data: isAdmin, isLoading: isAdminLoading } = useAdminCheck();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        // If user is admin, bypass subscription check
        if (isAdmin) {
          console.log("Admin user detected, bypassing subscription check");
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
          toast({
            variant: "destructive",
            title: "Subscription Required",
            description: "Please subscribe to access the dashboard",
          });
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

    // Only check subscription when admin check is complete
    if (!isAdminLoading) {
      checkSubscription();
    }
  }, [navigate, toast, isAdmin, isAdminLoading]);

  if (loading && !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking subscription status...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};