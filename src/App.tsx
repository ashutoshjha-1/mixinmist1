import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

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
        <Route path="/orders" element={<Dashboard />} />
        <Route path="/store-settings" element={<Dashboard />} />
        <Route path="/my-account" element={<Dashboard />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;