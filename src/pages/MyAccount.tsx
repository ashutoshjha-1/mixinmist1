import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function MyAccount() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (newProfile: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .update(newProfile)
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile: " + error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newProfile = {
      full_name: formData.get("full_name"),
      phone: formData.get("phone"),
      store_name: formData.get("store_name"),
      username: formData.get("username"),
    };
    updateProfile.mutate(newProfile);
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="ml-64 p-8">
        <DashboardHeader onSignOut={() => {}} />
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Account</h1>
            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <Input
                  name="full_name"
                  defaultValue={profile?.full_name}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  name="phone"
                  defaultValue={profile?.phone || ""}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Store Name</label>
                <Input
                  name="store_name"
                  defaultValue={profile?.store_name}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <Input
                  name="username"
                  defaultValue={profile?.username}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Full Name</h3>
                <p className="text-gray-600">{profile?.full_name}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Phone</h3>
                <p className="text-gray-600">{profile?.phone || "Not set"}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Store Name</h3>
                <p className="text-gray-600">{profile?.store_name}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Username</h3>
                <p className="text-gray-600">{profile?.username}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
