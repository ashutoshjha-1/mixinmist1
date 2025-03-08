import { Mail, FileText, Info } from "lucide-react";

interface FooterLink {
  label: string;
  url: string;
}

interface StoreFooterProps {
  themeColor?: string | null;
  footerText?: string | null;
  footerLinks?: FooterLink[] | null;
  bottomMenuItems?: FooterLink[] | null;
}

export function StoreFooter({
  themeColor = "#4F46E5",
  footerText,
  footerLinks,
  bottomMenuItems,
}: StoreFooterProps) {
  const companyLinks = [
    { label: "About Us", url: "#" },
    { label: "Contact", url: "mailto:info@ayurvedology.com" },
  ];

  const policyLinks = [
    { label: "Shipping Policy", url: "/shipping-policy" },
    { label: "Privacy Policy", url: "/privacy-policy" },
    { label: "Terms & Conditions", url: "/terms" },
    { label: "Refund Policy", url: "/refund-policy" },
  ];

  return (
    <footer className="bg-[#1A1F2C] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">MixinMist</h3>
            <p className="text-sm">
              A brand of Ayurvedology Healthtech Private Limited
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Policies</h3>
            <ul className="space-y-2">
              {policyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <div className="space-y-2">
              <a
                href="mailto:info@ayurvedology.com"
                className="flex items-center text-sm hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 mr-2" />
                info@ayurvedology.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">
              {footerText || "© 2024 MixinMist. All rights reserved"}
            </p>
            
            {bottomMenuItems && bottomMenuItems.length > 0 && (
              <nav className="flex gap-6">
                {bottomMenuItems.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}