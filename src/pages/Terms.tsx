import Navbar from "@/components/Navbar";
import { StoreFooter } from "@/components/store/StoreFooter";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        <div className="prose prose-slate max-w-none space-y-6">
          <h2 className="text-2xl font-semibold">MixinMist Terms of Service</h2>
          <p>
            Welcome to MixinMist, a brand operated by Ayurvedology Healthtech Private Limited. By accessing or using our services, you agree to these terms and conditions.
          </p>

          <h3 className="text-xl font-semibold">Use of Services</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must be 18 years or older to use our services</li>
            <li>You agree to provide accurate information</li>
            <li>You agree not to misuse our services</li>
          </ul>

          <h3 className="text-xl font-semibold">Intellectual Property</h3>
          <p>
            All content, trademarks, and intellectual property on this website belong to Ayurvedology Healthtech Private Limited.
          </p>

          <p className="text-sm text-gray-600 mt-8">
            For questions about these terms, please contact us at info@ayurvedology.com
          </p>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}