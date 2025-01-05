import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminCheck = () => {
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      try {
        // First check if we have a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error('No valid session found:', sessionError);
          return false;
        }

        const { data, error } = await supabase.rpc('is_admin', {
          user_id: session.user.id
        });

        if (error) {
          console.error('Error checking admin status:', error);
          return false;
        }

        console.log('Admin check result:', data);
        return !!data;
      } catch (error) {
        console.error('Error in admin check:', error);
        return false;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false, // Don't retry on failure
  });
};