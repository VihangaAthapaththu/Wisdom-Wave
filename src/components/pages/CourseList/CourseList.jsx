import React from 'react';
import { Search, Code2, Smartphone, Network, Globe, Sparkles, BarChart3 } from 'lucide-react';
import { CourseCard } from '@/components/molecules';

export function CourseList() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedLevel, setSelectedLevel] = React.useState('all');

  const courses = [
    { id: 1, title: 'Introduction to Python', level: 'Beginner', duration: '4 weeks', students: 1200, icon: Code2, description: 'Learn Python basics and build your first projects' },
    { id: 2, title: 'React Native', level: 'Intermediate', duration: '6 weeks', students: 2500, icon: Smartphone, description: 'Build mobile apps with React and JavaScript' },
    { id: 3, title: 'Networking with Java', level: 'Advanced', duration: '8 weeks', students: 3100, icon: Network, description: 'Master networking concepts with Java programming' },
    { id: 4, title: 'Web Development Basics', level: 'Beginner', duration: '5 weeks', students: 1800, icon: Globe, description: 'Learn HTML, CSS, and JavaScript for web development' },
    { id: 5, title: 'Advanced JavaScript', level: 'Advanced', duration: '7 weeks', students: 950, icon: Sparkles, description: 'Deep dive into JavaScript ES6+ and modern patterns' },
    { id: 6, title: 'Data Science Fundamentals', level: 'Intermediate', duration: '6 weeks', students: 2100, icon: BarChart3, description: 'Introduction to data analysis and visualization' },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="bg-gray-50/50 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 flex-1 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Explore Our <span className="text-primary">Courses</span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg">Choose from hundreds of courses and start learning today</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-8 lg:mb-10">
          <div className="flex items-center gap-2.5 flex-1 lg:max-w-md bg-white px-4 py-2.5 rounded-xl border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none outline-none bg-transparent flex-1 text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {['all', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
              <button
                key={level}
                className={`px-4 py-2 border rounded-xl font-medium text-sm cursor-pointer transition-all duration-200 ${
                  selectedLevel === level
                    ? 'bg-primary text-white border-primary shadow-md shadow-[rgba(255,165,0,0.15)]'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-primary/50 hover:text-primary'
                }`}
                onClick={() => setSelectedLevel(level)}
              >
                {level === 'all' ? 'All Levels' : level}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No courses found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      <footer className="bg-gray-950 text-center py-6 text-gray-600 text-xs mt-auto">
        <p>&copy; 2026 Wisdom Wave. All rights reserved.</p>
      </footer>
    </div>
  );
}
