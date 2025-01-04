import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import FindProducts from "@/pages/FindProducts";
import MyProducts from "@/pages/MyProducts";
import Store from "@/pages/Store";
import StoreSettings from "@/pages/dashboard/StoreSettings";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/find-products" element={<FindProducts />} />
          <Route path="/dashboard/my-products" element={<MyProducts />} />
          <Route path="/dashboard/store-settings" element={<StoreSettings />} />
          <Route path="/store/:storeName" element={<Store />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;