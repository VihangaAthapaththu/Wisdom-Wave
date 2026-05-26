import React from 'react';
import { Card } from '@/components/ui/card';

export function StatCard({ icon: Icon, label, value }) {
  return (
    <Card className="flex items-center gap-4 p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:shadow-[#FFA500]/5 hover:-translate-y-0.5 transition-all duration-300 rounded-2xl">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFA500]/15 to-[#ff8c00]/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#FFA500]" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
      </div>
    </Card>
  );
}
