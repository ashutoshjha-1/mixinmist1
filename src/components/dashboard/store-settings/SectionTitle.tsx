interface SectionTitleProps {
  title: string;
  description: string;
}

export function SectionTitle({ title, description }: SectionTitleProps) {
  return (
    <div className="space-y-1">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}