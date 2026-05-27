import React from 'react';
import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react';
import { Card, Button } from '@/components';

export function ArticleCard({ blog }) {
  return (
    <Card className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[#FFA500]/5 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="bg-[#FFA500]/8 px-5 py-3.5 flex items-center justify-between border-b border-[#FFA500]/10">
        <span className="inline-flex items-center gap-1.5 font-semibold text-[#FFA500] text-xs uppercase tracking-wider">
          <BookOpen size={14} />
          {blog.category}
        </span>
        <span className="text-xs text-gray-400 font-medium">{blog.readTime}</span>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-3">
        <h2 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-[#FFA500] transition-colors">{blog.title}</h2>
        <p className="text-sm text-gray-500 leading-relaxed flex-grow">{blog.excerpt}</p>
        <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
          <span className="inline-flex items-center gap-1.5"><User size={13} />{blog.author}</span>
          <span className="inline-flex items-center gap-1.5"><Calendar size={13} />{blog.date}</span>
        </div>
      </div>

      <div className="px-5 pb-5 pt-1">
        <Button className="w-full bg-gradient-to-r from-[#FFA500] to-[#ff8c00] hover:from-[#ff9500] hover:to-[#e67e00] text-white py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-[#FFA500]/15 hover:shadow-lg hover:shadow-[#FFA500]/25 transition-all h-auto active:scale-[0.97] inline-flex items-center justify-center gap-2">
          Read more
          <ArrowRight size={15} />
        </Button>
      </div>
    </Card>
  );
}
