import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthGuard } from "@/components/auth/AuthGuard";
import AdminSignIn from "@/pages/AdminSignIn";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import Store from "@/pages/Store";
import FindProducts from "@/pages/FindProducts";
import Orders from "@/pages/Orders";
import Settings from "@/pages/Settings";
import StoreSettings from "@/pages/StoreSettings";
import Product from "@/pages/Product";
import { CartProvider } from "@/contexts/CartContext";

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin/signin" element={<AdminSignIn />} />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/dashboard/products"
            element={
              <AuthGuard>
                <FindProducts />
              </AuthGuard>
            }
          />
          <Route
            path="/dashboard/orders"
            element={
              <AuthGuard>
                <Orders />
              </AuthGuard>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <AuthGuard>
                <Settings />
              </AuthGuard>
            }
          />
          <Route
            path="/dashboard/store"
            element={
              <AuthGuard>
                <StoreSettings />
              </AuthGuard>
            }
          />
          <Route path="/store/:username" element={<Store />} />
          <Route path="/store/:username/product/:id" element={<Product />} />
        </Routes>
        <Toaster />
      </CartProvider>
    </Router>
  );
}

export default App;