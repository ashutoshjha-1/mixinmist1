import { useQuery, useMutation } from "@tanstack/react-query";
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

      const { data, error } = await supabase
        .rpc('get_user_role', {
          user_id: user.id
        });

      if (error) throw error;
      return data;
    },
  });

  const promoteToAdmin = useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase
        .rpc('promote_to_admin', {
          email_to_promote: email
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User has been promoted to admin",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const isAdmin = userRole === "admin";

  const handlePromoteUser = async () => {
    await promoteToAdmin.mutate("ashujha529@gmail.com");
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Promote User</h3>
            <p className="text-sm text-gray-500">Promote ashujha529@gmail.com to admin</p>
          </div>
          <Button 
            variant="outline"
            onClick={handlePromoteUser}
            disabled={promoteToAdmin.isPending}
          >
            {promoteToAdmin.isPending ? "Promoting..." : "Promote to Admin"}
          </Button>
        </div>
      </div>
    </div>
  );
};