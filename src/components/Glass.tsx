import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';

type Variant = 'default' | 'smoked' | 'clear';

interface GlassProps<T extends ElementType> {
  as?: T;
  variant?: Variant;
  className?: string;
  children?: ReactNode;
}

const variantClass: Record<Variant, string> = {
  default: '',
  smoked: 'glass-smoked',
  clear: 'glass-clear',
};

export default function Glass<T extends ElementType = 'div'>({
  as,
  variant = 'default',
  className = '',
  children,
  ...rest
}: GlassProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof GlassProps<T>>) {
  const Tag = (as || 'div') as ElementType;
  return (
    <Tag className={`glass ${variantClass[variant]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
