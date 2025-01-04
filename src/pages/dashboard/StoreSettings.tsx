import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { HeroSection } from "@/components/dashboard/store-settings/HeroSection";
import { FooterSection } from "@/components/dashboard/store-settings/FooterSection";
import { HeaderSection } from "@/components/dashboard/store-settings/HeaderSection";
import { MenuItem } from "@/integrations/supabase/types/menu";

export default function StoreSettings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ["store-settings"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("Not authenticated");
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("store_name")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;
        if (!profile) throw new Error("Profile not found");

        const { data, error } = await supabase
          .from("store_settings")
          .select("*")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error("Store settings not found");

        return { ...data, store_name: profile.store_name };
      } catch (error: any) {
        console.error("Error fetching settings:", error);
        toast({
          variant: "destructive",
          title: "Error fetching settings",
          description: error.message,
        });
        throw error;
      }
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const menuItems = formData.get("menu_items");
      const newSettings = {
        hero_title: formData.get("hero_title") || "",
        hero_subtitle: formData.get("hero_subtitle") || "",
        hero_image_url: formData.get("hero_image_url") || "",
        footer_text: formData.get("footer_text") || "",
        theme_color: formData.get("theme_color") || "",
        custom_domain: formData.get("custom_domain") || "",
        icon_image_url: formData.get("icon_image_url") || "",
        menu_items: menuItems ? JSON.parse(menuItems as string) : [],
      };

      const { data, error } = await supabase
        .from("store_settings")
        .update(newSettings)
        .eq("user_id", session.user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating settings:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-settings"] });
      toast({
        title: "Settings updated",
        description: "Your store settings have been updated successfully.",
      });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings: " + error.message,
      });
    },
  });

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    updateSettings.mutate(formData);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="ml-64 p-8">
          <DashboardHeader onSignOut={handleSignOut} />
          <div className="max-w-4xl mx-auto">
            <div className="text-red-500">Error loading settings: {error.message}</div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !settings) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="ml-64 p-8">
          <DashboardHeader onSignOut={handleSignOut} />
          <div className="max-w-4xl mx-auto">
            <div>Loading settings...</div>
          </div>
        </div>
      </div>
    );
  }

  const parsedSettings = {
    ...settings,
    menu_items: settings.menu_items 
      ? (settings.menu_items as any[]).map((item: any) => ({
          label: String(item.label || ''),
          url: String(item.url || '')
        })) as MenuItem[]
      : [],
    footer_links: settings.footer_links ? (settings.footer_links as any[]) : [],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="ml-64 p-8">
        <DashboardHeader onSignOut={handleSignOut} />
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Store Settings</h1>
            <div className="space-x-4">
              <Button onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Edit Settings"}
              </Button>
              {settings.store_name && (
                <Button
                  onClick={() => navigate(`/${settings.store_name}`)}
                  variant="outline"
                >
                  Preview Store
                </Button>
              )}
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <HeaderSection isEditing={isEditing} settings={parsedSettings} />
              <HeroSection isEditing={isEditing} settings={parsedSettings} />
              <FooterSection isEditing={isEditing} settings={parsedSettings} />

              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          ) : (
            <div className="space-y-8">
              <HeaderSection isEditing={isEditing} settings={parsedSettings} />
              <HeroSection isEditing={isEditing} settings={parsedSettings} />
              <FooterSection isEditing={isEditing} settings={parsedSettings} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}