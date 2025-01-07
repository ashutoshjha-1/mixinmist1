import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { validateSignupForm } from "@/utils/auth-validation";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";

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
      const { email, password, metadata } = validateSignupForm(formData);

      console.log("Starting signup process with metadata:", metadata);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.full_name,
            phone: metadata.phone || null,
            store_name: metadata.store_name,
            username: metadata.username.toLowerCase(),
          },
        }
      });

      if (signUpError) {
        console.error("Signup error:", signUpError);
        if (signUpError instanceof AuthError) {
          // Handle specific auth errors
          switch (signUpError.status) {
            case 500:
              throw new Error("There was an issue creating your account. Please try again with a different username.");
            default:
              throw signUpError;
          }
        }
        throw signUpError;
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