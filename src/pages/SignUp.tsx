import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { AuthError } from "@supabase/supabase-js";

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

      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone?.trim() || null,
            store_name: storeName.trim(),
            username: username.toLowerCase().trim(),
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      navigate("/signin");
    } catch (err) {
      console.error("Signup error:", err);
      if (err instanceof AuthError) {
        switch (err.status) {
          case 400:
            setError("Invalid email or password format");
            break;
          case 422:
            setError("Username or email already taken");
            break;
          case 500:
            setError("Server error. Please try again later");
            break;
          default:
            setError(err.message);
        }
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

        <SignUpForm
          onSubmit={handleSubmit}
          loading={loading}
          onSignInClick={() => navigate("/signin")}
          error={error}
        />
      </div>
    </div>
  );
};

export default SignUp;