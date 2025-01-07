import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthApiError } from "@supabase/supabase-js";
import { validateSignupForm } from "@/utils/validation";
import { toast } from "@/hooks/use-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // Validate form data
      validateSignupForm(email, password, fullName, storeName, username);

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
        console.error("Signup error details:", signUpError);
        
        if (signUpError instanceof AuthApiError) {
          switch (signUpError.message) {
            case "Database error saving new user":
              setError("Username may already be taken. Please try a different username.");
              break;
            case "User already registered":
              setError("An account with this email already exists. Please sign in instead.");
              break;
            default:
              setError(signUpError.message);
          }
        } else {
          setError("An unexpected error occurred. Please try again.");
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
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
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
            Create your account
          </h2>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <SignUpForm 
          onSubmit={handleSubmit}
          loading={loading}
          onSignInClick={() => navigate("/signin")}
        />
      </div>
    </div>
  );
};

export default SignUp;