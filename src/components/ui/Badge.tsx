'use client';

import { cn } from '@/lib/utils/cn';
import type { StockStatus } from '@/lib/types';

interface BadgeProps {
  variant?: StockStatus | 'default' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-green-100 text-green-800': variant === 'AVAILABLE' || variant === 'success',
          'bg-yellow-100 text-yellow-800': variant === 'PENDING_PAYMENT' || variant === 'warning',
          'bg-red-100 text-red-800': variant === 'SOLD' || variant === 'danger',
          'bg-gray-100 text-gray-800': variant === 'default',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
