import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminCheck = () => {
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('No valid user found:', userError);
          return false;
        }

        console.log('Checking role for user:', user.id);

        // First check if user has a role
        const { data: hasRole, error: roleCheckError } = await supabase
          .rpc('user_has_role', {
            input_user_id: user.id
          });

        if (roleCheckError) {
          console.error('Error checking if user has role:', roleCheckError);
          return false;
        }

        console.log('Has role check result:', hasRole);

        if (!hasRole) {
          console.log('User has no role assigned');
          return false;
        }

        // Then check if user is admin
        const { data: isAdmin, error: adminCheckError } = await supabase
          .rpc('is_admin', {
            user_id: user.id
          });

        if (adminCheckError) {
          console.error('Error checking admin status:', adminCheckError);
          return false;
        }

        console.log('Admin check result:', isAdmin);
        return !!isAdmin;
      } catch (error) {
        console.error('Error in admin check:', error);
        return false;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1, // Only retry once
  });
};