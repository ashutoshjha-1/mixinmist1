import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/dashboard/Dashboard";
import Store from "@/pages/Store";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import AuthGuard from "@/components/auth/AuthGuard";
import StoreSettings from "@/pages/dashboard/StoreSettings";
import FindProducts from "@/pages/FindProducts";
import MyProducts from "@/pages/MyProducts";
import MyAccount from "@/pages/dashboard/MyAccount";
import CustomerOrders from "@/pages/dashboard/CustomerOrders";

function App() {
  return (
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
        >
          <Route path="store-settings" element={<StoreSettings />} />
          <Route path="find-products" element={<FindProducts />} />
          <Route path="my-products" element={<MyProducts />} />
          <Route path="my-account" element={<MyAccount />} />
          <Route path="customer-orders" element={<CustomerOrders />} />
        </Route>
        <Route path="/:username" element={<Store />} />
        <Route path="/:username/products/:productId" element={<ProductPage />} />
        <Route path="/:username/cart" element={<CartPage />} />
      </Routes>
      <Toaster />
      <SonnerToaster />
    </Router>
  );
}

export default App;