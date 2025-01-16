import { Routes, Route } from "react-router-dom";
import { useCustomDomain } from './hooks/use-custom-domain';
import ProductPage from './pages/ProductPage';
import Store from './pages/Store';
import StoreSettings from './pages/StoreSettings';
import Dashboard from './pages/Dashboard';
import NotFound from './components/NotFound';

export default function App() {
  const { isLoading: isResolvingDomain } = useCustomDomain();

  if (isResolvingDomain) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading store...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/store/:storename" element={<Store />} />
      <Route path="/store/:storename/product/:productId" element={<ProductPage />} />
      <Route path="/store-settings" element={<StoreSettings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}