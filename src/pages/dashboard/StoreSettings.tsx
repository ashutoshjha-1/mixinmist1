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

  const { data: settings, isLoading } = useQuery({
    queryKey: ["store-settings"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("store_name")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error("Profile not found");

      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      return { ...data, store_name: profile.store_name };
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const menuItems = formData.get("menu_items");
      const newSettings = {
        hero_title: String(formData.get("hero_title") || ""),
        hero_subtitle: String(formData.get("hero_subtitle") || ""),
        hero_image_url: String(formData.get("hero_image_url") || ""),
        footer_text: String(formData.get("footer_text") || ""),
        theme_color: String(formData.get("theme_color") || ""),
        custom_domain: String(formData.get("custom_domain") || ""),
        icon_image_url: String(formData.get("icon_image_url") || ""),
        menu_items: menuItems ? JSON.parse(menuItems as string) : [],
      };

      const { data, error } = await supabase
        .from("store_settings")
        .update(newSettings)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
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
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings: " + error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    updateSettings.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="ml-64 p-8">
          <DashboardHeader onSignOut={() => {}} />
          <div className="max-w-4xl mx-auto">
            <div>Loading settings...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="ml-64 p-8">
          <DashboardHeader onSignOut={() => {}} />
          <div className="max-w-4xl mx-auto">
            <div>Error loading settings</div>
          </div>
        </div>
      </div>
    );
  }

  const parsedSettings = {
    ...settings,
    menu_items: settings.menu_items ? (settings.menu_items as MenuItem[]) : [],
    footer_links: settings.footer_links ? (settings.footer_links as any[]) : [],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="ml-64 p-8">
        <DashboardHeader onSignOut={() => {}} />
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Store Settings</h1>
            <div className="space-x-4">
              <Button onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Edit Settings"}
              </Button>
              <Button
                onClick={() => navigate(`/store/${settings.store_name}`)}
                variant="outline"
              >
                Preview Store
              </Button>
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