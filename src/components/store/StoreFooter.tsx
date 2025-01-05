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
  return (
    <footer className="bg-[#1A1F2C] text-gray-300">
      {bottomMenuItems && bottomMenuItems.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-gray-700">
          <nav className="flex flex-wrap justify-center gap-8">
            {bottomMenuItems.map((item, index) => (
              <a
                key={index}
                href={item.url}
                className="hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm">
            {footerText || "© 2024 All rights reserved"}
          </p>
          
          {footerLinks && footerLinks.length > 0 && (
            <nav className="flex gap-6">
              {footerLinks.map((link, index) => (
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
    </footer>
  );
}