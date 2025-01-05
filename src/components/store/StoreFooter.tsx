import React from 'react';
import { FooterLink } from "@/integrations/supabase/types/footer";

interface StoreFooterProps {
  themeColor: string;
  footerText: string | null;
  footerLinks: FooterLink[] | null;
}

export const StoreFooter = ({ themeColor, footerText, footerLinks }: StoreFooterProps) => {
  return (
    <footer className="py-12 px-4 bg-gray-900" style={{ backgroundColor: "#1A1F2C" }}>
      <div className="max-w-7xl mx-auto text-gray-300">
        <p className="text-center mb-4">{footerText || '© 2024 All rights reserved'}</p>
        <div className="flex justify-center space-x-4">
          {footerLinks?.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-gray-300 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};