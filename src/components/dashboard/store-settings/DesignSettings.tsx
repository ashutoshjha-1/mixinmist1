import { StoreSettings } from "@/integrations/supabase/types/store-settings";

interface DesignSettingsProps {
  isEditing: boolean;
  settings: StoreSettings;
}

export const DesignSettings = ({ isEditing, settings }: DesignSettingsProps) => {
  return (
    <div className="space-y-6">
      {/* This component is now empty and ready for new design settings */}
    </div>
  );
};
