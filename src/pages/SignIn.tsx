
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState(false);
  const { toast } = useToast();

  // Check connection to Supabase on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple ping to check if we can connect to Supabase
        const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error && error.message.includes('Failed to fetch')) {
          console.error('Supabase connection error:', error);
          setConnectionError(true);
        }
      } catch (err) {
        console.error('Supabase connection check failed:', err);
        setConnectionError(true);
      }
    };

    checkConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      console.log("Attempting signin with email:", email);

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        console.error("SignIn error:", signInError);
        if (signInError.message.includes('Failed to fetch')) {
          setConnectionError(true);
          setError("Unable to connect to authentication service. Please check your internet connection and try again.");
        } else {
          setError(signInError.message);
        }
        return;
      }

      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error in signin process:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      
      if (errorMessage.includes('Failed to fetch')) {
        setConnectionError(true);
        setError("Unable to connect to authentication service. Please check your internet connection and try again.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        {connectionError && (
          <Alert variant="destructive" className="bg-amber-50 text-amber-800 border-amber-300">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription className="mt-2">
              Unable to connect to the authentication service. This could be due to:
              <ul className="list-disc pl-5 mt-2">
                <li>Network connectivity issues</li>
                <li>VPN or firewall blocking the connection</li>
                <li>Temporary service outage</li>
              </ul>
              Please check your internet connection and try again.
            </AlertDescription>
          </Alert>
        )}

        {error && !connectionError && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-medium text-primary hover:text-primary/80"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
