import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { validateSignupForm } from "@/utils/validation";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string).trim().toLowerCase();
    const password = formData.get("password") as string;
    const fullName = (formData.get("fullName") as string).trim();
    const phone = (formData.get("phone") as string)?.trim() || null;
    const storeName = (formData.get("storeName") as string).trim();
    const username = (formData.get("username") as string).toLowerCase().trim();

    try {
      // Validate form data
      validateSignupForm(email, password, fullName, storeName, username);

      // Prepare metadata
      const metadata = {
        full_name: fullName,
        phone,
        store_name: storeName,
        username,
      };

      console.log("Starting signup process with metadata:", metadata);

      // Attempt signup
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/signin`,
        },
      });

      console.log("Signup response:", { data, error: signUpError });

      if (signUpError) {
        console.error("Signup error:", signUpError);
        
        if (signUpError.message.includes("Database error")) {
          setError("Username may already be taken or there was an error creating your profile. Please try a different username.");
        } else {
          setError(signUpError.message);
        }
        return;
      }

      if (data?.user) {
        console.log("Signup successful. User data:", data.user);
        
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