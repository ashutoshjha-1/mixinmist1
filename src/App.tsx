import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Store from "@/pages/Store";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage"; // Import the CartPage component
import Dashboard from "@/pages/dashboard/Dashboard";
import StoreSettings from "@/pages/dashboard/StoreSettings";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/store/:username" element={<Store />} />
        <Route path="/store/:username/product/:productId" element={<ProductPage />} />
        <Route path="/store/:username/cart" element={<CartPage />} /> {/* Add this new route */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/store-settings" element={<StoreSettings />} />
      </Routes>
    </Router>
  );
}

export default App;
