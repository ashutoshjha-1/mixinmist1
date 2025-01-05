import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const RoleBasedSettings = () => {
  const { toast } = useToast();
  
  const { data: userRole } = useQuery({
    queryKey: ["user-role"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Use the get_user_role function with correct parameter name
      const { data, error } = await supabase
        .rpc('get_user_role', {
          user_id: user.id
        });

      if (error) throw error;
      return data;
    },
  });

  const isAdmin = userRole === "admin";

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
      <h2 className="text-lg font-semibold mb-4">Admin Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Store Verification</h3>
            <p className="text-sm text-gray-500">Verify this store for enhanced features</p>
          </div>
          <Button variant="outline">Verify Store</Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Featured Status</h3>
            <p className="text-sm text-gray-500">Make this store featured on the platform</p>
          </div>
          <Button variant="outline">Set Featured</Button>
        </div>
      </div>
    </div>
  );
};