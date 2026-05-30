import React from 'react';
import { cn } from '@/lib/utils';

const variantClasses = {
  default: 'bg-primary text-white hover:bg-primary-600',
  outline: 'border-2 border-border bg-white text-gray-700 hover:border-primary hover:text-primary hover:bg-white',
  secondary: 'bg-surface text-text-strong hover:bg-gray-200',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  destructive: 'bg-danger text-white hover:bg-red-700',
  link: 'bg-transparent text-primary underline-offset-4 hover:underline px-0',
};

const sizeClasses = {
  default: 'h-11 px-5 py-2.5 text-sm',
  xs: 'h-8 px-3 text-xs',
  sm: 'h-9 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-11 w-11 p-0',
  'icon-xs': 'h-8 w-8 p-0',
  'icon-sm': 'h-9 w-9 p-0',
  'icon-lg': 'h-12 w-12 p-0',
};

export function Button({
  className,
  variant = 'default',
  size = 'default',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant] || variantClasses.default,
        sizeClasses[size] || sizeClasses.default,
        className
      )}
      {...props}
    />
  );
}