import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  User,
  Search,
  PackageSearch
} from "lucide-react";

export const DashboardSidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-4">
      <div className="space-y-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
              isActive
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/dashboard/find-products"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
              isActive
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <Search className="h-5 w-5" />
          <span>Find Products</span>
        </NavLink>

        <NavLink
          to="/dashboard/my-products"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
              isActive
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <Package className="h-5 w-5" />
          <span>My Products</span>
        </NavLink>

        <NavLink
          to="/dashboard/orders"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
              isActive
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <ShoppingCart className="h-5 w-5" />
          <span>Orders</span>
        </NavLink>

        <NavLink
          to="/dashboard/sample-orders"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
              isActive
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <PackageSearch className="h-5 w-5" />
          <span>Sample Orders</span>
        </NavLink>

        <NavLink
          to="/dashboard/store-settings"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
              isActive
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <Settings className="h-5 w-5" />
          <span>Store Settings</span>
        </NavLink>

        <NavLink
          to="/dashboard/my-account"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
              isActive
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <User className="h-5 w-5" />
          <span>My Account</span>
        </NavLink>
      </div>
    </div>
  );
};