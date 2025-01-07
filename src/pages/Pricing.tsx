import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Check } from "lucide-react";

const PricingPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    "Unlimited Store Products",
    "Custom Domain Support",
    "Advanced Analytics",
    "Priority Support",
    "Custom Branding",
    "API Access"
  ];

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to subscribe",
          variant: "destructive",
        });
        navigate("/signin");
        return;
      }

      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const { url, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to start subscription process",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need to grow your business online
          </p>
        </div>

        <div className="mt-20 max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-none lg:flex">
          <div className="flex-1 bg-white px-6 py-8 lg:p-12">
            <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              Professional Plan
            </h3>
            <p className="mt-6 text-base text-gray-500">
              Get access to all features and grow your business with our professional tools
            </p>
            <div className="mt-8">
              <div className="flex items-center">
                <h4 className="flex-shrink-0 pr-4 text-sm tracking-wider font-semibold uppercase text-primary">
                  What's included
                </h4>
                <div className="flex-1 border-t-2 border-gray-200" />
              </div>
              <ul className="mt-8 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start lg:col-span-1">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-400" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">{feature}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="py-8 px-6 text-center bg-gray-50 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
            <p className="text-lg leading-6 font-medium text-gray-900">
              Monthly subscription
            </p>
            <div className="mt-4 flex items-center justify-center text-5xl font-extrabold text-gray-900">
              <span>$29</span>
              <span className="ml-3 text-xl font-medium text-gray-500">
                /month
              </span>
            </div>
            <div className="mt-6">
              <Button
                onClick={handleSubscribe}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Subscribe Now"}
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Secure payment processing by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;