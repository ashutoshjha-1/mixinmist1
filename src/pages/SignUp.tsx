import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, User, Phone, Store, AtSign } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const fullName = formData.get("fullName") as string;
      const phone = formData.get("phone") as string;
      const storeName = formData.get("storeName") as string;
      const username = formData.get("username") as string;

      // Basic validation
      if (!username.match(/^[a-z0-9_-]{3,}$/)) {
        setError("Username must be at least 3 characters and can only contain letters, numbers, underscores, and hyphens");
        return;
      }

      const metadata = {
        full_name: fullName.trim(),
        phone: phone?.trim() || null,
        store_name: storeName.trim(),
        username: username.toLowerCase().trim(),
      };

      console.log("Starting signup process with metadata:", metadata);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: metadata,
        },
      });

      if (signUpError) {
        console.error("Signup error:", signUpError);
        if (signUpError.message.includes("Username")) {
          setError("This username is already taken. Please choose another one.");
        } else if (signUpError.message.includes("User already registered")) {
          setError("An account with this email already exists. Please sign in instead.");
        } else {
          setError(signUpError.message);
        }
        return;
      }

      if (data?.user) {
        console.log("Signup successful, user data:", data.user);
        toast({
          title: "Account created successfully",
          description: "Please check your email to verify your account.",
        });
        navigate("/signin");
      }
    } catch (error) {
      console.error("Error in signup process:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="pl-10"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
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
                  required
                  className="pl-10"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="pl-10"
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <div className="relative">
                <Store className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="storeName"
                  name="storeName"
                  type="text"
                  required
                  className="pl-10"
                  placeholder="My Awesome Store"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="pl-10"
                  placeholder="johndoe"
                  pattern="^[a-z0-9_-]{3,}$"
                  title="Username must be at least 3 characters and can only contain letters, numbers, underscores, and hyphens"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Sign up"}
            </Button>
            
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="font-medium text-primary hover:text-primary/80"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;