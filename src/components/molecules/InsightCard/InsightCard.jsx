import React from 'react';
import { Card } from '@/components';

/**
 * A compact insight card for the learning analytics dashboard.
 * Props:
 *   icon       — Lucide icon component
 *   title      — short heading (e.g. "Most Active Day")
 *   subtitle   — the insight value / detail text
 *   accentColor — Tailwind color class applied to the icon bg (default: primary)
 *   empty      — when true renders a muted "no data yet" state
 */
export function InsightCard({ icon: Icon, title, subtitle, accentColor = 'primary', empty = false }) {
  const bgMap = {
    primary:  'bg-gradient-to-br from-primary/15 to-primary-600/10',
    emerald:  'bg-emerald-50',
    blue:     'bg-blue-50',
    amber:    'bg-amber-50',
    purple:   'bg-purple-50',
    rose:     'bg-rose-50',
  };

  const iconColorMap = {
    primary:  'text-primary',
    emerald:  'text-emerald-600',
    blue:     'text-blue-600',
    amber:    'text-amber-600',
    purple:   'text-purple-600',
    rose:     'text-rose-600',
  };

  return (
    <Card className="flex items-start gap-4 p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 rounded-2xl">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bgMap[accentColor] || bgMap.primary}`}>
        {Icon && <Icon size={18} className={iconColorMap[accentColor] || iconColorMap.primary} />}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">{title}</p>
        {empty ? (
          <p className="text-sm text-gray-300 italic">No data yet</p>
        ) : (
          <p className="text-sm font-bold text-gray-800 leading-snug">{subtitle}</p>
        )}
      </div>
    </Card>
  );
}
