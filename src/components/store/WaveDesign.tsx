interface WaveDesignProps {
  color?: string;
  className?: string;
}

export const WaveDesign = ({ color = "#4F46E5", className = "" }: WaveDesignProps) => {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        className="w-full h-24 md:h-32 animate-wave"
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          className="animate-wave-slow"
          fill={color}
          fillOpacity="0.15"
          d="M0,32L48,37.3C96,43,192,53,288,80C384,107,480,149,576,144C672,139,768,85,864,64C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
        <path
          className="animate-wave-fast"
          fill={color}
          fillOpacity="0.1"
          d="M0,96L48,85.3C96,75,192,53,288,58.7C384,64,480,96,576,106.7C672,117,768,107,864,90.7C960,75,1056,53,1152,42.7C1248,32,1344,32,1392,32L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
      </svg>
    </div>
  );
};