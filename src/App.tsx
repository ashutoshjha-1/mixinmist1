import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Store from "@/pages/Store";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";
import Dashboard from "@/pages/dashboard/Dashboard";
import StoreSettings from "@/pages/dashboard/StoreSettings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/store/:username" element={<Store />} />
        <Route path="/store/:username/product/:productId" element={<ProductPage />} />
        <Route path="/store/:username/cart" element={<CartPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/store-settings" element={<StoreSettings />} />
      </Routes>
    </Router>
  );
}

export default App;