import React from 'react';
import { FooterLink } from "@/integrations/supabase/types/footer";

interface StoreFooterProps {
  themeColor: string;
  footerText: string;
  footerLinks: FooterLink[];
}

export const StoreFooter = ({ themeColor, footerText, footerLinks }: StoreFooterProps) => {
  return (
    <footer className="py-12 px-4" style={{ backgroundColor: themeColor }}>
      <div className="max-w-7xl mx-auto text-white">
        <p className="text-center mb-4">{footerText}</p>
        <div className="flex justify-center space-x-4">
          {footerLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};