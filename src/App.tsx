import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Store from "@/pages/Store";
import Dashboard from "@/pages/Dashboard";
import MyProducts from "@/pages/MyProducts";
import FindProducts from "@/pages/FindProducts";
import SampleOrders from "@/pages/SampleOrders";
import ProductPage from "@/pages/ProductPage";
import Pricing from "@/pages/Pricing";
import StoreSettings from "@/pages/dashboard/StoreSettings";
import MyAccount from "@/pages/dashboard/MyAccount";
import CustomerOrders from "@/pages/dashboard/CustomerOrders";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/store/:username" element={<Store />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/find-products" element={<FindProducts />} />
        <Route path="/sample-orders" element={<SampleOrders />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/orders" element={<CustomerOrders />} />
        <Route path="/store-settings" element={<StoreSettings />} />
        <Route path="/my-account" element={<MyAccount />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;