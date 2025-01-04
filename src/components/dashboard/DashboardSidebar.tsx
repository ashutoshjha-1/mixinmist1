import { Link } from "react-router-dom";
import {
  Search,
  Package,
  Users,
  Boxes,
  UserCircle,
  RollerCoaster,
  MessageSquare,
  HelpCircle,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const DashboardSidebar = () => {
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
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">blanka.</h1>
      </div>
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-400 mb-2">
            MY BRAND SETUP
          </h2>
          <Button variant="secondary" className="w-full justify-start" asChild>
            <Link to="/dashboard/store-settings">
              <Settings className="mr-2 h-4 w-4" />
              STORE SETTINGS
            </Link>
          </Button>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-400 mb-2">PRODUCTS</h2>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/dashboard/find-products">
                <Search className="mr-2 h-4 w-4" />
                FIND PRODUCTS
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/dashboard/my-products">
                <Package className="mr-2 h-4 w-4" />
                MY PRODUCTS
              </Link>
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-400 mb-2">ORDERS</h2>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/dashboard/sample-orders">
                <Package className="mr-2 h-4 w-4" />
                SAMPLE ORDERS
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/dashboard/customer-orders">
                <Users className="mr-2 h-4 w-4" />
                CUSTOMER ORDERS
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/dashboard/inventory-orders">
                <Boxes className="mr-2 h-4 w-4" />
                INVENTORY ORDERS
              </Link>
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-400 mb-2">
            MY ACCOUNT
          </h2>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/dashboard/my-account">
                <UserCircle className="mr-2 h-4 w-4" />
                MY ACCOUNT
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/dashboard/my-brand">
                <RollerCoaster className="mr-2 h-4 w-4" />
                MY BRAND
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/dashboard/marketing">
                <MessageSquare className="mr-2 h-4 w-4" />
                MARKETING
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/dashboard/help">
                <HelpCircle className="mr-2 h-4 w-4" />
                HELP
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              SIGN OUT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}