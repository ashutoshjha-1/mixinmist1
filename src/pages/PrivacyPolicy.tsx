import Navbar from "@/components/Navbar";
import { StoreFooter } from "@/components/store/StoreFooter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none">
          <h2 className="text-xl font-semibold mb-4">MixinMist Privacy Policy</h2>
          <p className="mb-4">
            Ayurvedology Healthtech Private Limited ("we," "our," or "us"), operating under the brand name MixinMist, is committed to protecting your privacy.
          </p>

          <h3 className="text-lg font-semibold mb-2">Information We Collect</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Personal information (name, email, address)</li>
            <li>Order history and preferences</li>
            <li>Device and usage information</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">How We Use Your Information</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Process your orders and provide customer support</li>
            <li>Send important updates about our services</li>
            <li>Improve our products and services</li>
          </ul>

          <p className="text-sm text-gray-600 mt-8">
            For privacy-related inquiries, please contact us at info@ayurvedology.com
          </p>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}