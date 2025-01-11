import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/contexts/CartContext";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Store from "@/pages/Store";
import ProductPage from "@/pages/ProductPage";
import Dashboard from "@/pages/Dashboard";
import FindProducts from "@/pages/FindProducts";
import MyProducts from "@/pages/MyProducts";
import CustomerOrders from "@/pages/dashboard/CustomerOrders";
import SampleOrders from "@/pages/SampleOrders";
import StoreSettings from "@/pages/dashboard/StoreSettings";
import MyAccount from "@/pages/dashboard/MyAccount";
import Pricing from "@/pages/Pricing";

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/store/:username" element={<Store />} />
          <Route path="/store/:username/product/:productId" element={<ProductPage />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/find-products" element={<FindProducts />} />
          <Route path="/dashboard/my-products" element={<MyProducts />} />
          <Route path="/dashboard/orders" element={<CustomerOrders />} />
          <Route path="/dashboard/sample-orders" element={<SampleOrders />} />
          <Route path="/dashboard/store-settings" element={<StoreSettings />} />
          <Route path="/dashboard/my-account" element={<MyAccount />} />
        </Routes>
        <Toaster />
      </CartProvider>
    </Router>
  );
}

export default App;