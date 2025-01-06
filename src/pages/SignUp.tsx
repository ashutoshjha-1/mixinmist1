import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { validateSignupForm } from "@/utils/validation";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string).trim();
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      console.log("Signup response:", { data, error });

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
      } else {
        throw new Error("No user data returned from signup");
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