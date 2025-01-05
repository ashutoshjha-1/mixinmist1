import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if there's a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          await supabase.auth.signOut();
          navigate("/signin");
          return;
        }

        if (!session) {
          console.log("No session found, redirecting to signin");
          navigate("/signin");
          return;
        }

        // Verify the session is still valid by getting the user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("User verification error:", userError);
          await supabase.auth.signOut();
          toast({
            title: "Session Expired",
            description: "Please sign in again",
            variant: "destructive",
          });
          navigate("/signin");
          return;
        }

        if (!user) {
          console.error("No user found");
          await supabase.auth.signOut();
          navigate("/signin");
          return;
        }
      } catch (error) {
        console.error("Auth check error:", error);
        await supabase.auth.signOut();
        navigate("/signin");
      }
    };

    // Initial auth check
    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      if (!session) {
        navigate("/signin");
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return <>{children}</>;
};