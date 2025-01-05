import { ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      {children}
    </h3>
  );
}