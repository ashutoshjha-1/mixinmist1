import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import FindProducts from "./pages/FindProducts";
import MyProducts from "./pages/MyProducts";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/signin"
              element={
                !session ? <SignIn /> : <Navigate to="/dashboard" replace />
              }
            />
            <Route
              path="/signup"
              element={
                !session ? <SignUp /> : <Navigate to="/dashboard" replace />
              }
            />
            <Route
              path="/dashboard"
              element={
                session ? <Dashboard /> : <Navigate to="/signin" replace />
              }
            />
            <Route
              path="/dashboard/find-products"
              element={
                session ? <FindProducts /> : <Navigate to="/signin" replace />
              }
            />
            <Route
              path="/dashboard/my-products"
              element={
                session ? <MyProducts /> : <Navigate to="/signin" replace />
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;