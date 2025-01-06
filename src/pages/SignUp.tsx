import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const storeName = formData.get("storeName") as string;
    const username = (formData.get("username") as string).toLowerCase().trim();

    try {
      // Basic validation
      if (!email || !password || !fullName || !storeName || !username) {
        throw new Error("All required fields must be filled");
      }

      // Username format validation
      if (!/^[a-zA-Z0-9_-]{3,}$/.test(username)) {
        throw new Error("Username must be at least 3 characters and can only contain letters, numbers, underscores, and hyphens");
      }

      // Prepare user metadata
      const metadata = {
        full_name: fullName.trim(),
        phone: phone ? phone.trim() : null,
        store_name: storeName.trim(),
        username: username,
      };

      console.log("Attempting signup with metadata:", metadata);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }

      if (data?.user) {
        console.log("Signup successful. User data:", data.user);
        
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
        
        navigate("/signin");
      }
    } catch (error: any) {
      console.error("Error in signup process:", error);
      
      let errorMessage = "An unexpected error occurred during signup";
      
      if (error.message.includes("Database error")) {
        errorMessage = "Username may already be taken. Please try a different username.";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "This email is already registered. Please sign in instead.";
      } else if (error.message.includes("Username")) {
        errorMessage = error.message;
      } else if (error.message.includes("valid email")) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message.includes("required fields")) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1234567890"
              />
            </div>
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                name="storeName"
                type="text"
                required
                placeholder="My Awesome Store"
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                placeholder="johndoe"
                pattern="^[a-zA-Z0-9_-]{3,}$"
                title="Username must be at least 3 characters and can only contain letters, numbers, underscores, and hyphens"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign up"}
            </Button>
            <div className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <Button
                type="button"
                variant="link"
                className="text-primary"
                onClick={() => navigate("/signin")}
              >
                Sign in
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;