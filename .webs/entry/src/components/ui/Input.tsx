import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = "", id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          glass-input w-full px-4 py-2.5 rounded-lg text-text-primary placeholder:text-text-muted
          focus:ring-1 focus:ring-brand-primary focus:border-brand-primary
          ${error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500" : ""}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 font-semibold tracking-wide">
          {error}
        </span>
      )}
    </div>
  );
}
