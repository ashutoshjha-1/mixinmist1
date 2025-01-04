import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import MyProducts from "@/pages/MyProducts";
import FindProducts from "@/pages/FindProducts";
import Store from "@/pages/Store";
import StoreSettings from "@/pages/dashboard/StoreSettings";
import MyAccount from "@/pages/dashboard/MyAccount";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/store/:storeName" element={<Store />} />
        
        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
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
          path="/dashboard/find-products"
          element={
            <AuthGuard>
              <FindProducts />
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