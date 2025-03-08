import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SectionTitle } from "./SectionTitle";

interface WaveSectionProps {
  isEditing: boolean;
  settings: {
    show_wave_design?: boolean;
    wave_color?: string;
  };
}

export function WaveSection({ isEditing, settings }: WaveSectionProps) {
  if (isEditing) {
    return (
      <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <SectionTitle>Wave Design Settings</SectionTitle>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="show_wave_design"
            name="show_wave_design"
            defaultChecked={settings.show_wave_design}
          />
          <Label htmlFor="show_wave_design">Show Wave Design</Label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wave Color
          </label>
          <Input
            type="color"
            name="wave_color"
            defaultValue={settings.wave_color || "#4F46E5"}
            className="w-full h-10"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <SectionTitle>Wave Design</SectionTitle>
      <div className="space-y-2">
        <p className="text-gray-700">
          <span className="font-medium">Show Wave:</span>{" "}
          {settings.show_wave_design ? "Yes" : "No"}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-medium">Wave Color:</span>
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: settings.wave_color }}
          />
        </div>
      </div>
    </div>
  );
}