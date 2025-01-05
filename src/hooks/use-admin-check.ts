import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminCheck = () => {
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;
        
        const { data, error } = await supabase.rpc('is_admin', {
          user_id: user.id
        });

        if (error) {
          console.error('Error checking admin status:', error);
          return false;
        }

        console.log('Admin check result:', data); // Add this line for debugging
        return !!data;
      } catch (error) {
        console.error('Error in admin check:', error);
        return false;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};