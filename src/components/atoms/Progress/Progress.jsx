import React from 'react';
import { cn } from '@/lib/utils';

export function Progress({ className, children, value = 0, max = 100, ...props }) {
  const safeMax = max > 0 ? max : 100;
  const safeValue = Math.min(Math.max(Number(value) || 0, 0), safeMax);
  const percent = (safeValue / safeMax) * 100;

  return (
    <div className={cn('flex w-full flex-col gap-3', className)} {...props}>
      {children}
      <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function ProgressTrack({ className, ...props }) {
  return <div className={cn('h-1 w-full rounded-full bg-gray-200', className)} {...props} />;
}

export function ProgressIndicator({ className, ...props }) {
  return <div className={cn('h-full rounded-full bg-primary', className)} {...props} />;
}

export function ProgressLabel({ className, ...props }) {
  return <div className={cn('text-sm font-medium', className)} {...props} />;
}

export function ProgressValue({ className, ...props }) {
  return <div className={cn('ml-auto text-sm text-gray-500 tabular-nums', className)} {...props} />;
}