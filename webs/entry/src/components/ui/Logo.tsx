import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export default function Logo({ className = "", size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-auto",
    md: "h-9 w-auto",
    lg: "h-14 w-auto",
    xl: "h-20 w-auto",
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official .de logo image asset */}
      <img
        src="/logo.png"
        alt="dotentry Logo"
        className={`${sizeClasses[size]} glow-glow transition-all duration-300 hover:scale-105 object-contain`}
      />
      
      {showText && (
        <span className="font-mono font-black tracking-tighter text-white">
          <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent glow-text-cyan">
            dot
          </span>
          <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            entry
          </span>
        </span>
      )}
    </div>
  );
}
