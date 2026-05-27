import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Card, Button, Progress } from '@/components';

export function LessonPage() {
  return (
    <div className="bg-gray-50/50 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 flex-1 w-full">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Lesson 1: Introduction to React</h1>
          <p className="text-sm text-gray-500">Learn the fundamentals of React</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Lesson Content</h2>
              <p className="text-sm text-gray-500 leading-relaxed">React is a JavaScript library for building user interfaces with reusable components. This lesson covers the basics.</p>
            </Card>

            <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Concepts</h2>
              <ul className="space-y-2.5">
                {['Components', 'Props', 'State', 'JSX'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-[#FFA500] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div>
            <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-20">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2.5 font-medium">Lesson Progress</p>
              <Progress value={65} className="h-2 bg-gray-100 [&>div]:bg-gradient-to-r [&>div]:from-[#FFA500] [&>div]:to-[#ff8c00] [&>div]:rounded-full mb-2" />
              <p className="text-right text-sm font-bold text-[#FFA500] mb-5">65%</p>

              <Button className="w-full bg-gradient-to-r from-[#FFA500] to-[#ff8c00] hover:from-[#ff9500] hover:to-[#e67e00] text-white py-3 rounded-xl font-semibold text-sm shadow-md shadow-[#FFA500]/15 hover:shadow-lg hover:shadow-[#FFA500]/25 transition-all h-auto active:scale-[0.97] flex items-center justify-center gap-2">
                Continue
                <ArrowRight size={16} />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
