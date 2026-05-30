import React from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, size = 'default', ...props }) {
  return (
    <div
      data-size={size}
      className={cn(
        'rounded-2xl bg-white text-gray-900 shadow-sm ring-1 ring-gray-100',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('p-4 pb-0', className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <div className={cn('text-base font-semibold', className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <div className={cn('text-sm text-gray-500', className)} {...props} />;
}

export function CardAction({ className, ...props }) {
  return <div className={cn('p-4 pt-0', className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-4', className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div className={cn('p-4 pt-0', className)} {...props} />;
}