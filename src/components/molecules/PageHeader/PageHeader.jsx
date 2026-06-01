import React from 'react';
import { Button } from '@/components';
import { Plus } from 'lucide-react';

export function PageHeader({ title, buttonText, onButtonClick, icon: Icon = Plus }) {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center mb-10 gap-5">
      <h1 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-text-strong m-0 bg-gradient-to-br from-primary to-primary-600 bg-clip-text text-transparent">
        {title}
      </h1>
      {buttonText && (
        <Button 
          onClick={onButtonClick} 
          className="bg-gradient-to-br from-primary to-primary-600 text-white border-none shadow-[0_4px_12px_rgba(255,165,0,0.3)] hover:-translate-y-[2px] hover:shadow-[0_6px_16px_rgba(255,165,0,0.4)]"
        >
          <Icon size={20} className="mr-2" /> {buttonText}
        </Button>
      )}
    </div>
  );
}
