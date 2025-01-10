import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        
        // First try to get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          // If session not found, clear it and redirect
          if (sessionError.message.includes('session_not_found')) {
            console.log("Invalid session detected, clearing...");
            await supabase.auth.signOut();
            navigate("/signin", { replace: true });
            return;
          }
          throw sessionError;
        }

        if (!session) {
          console.log("No session found, redirecting to signin");
          navigate("/signin", { replace: true });
          return;
        }

        // Verify the session is valid by getting user data
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("User verification error:", userError);
          if (userError.message.includes('session_not_found') || userError.status === 403) {
            console.log("Session validation failed, signing out...");
            await supabase.auth.signOut();
            navigate("/signin", { replace: true });
            return;
          }
          throw userError;
        }

        if (!user) {
          console.log("No user found, redirecting to signin");
          await supabase.auth.signOut();
          navigate("/signin", { replace: true });
          return;
        }

        console.log("Auth check successful, user:", user.id);
        setIsLoading(false);
      } catch (error: any) {
        console.error("Auth check error:", error);
        
        // Show error toast for unexpected errors
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please sign in again",
        });
        
        await supabase.auth.signOut();
        navigate("/signin", { replace: true });
      }
    };

    // Initial auth check
    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT' || !session) {
        console.log("No session in auth state change, redirecting to signin");
        setIsLoading(true);
        navigate("/signin", { replace: true });
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};