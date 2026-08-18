"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  heavy?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = "", heavy = false, onClick }: CardProps) {
  const CardContainer = onClick ? "div" : "div";
  
  return (
    <CardContainer
      onClick={onClick}
      className={`
        ${heavy ? "glass-panel-heavy" : "glass-panel"} 
        rounded-2xl p-6 shadow-xl transition-all duration-300
        ${onClick ? "cursor-pointer hover:border-brand-primary/30 hover:shadow-brand-primary/5 hover:shadow-2xl" : ""}
        ${className}
      `}
    >
      {children}
    </CardContainer>
  );
}
