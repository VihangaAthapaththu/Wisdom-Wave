import React from 'react';
import { ArticleCard } from '@/components/molecules';

export function BlogStudent() {
  const blogs = [
    { id: 1, title: 'Getting Started with React', author: 'John Smith', date: '2026-01-15', excerpt: 'Learn the React fundamentals and build your first interactive UI with confidence.', category: 'Tutorial', readTime: '5 min read' },
    { id: 2, title: 'JavaScript Best Practices', author: 'Jane Doe', date: '2026-01-18', excerpt: 'Master clean code patterns, performance tips, and maintainable JS architecture.', category: 'Best Practices', readTime: '6 min read' },
    { id: 3, title: 'Web Design Trends 2026', author: 'Mike Johnson', date: '2026-01-20', excerpt: 'Explore the newest layout, typography, and UX patterns shaping modern web apps.', category: 'Design', readTime: '4 min read' },
    { id: 4, title: 'UI Components that Scale', author: 'Sarah Wilson', date: '2026-01-24', excerpt: 'Design reusable components and build design systems that evolve gracefully.', category: 'UI/UX', readTime: '7 min read' },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Our <span className="text-primary">Blog</span>
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary-600 mx-auto rounded-full mb-5" />
          <p className="text-gray-500 text-base">Beautiful reads curated for your learning journey</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <ArticleCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </div>
  );
}
