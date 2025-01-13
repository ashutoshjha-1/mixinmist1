import Navbar from "@/components/Navbar";
import { StoreFooter } from "@/components/store/StoreFooter";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
        <div className="prose prose-slate max-w-none space-y-6">
          <p>
            Thank you for shopping with us. If you are not entirely satisfied with your purchase, we're here to help.
          </p>
          <h2 className="text-2xl font-semibold">Returns</h2>
          <p>
            You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
          </p>
          <h2 className="text-2xl font-semibold">Refunds</h2>
          <p>
            Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item. If your return is approved, we will initiate a refund to your credit card (or original method of payment). You will receive the credit within a certain amount of days, depending on your card issuer's policies.
          </p>
          <h2 className="text-2xl font-semibold">Shipping</h2>
          <p>
            You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
          </p>
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p>
            If you have any questions on how to return your item to us, contact us at support@example.com.
          </p>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}