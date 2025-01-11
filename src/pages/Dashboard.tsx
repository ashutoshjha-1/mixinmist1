import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionGuard } from "@/components/auth/SubscriptionGuard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('sb-zevuqoiqmlkudholotmp-auth-token');
      
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
      });

      navigate("/");
      
      toast({
        title: "Signed out successfully",
        description: "All session data has been cleared",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  return (
    <SubscriptionGuard>
      <div className="min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="ml-64 p-8">
          <DashboardHeader onSignOut={handleSignOut} />
          <div className="text-center mt-20">
            <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
            <p className="text-gray-600 mb-8">
              Get started by exploring products or setting up your brand
            </p>
          </div>
        </div>
      </div>
    </SubscriptionGuard>
  );
};

export default Dashboard;