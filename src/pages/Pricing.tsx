import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { loadRazorpay } from "@/utils/razorpay";
import { supabase } from "@/integrations/supabase/client";

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

  const createSubscription = async () => {
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

      // Get current timestamp and ensure start_at is current or future
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const startAt = currentTimestamp + 60; // Start 1 minute from now
      const expireTimestamp = startAt + 1800; // 30 minutes from start

      console.log('Creating subscription via Edge Function');

      const { data, error } = await supabase.functions.invoke('create-razorpay-subscription', {
        body: {
          planId: 'plan_PiWVhnhwqnvGms',
          totalCount: 6,
          quantity: 1,
          customerNotify: 1,
          startAt: startAt,
          expireBy: expireTimestamp,
          offerId: 'offer_PiYlFyG1gAU0nr',
          addons: [
            {
              item: {
                name: "Subscription Fee",
                amount: 99900, // 999 INR in paise
                currency: "INR"
              }
            }
          ],
          notes: {
            user_id: session.user.id,
            user_email: session.user.email
          }
        }
      });

      console.log('Edge Function response:', data);

      if (error) {
        throw new Error(error.message || 'Failed to create subscription');
      }

      // Load Razorpay SDK
      const razorpay = await loadRazorpay();
      if (!razorpay) {
        throw new Error("Razorpay SDK failed to load");
      }

      // Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        subscription_id: data.id,
        name: "Your Store Name",
        description: "Professional Plan Subscription",
        handler: function (response: any) {
          console.log("Payment successful:", response);
          toast({
            title: "Subscription successful!",
            description: "Your subscription has been activated.",
          });
          navigate("/dashboard");
        },
        prefill: {
          email: session.user.email,
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const paymentObject = new razorpay(options);
      paymentObject.open();
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
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
              <span>₹999</span>
              <span className="ml-3 text-xl font-medium text-gray-500">
                /month
              </span>
            </div>
            <div className="mt-6">
              <Button
                onClick={createSubscription}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Subscribe Now"
                )}
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Secure payment processing by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;