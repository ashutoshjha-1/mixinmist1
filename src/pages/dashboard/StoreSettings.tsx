import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { HeroSection } from "@/components/dashboard/store-settings/HeroSection";
import { FooterSection } from "@/components/dashboard/store-settings/FooterSection";
import { HeaderSection } from "@/components/dashboard/store-settings/HeaderSection";
import { RoleBasedSettings } from "@/components/dashboard/store-settings/RoleBasedSettings";
import { CarouselSection } from "@/components/dashboard/store-settings/CarouselSection";
import { WaveSection } from "@/components/dashboard/store-settings/WaveSection";
import { useStoreSettings } from "@/hooks/use-store-settings";

export default function StoreSettings() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { settings, isLoading, error, updateSettings } = useStoreSettings();

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
          <DashboardHeader onSignOut={() => {}} />
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
          <DashboardHeader onSignOut={() => {}} />
          <div className="max-w-4xl mx-auto">
            <div>Loading settings...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="ml-64 p-8">
        <DashboardHeader onSignOut={() => {}} />
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
            <div className="space-x-4">
              <Button onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Edit Settings"}
              </Button>
              <Button
                onClick={() => navigate(`/store/${settings?.store_name}`)}
                variant="outline"
              >
                Preview Store
              </Button>
            </div>
          </div>

          <RoleBasedSettings />

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <HeaderSection isEditing={isEditing} settings={settings} />
              <HeroSection isEditing={isEditing} settings={settings} />
              <WaveSection isEditing={isEditing} settings={settings} />
              <CarouselSection isEditing={isEditing} settings={settings} />
              <FooterSection isEditing={isEditing} settings={settings} />

              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <HeaderSection isEditing={isEditing} settings={settings} />
              <HeroSection isEditing={isEditing} settings={settings} />
              <WaveSection isEditing={isEditing} settings={settings} />
              <CarouselSection isEditing={isEditing} settings={settings} />
              <FooterSection isEditing={isEditing} settings={settings} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}