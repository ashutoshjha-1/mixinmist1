import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import FindProducts from "@/pages/FindProducts";
import MyProducts from "@/pages/MyProducts";
import Store from "@/pages/Store";
import StoreSettings from "@/pages/dashboard/StoreSettings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/find-products" element={<FindProducts />} />
        <Route path="/dashboard/my-products" element={<MyProducts />} />
        <Route path="/dashboard/store-settings" element={<StoreSettings />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/store/:storeName" element={<Store />} />
      </Routes>
    </Router>
  );
}

export default App;