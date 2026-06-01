import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, ExternalLink, BookOpen, Loader2 } from 'lucide-react';
import { Card, Button } from '@/components';
import { useCourse } from '@/hooks';
import { useCourseMaterials } from '@/hooks';

export function LessonPage() {
  const { id } = useParams();
  const { data: course, isLoading: courseLoading } = useCourse(id);
  const { data: materials = [], isLoading: materialsLoading } = useCourseMaterials(id);

  const isLoading = courseLoading || materialsLoading;

  if (isLoading) {
    return (
      <div className="bg-gray-50/50 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 flex-1 w-full">
        <div className="mb-6">
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft size={15} />
            Back to Courses
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {course?.title || 'Course Lessons'}
          </h1>
          {course?.description && (
            <p className="text-sm text-gray-500">{course.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                Course Materials
              </h2>
              {materials.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm text-gray-500">No materials uploaded yet.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {materials.map((material, i) => (
                    <li key={material._id || i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText size={15} className="text-primary" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">{material.title}</span>
                      </div>
                      <a
                        href={material.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                      >
                        <ExternalLink size={13} />
                        Open
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <div>
            <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-20">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">Course Info</p>
              {course?.lecturer?.user?.name && (
                <p className="text-sm text-gray-600 mb-2">
                  Instructor: <span className="font-semibold text-gray-800">{course.lecturer.user.name}</span>
                </p>
              )}
              <p className="text-sm text-gray-600 mb-4">
                Materials: <span className="font-semibold text-gray-800">{materials.length}</span>
              </p>
              <Link to={`/courses/${id}`}>
                <Button variant="outline" className="w-full">
                  View Course Details
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
