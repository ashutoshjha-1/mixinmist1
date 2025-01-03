import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100 -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          <h1 className="animate-fade-down text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Transform Your Brand with{" "}
            <span className="text-primary">SaaSify</span>
          </h1>
          <p className="animate-fade-up text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The all-in-one platform for creating, managing, and scaling your brand.
            Start your journey today and join thousands of successful businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up">
            <Button size="lg" className="text-lg px-8" onClick={() => navigate("/signup")}>
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;