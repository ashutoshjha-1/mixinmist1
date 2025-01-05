import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminCheck = () => {
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data, error } = await supabase.rpc('is_admin', {
        user_id: user.id
      });

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return !!data;
    }
  });
};