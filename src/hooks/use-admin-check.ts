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
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (roleCheckError) {
          console.error('Error checking if user has role:', roleCheckError);
          return false;
        }

        console.log('User role check result:', hasRole);

        if (!hasRole) {
          console.log('User has no role assigned');
          return false;
        }

        return hasRole.role === 'admin';
      } catch (error) {
        console.error('Error in admin check:', error);
        return false;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1, // Only retry once
  });
};