import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants: Record<Variant, string> = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-200',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 shadow-sm shadow-secondary-200',
    outline: 'border-2 border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-700 bg-white',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-error-600 text-white hover:bg-error-700 shadow-sm shadow-error-200',
    success: 'bg-success-600 text-white hover:bg-success-700 shadow-sm shadow-success-200',
  };
  const sizes: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3.5 text-base rounded-xl',
  };
  return (
    <button
      className={`font-semibold transition-all duration-200 active:scale-[0.98] ${
        variants[variant]
      } ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
