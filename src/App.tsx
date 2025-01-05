import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import Dashboard from "@/pages/Dashboard";
import Store from "@/pages/Store";
import ProductPage from "@/pages/ProductPage";
import FindProducts from "@/pages/FindProducts";
import MyProducts from "@/pages/MyProducts";
import CustomerOrders from "@/pages/dashboard/CustomerOrders";
import MyAccount from "@/pages/dashboard/MyAccount";
import StoreSettings from "@/pages/dashboard/StoreSettings";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/store/:username" element={<Store />} />
        <Route path="/store/:username/product/:productId" element={<ProductPage />} />
        <Route path="/dashboard/find-products" element={<FindProducts />} />
        <Route path="/dashboard/my-products" element={<MyProducts />} />
        <Route path="/dashboard/customer-orders" element={<CustomerOrders />} />
        <Route path="/dashboard/my-account" element={<MyAccount />} />
        <Route path="/dashboard/store-settings" element={<StoreSettings />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;