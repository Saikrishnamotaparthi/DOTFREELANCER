import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

const baseField =
  'w-full rounded-lg border bg-white/[0.02] px-4 py-3.5 text-[0.92rem] text-ink placeholder:text-ink-faint outline-none transition-colors duration-300 focus:border-brass';

function fieldBorder(error?: string) {
  return error ? 'border-red-400/50' : 'border-line';
}

interface FieldWrapProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}

export function FieldWrap({ label, required, error, children, hint }: FieldWrapProps) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline justify-between">
        <span className="font-mono text-[0.68rem] uppercase tracking-wide text-ink-faint">
          {label}
          {required && <span className="ml-1 text-brass">*</span>}
        </span>
        {hint && <span className="font-mono text-[0.62rem] text-ink-faint">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-[0.76rem] text-red-300">{error}</span>}
    </label>
  );
}

export function TextField({
  error,
  className = '',
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return <input {...rest} className={`${baseField} ${fieldBorder(error)} ${className}`} />;
}

export function TextAreaField({
  error,
  className = '',
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return <textarea {...rest} className={`${baseField} ${fieldBorder(error)} resize-none ${className}`} />;
}

export function SelectField({
  error,
  className = '',
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  return (
    <select {...rest} className={`${baseField} ${fieldBorder(error)} appearance-none ${className}`}>
      {children}
    </select>
  );
}
