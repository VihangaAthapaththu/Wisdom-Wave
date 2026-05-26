import React from 'react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function MenuCard({ icon: Icon, title, description, href }) {
  return (
    <Link to={href} className="block outline-none group">
      <Card className="flex items-start gap-4 p-5 bg-white border border-gray-100 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFA500]/5 hover:-translate-y-1 hover:border-[#FFA500]/30 cursor-pointer">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFA500]/15 to-[#ff8c00]/10 flex items-center justify-center shrink-0 group-hover:from-[#FFA500]/25 group-hover:to-[#ff8c00]/15 transition-colors duration-300">
          <Icon className="w-5 h-5 text-[#FFA500]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-0.5 group-hover:text-[#FFA500] transition-colors">{title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed m-0">{description}</p>
        </div>
        <ChevronRight size={16} className="text-gray-300 group-hover:text-[#FFA500] shrink-0 mt-0.5 transition-colors" />
      </Card>
    </Link>
  );
}
