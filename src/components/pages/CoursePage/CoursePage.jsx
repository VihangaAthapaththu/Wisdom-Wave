import React from 'react';
import { Clock, Users, Star, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function CoursePage() {
  return (
    <div className="bg-gray-50/50 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 flex-1 w-full">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">React Fundamentals</h1>
          <p className="text-sm text-gray-500">Master the basics of React and build amazing web applications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Course Overview</h2>
              <p className="text-sm text-gray-500 leading-relaxed">This comprehensive course teaches you everything you need to know about React, from basic concepts to advanced patterns.</p>
            </Card>

            <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Learn</h3>
              <ul className="space-y-2.5">
                {['React Components and JSX', 'State Management with Hooks', 'Component Lifecycle', 'API Integration', 'Building Real Projects'].map((item, i) => (
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
              <div className="space-y-4 mb-6">
                {[
                  { icon: Clock, label: 'Duration', value: '6 weeks' },
                  { icon: Users, label: 'Students', value: '1,234' },
                  { icon: Star, label: 'Rating', value: '4.8/5.0' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 pb-4 border-b border-gray-50 last:border-b-0 last:pb-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFA500]/15 to-[#ff8c00]/10 flex items-center justify-center shrink-0">
                      <item.icon size={18} className="text-[#FFA500]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                      <p className="text-base font-bold text-gray-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-gradient-to-r from-[#FFA500] to-[#ff8c00] hover:from-[#ff9500] hover:to-[#e67e00] text-white py-3 rounded-xl font-semibold text-sm shadow-md shadow-[#FFA500]/15 hover:shadow-lg hover:shadow-[#FFA500]/25 transition-all h-auto active:scale-[0.97]">
                Enroll Now
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
