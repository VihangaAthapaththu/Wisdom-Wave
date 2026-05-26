import React from 'react';

export function ContactInfoItem({ icon: Icon, title, content }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFA500]/15 to-[#ff8c00]/10 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-[#FFA500]" />
      </div>
      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
        <div className="text-sm text-gray-500 leading-relaxed">{content}</div>
      </div>
    </div>
  );
}
