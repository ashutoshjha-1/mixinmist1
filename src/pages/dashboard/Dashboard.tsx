import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <DashboardSidebar />
        <div className="flex-1 ml-64">
          <DashboardHeader onSignOut={handleSignOut} />
          <main className="p-8">
            <div className="text-center mt-20">
              <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
              <p className="text-gray-600 mb-8">
                Get started by exploring products or setting up your brand
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;