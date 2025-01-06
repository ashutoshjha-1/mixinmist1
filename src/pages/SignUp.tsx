import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { validateSignupForm } from "@/utils/validation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError } from "@supabase/supabase-js";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const email = (formData.get("email") as string).trim().toLowerCase();
      const password = formData.get("password") as string;
      const fullName = (formData.get("fullName") as string).trim();
      const phone = (formData.get("phone") as string)?.trim() || null;
      const storeName = (formData.get("storeName") as string).trim();
      const username = (formData.get("username") as string).toLowerCase().trim();

      // Validate form data
      validateSignupForm(email, password, fullName, storeName, username);

      // Prepare metadata
      const metadata = {
        full_name: fullName,
        phone,
        store_name: storeName,
        username,
      };

      // Attempt signup with proper error handling
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/signin`,
        },
      });

      if (signUpError) {
        if (signUpError instanceof AuthError) {
          if (signUpError.message.includes("Database error")) {
            setError("Username may already be taken. Please try a different username.");
          } else {
            setError(signUpError.message);
          }
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
        return;
      }

      if (data?.user) {
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
        navigate("/signin");
      } else {
        throw new Error("No user data returned from signup");
      }
    } catch (error: any) {
      console.error("Error in signup process:", error);
      setError(error.message);
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