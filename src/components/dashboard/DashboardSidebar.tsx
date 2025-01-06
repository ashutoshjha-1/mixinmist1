import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  User,
  Search,
  PackageSearch,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard"
  },
  {
    icon: Search,
    label: "Find Products",
    path: "/dashboard/find-products"
  },
  {
    icon: Package,
    label: "My Products",
    path: "/dashboard/my-products"
  },
  {
    icon: ShoppingCart,
    label: "Orders",
    path: "/dashboard/orders"
  },
  {
    icon: PackageSearch,
    label: "Sample Orders",
    path: "/dashboard/sample-orders"
  },
  {
    icon: Settings,
    label: "Store Settings",
    path: "/dashboard/store-settings"
  },
  {
    icon: User,
    label: "My Account",
    path: "/dashboard/my-account"
  }
];

export const DashboardSidebar = () => {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="border-r border-gray-200 bg-white">
        <SidebarHeader className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/d188b2cd-a055-4de0-9783-ce4db92f72a1.png" 
              alt="Logo" 
              className="h-8 w-8"
            />
            <span className="font-semibold text-lg">Dashboard</span>
          </div>
          <SidebarTrigger className="ml-auto" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.label}
                  className="w-full"
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};