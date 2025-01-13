import { Navbar } from "@/components/Navbar";
import { StoreFooter } from "@/components/store/StoreFooter";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Cancellation/Refund Policy</h1>
        <div className="prose prose-slate max-w-none">
          <h2 className="text-xl font-semibold mb-4">MixinMist Refund Policy</h2>
          <p className="mb-4">
            At MixinMist, we want you to be completely satisfied with your purchase. Here's our refund and cancellation policy.
          </p>

          <h3 className="text-lg font-semibold mb-2">Order Cancellation</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Orders can be cancelled before shipping</li>
            <li>Cancellation requests must be sent to info@ayurvedology.com</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">Refunds</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Returns accepted within 7 days of delivery</li>
            <li>Product must be unused and in original packaging</li>
            <li>Refund will be processed within 5-7 business days</li>
          </ul>

          <p className="text-sm text-gray-600 mt-8">
            For refund-related queries, please contact us at info@ayurvedology.com
          </p>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}