import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/contexts/CartContext";

// Pages
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import Store from "@/pages/Store";
import ProductPage from "@/pages/ProductPage";
import FindProducts from "@/pages/FindProducts";
import MyProducts from "@/pages/MyProducts";
import CustomerOrders from "@/pages/dashboard/CustomerOrders";
import StoreSettings from "@/pages/dashboard/StoreSettings";
import MyAccount from "@/pages/dashboard/MyAccount";
import SampleOrders from "@/pages/SampleOrders";

// Components
import { AuthGuard } from "@/components/auth/AuthGuard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
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
              path="/dashboard/orders"
              element={
                <AuthGuard>
                  <CustomerOrders />
                </AuthGuard>
              }
            />
            <Route
              path="/dashboard/sample-orders"
              element={
                <AuthGuard>
                  <SampleOrders />
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
            <Route path="/store/:username" element={<Store />} />
            <Route
              path="/store/:username/product/:productId"
              element={<ProductPage />}
            />
          </Routes>
          <Toaster />
        </Router>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;