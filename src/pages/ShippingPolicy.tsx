import { Navbar } from "@/components/Navbar";
import { StoreFooter } from "@/components/store/StoreFooter";

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>
        <div className="prose prose-slate max-w-none">
          <h2 className="text-xl font-semibold mb-4">MixinMist Shipping Policy</h2>
          <p className="mb-4">
            At MixinMist, a brand under Ayurvedology Healthtech Private Limited, we strive to provide efficient and reliable shipping services to our valued customers.
          </p>
          
          <h3 className="text-lg font-semibold mb-2">Shipping Times</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Standard Delivery: 3-5 business days</li>
            <li>Express Delivery: 1-2 business days (where available)</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">Shipping Costs</h3>
          <p className="mb-4">
            Shipping costs are calculated based on your location and the weight of the items in your order. The exact shipping cost will be displayed at checkout before payment.
          </p>

          <p className="text-sm text-gray-600 mt-8">
            For any shipping-related queries, please contact us at info@ayurvedology.com
          </p>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}