import React from 'react';
import { Search, Code2, Smartphone, Network, Globe, Sparkles, BarChart3 } from 'lucide-react';
import { CourseCard } from '@/components/molecules';
import { useCourses } from '@/hooks';
import { useAuth } from '@/context';

const ICONS = [Code2, Smartphone, Network, Globe, Sparkles, BarChart3];

function formatDuration(duration) {
  if (duration == null || duration === '') return 'TBD';
  const value = Number(duration);
  if (Number.isNaN(value)) return String(duration);
  return value === 1 ? '1 hour' : `${value} hours`;
}

function getCourseLevel(course, index) {
  if (course?.level) return course.level;
  const duration = Number(course?.duration);
  if (!Number.isNaN(duration)) {
    if (duration <= 4) return 'Beginner';
    if (duration <= 8) return 'Intermediate';
    return 'Advanced';
  }
  return ['Beginner', 'Intermediate', 'Advanced'][index % 3];
}

export function CourseList() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedLevel, setSelectedLevel] = React.useState('all');
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const { data: courses = [], isLoading, isError } = useCourses(
    isAdmin,
    undefined,
    { published: true },
  );

  const mappedCourses = courses.map((course, index) => ({
    id: course._id || course.id || index,
    title: course.title || 'Untitled course',
    level: getCourseLevel(course, index),
    duration: formatDuration(course.duration),
    students: course.enrolledCount || course.students || 'Open',
    icon: ICONS[index % ICONS.length],
    description: course.description || 'Course details will be added soon.',
    fee: course.fee,
    isPublished: course.isPublished,
  }));

  const filteredCourses = mappedCourses.filter(course => {
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
        {isLoading ? (
          <div className="rounded-2xl border border-border bg-white px-6 py-10 text-center text-sm text-muted shadow-sm">
            Loading courses...
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-danger/20 bg-danger/5 px-6 py-10 text-center text-sm text-danger">
            We could not load the course catalog right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {!isLoading && !isError && filteredCourses.length === 0 && (
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
