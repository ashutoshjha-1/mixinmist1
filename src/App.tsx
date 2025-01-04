import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Store from "@/pages/Store";
import FindProducts from "@/pages/FindProducts";
import MyProducts from "@/pages/MyProducts";
import CustomerOrders from "@/pages/dashboard/CustomerOrders";
import StoreSettings from "@/pages/dashboard/StoreSettings";
import MyAccount from "@/pages/dashboard/MyAccount";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/store/:username" element={<Store />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/dashboard/find-products"
          element={
            <AuthGuard>
              <FindProducts />
            </AuthGuard>
          }
        />
        <Route
          path="/dashboard/my-products"
          element={
            <AuthGuard>
              <MyProducts />
            </AuthGuard>
          }
        />
        <Route
          path="/dashboard/customer-orders"
          element={
            <AuthGuard>
              <CustomerOrders />
            </AuthGuard>
          }
        />
        <Route
          path="/dashboard/store-settings"
          element={
            <AuthGuard>
              <StoreSettings />
            </AuthGuard>
          }
        />
        <Route
          path="/dashboard/my-account"
          element={
            <AuthGuard>
              <MyAccount />
            </AuthGuard>
          }
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;