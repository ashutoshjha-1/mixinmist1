import { Palette, ShoppingCart, Zap, Globe } from "lucide-react";

const features = [
  {
    name: "Brand Customization",
    description:
      "Customize your brand identity with our intuitive drag-and-drop editor. Create stunning designs that reflect your unique style.",
    icon: Palette,
  },
  {
    name: "E-Commerce Integration",
    description:
      "Seamlessly sell your products with integrated payment processing and inventory management tools.",
    icon: ShoppingCart,
  },
  {
    name: "AI-Powered Tools",
    description:
      "Leverage artificial intelligence to generate brand elements and optimize your marketing strategy.",
    icon: Zap,
  },
  {
    name: "Global Reach",
    description:
      "Connect with customers worldwide through our multilingual support and international shipping options.",
    icon: Globe,
  },
];

const Features = () => {
  return (
    <div className="py-24 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive suite of tools and features helps you build and grow
            your brand effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.name}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;