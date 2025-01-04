import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

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

      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

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
    const newSettings = {
      hero_title: formData.get("hero_title"),
      hero_subtitle: formData.get("hero_subtitle"),
      hero_image_url: formData.get("hero_image_url"),
      footer_text: formData.get("footer_text"),
      theme_color: formData.get("theme_color"),
      custom_domain: formData.get("custom_domain"),
    };
    updateSettings.mutate(newSettings);
  };

  const handlePreviewStore = () => {
    navigate(`/store/${settings?.store_name}`);
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  if (!settings) {
    return <div>No settings found</div>;
  }

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
              <Button onClick={handlePreviewStore} variant="outline">
                Preview Store
              </Button>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Hero Title</label>
                <Input
                  name="hero_title"
                  defaultValue={settings.hero_title}
                  placeholder="Welcome to our store"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
                <Input
                  name="hero_subtitle"
                  defaultValue={settings.hero_subtitle}
                  placeholder="Discover our amazing products"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hero Image URL</label>
                <Input
                  name="hero_image_url"
                  defaultValue={settings.hero_image_url}
                  placeholder="https://example.com/hero-image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Footer Text</label>
                <Textarea
                  name="footer_text"
                  defaultValue={settings.footer_text}
                  placeholder="© 2024 All rights reserved"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Theme Color</label>
                <Input
                  type="color"
                  name="theme_color"
                  defaultValue={settings.theme_color}
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Custom Domain</label>
                <Input
                  name="custom_domain"
                  defaultValue={settings.custom_domain || ""}
                  placeholder="www.yourstore.com"
                />
              </div>

              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Hero Section</h3>
                <p className="text-gray-600">Title: {settings.hero_title}</p>
                <p className="text-gray-600">Subtitle: {settings.hero_subtitle}</p>
                {settings.hero_image_url && (
                  <img
                    src={settings.hero_image_url}
                    alt="Hero"
                    className="mt-2 rounded-lg h-40 object-cover"
                  />
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Footer</h3>
                <p className="text-gray-600">{settings.footer_text}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Theme Color</h3>
                <div
                  className="w-12 h-12 rounded-lg border"
                  style={{ backgroundColor: settings.theme_color }}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Custom Domain</h3>
                <p className="text-gray-600">
                  {settings.custom_domain || "No custom domain set"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}