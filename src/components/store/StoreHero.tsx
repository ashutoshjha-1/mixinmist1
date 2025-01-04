import React from 'react';

interface StoreHeroProps {
  heroImageUrl: string | null;
  themeColor: string;
  title: string;
  subtitle: string;
}

export const StoreHero = ({ heroImageUrl, themeColor, title, subtitle }: StoreHeroProps) => {
  return (
    <div
      className="relative h-[500px] bg-cover bg-center"
      style={{
        backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : "none",
        backgroundColor: heroImageUrl ? undefined : themeColor,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
        <h1 className="text-5xl font-bold mb-4">{title}</h1>
        <p className="text-xl">{subtitle}</p>
      </div>
    </div>
  );
};