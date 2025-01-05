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
        // Clear any existing session first to ensure clean state
        const currentSession = await supabase.auth.getSession();
        if (currentSession.error) {
          console.error("Session retrieval error:", currentSession.error);
          await supabase.auth.signOut();
          localStorage.clear(); // Clear all local storage
          navigate("/signin");
          return;
        }

        if (!currentSession.data.session) {
          console.log("No valid session found, redirecting to signin");
          localStorage.clear(); // Clear all local storage
          navigate("/signin");
          return;
        }

        // Verify the session is still valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("User verification error:", userError);
          await supabase.auth.signOut();
          localStorage.clear(); // Clear all local storage
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
          localStorage.clear(); // Clear all local storage
          navigate("/signin");
          return;
        }

        console.log("Auth check successful, user:", user.id);
      } catch (error) {
        console.error("Auth check error:", error);
        await supabase.auth.signOut();
        localStorage.clear(); // Clear all local storage
        navigate("/signin");
      }
    };

    // Initial auth check
    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT' || !session) {
        console.log("No session in auth state change, redirecting to signin");
        localStorage.clear(); // Clear all local storage
        navigate("/signin");
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed successfully");
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return <>{children}</>;
};