import Navbar from "@/components/Navbar";
import { StoreFooter } from "@/components/store/StoreFooter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl mt-16">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none space-y-6">
          <p>
            This is the privacy policy for our application. We value your privacy and are committed to protecting your personal information.
          </p>
          <h2 className="text-2xl font-semibold">Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email address, and usage data when you use our services.
          </p>
          <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
          <p>
            We use your information to provide and improve our services, communicate with you, and comply with legal obligations.
          </p>
          <h2 className="text-2xl font-semibold">Data Security</h2>
          <p>
            We take reasonable measures to protect your information from unauthorized access, use, or disclosure.
          </p>
          <h2 className="text-2xl font-semibold">Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. Please contact us if you wish to exercise these rights.
          </p>
          <h2 className="text-2xl font-semibold">Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}