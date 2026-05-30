import React from 'react';
import { cn } from '@/lib/utils';

export function Table({ className, ...props }) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }) {
  return <thead className={cn('[&_tr]:border-b', className)} {...props} />;
}

export function TableBody({ className, ...props }) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

export function TableFooter({ className, ...props }) {
  return <tfoot className={cn('border-t bg-gray-50 font-medium [&>tr]:last:border-b-0', className)} {...props} />;
}

export function TableRow({ className, ...props }) {
  return <tr className={cn('border-b transition-colors hover:bg-gray-50', className)} {...props} />;
}

export function TableHead({ className, ...props }) {
  return <th className={cn('h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-gray-900', className)} {...props} />;
}

export function TableCell({ className, ...props }) {
  return <td className={cn('p-2 align-middle whitespace-nowrap', className)} {...props} />;
}

export function TableCaption({ className, ...props }) {
  return <caption className={cn('mt-4 text-sm text-gray-500', className)} {...props} />;
}