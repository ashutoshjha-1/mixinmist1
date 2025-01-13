import Navbar from "@/components/Navbar";
import { StoreFooter } from "@/components/store/StoreFooter";

export default function ShippingPolicy() {
  return (
    <div>
      <Navbar />
      <h1 className="text-2xl font-bold">Shipping Policy</h1>
      <p>
        Thank you for visiting and shopping at our store. The following
        information outlines our shipping policies.
      </p>
      <h2 className="text-xl font-semibold">Shipping Rates</h2>
      <p>
        We offer a flat rate shipping fee of $5.00 for all orders within the
        continental United States. Orders over $50 qualify for free shipping.
      </p>
      <h2 className="text-xl font-semibold">Delivery Time</h2>
      <p>
        Orders are processed within 2-3 business days. Delivery times may vary
        based on your location, but typically range from 5-7 business days.
      </p>
      <h2 className="text-xl font-semibold">International Shipping</h2>
      <p>
        We currently do not offer international shipping. We apologize for any
        inconvenience this may cause.
      </p>
      <h2 className="text-xl font-semibold">Order Tracking</h2>
      <p>
        Once your order has shipped, you will receive a confirmation email
        with a tracking number. You can use this number to track your order
        online.
      </p>
      <h2 className="text-xl font-semibold">Lost or Stolen Packages</h2>
      <p>
        We are not responsible for lost or stolen packages. If your tracking
        information shows that your package was delivered but you did not
        receive it, please contact your local post office for assistance.
      </p>
      <StoreFooter />
    </div>
  );
}
