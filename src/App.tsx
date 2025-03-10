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
import StoreSettings from "@/pages/StoreSettings";
import MyAccount from "@/pages/MyAccount";
import CustomerOrders from "@/pages/dashboard/CustomerOrders";
import Users from "@/pages/Users";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/store/:storename" element={<Store />} />
        <Route path="/store/:storename/product/:productId" element={<ProductPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/find-products" element={<FindProducts />} />
        <Route path="/sample-orders" element={<SampleOrders />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/orders" element={<CustomerOrders />} />
        <Route path="/store-settings" element={<StoreSettings />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/users" element={<Users />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;