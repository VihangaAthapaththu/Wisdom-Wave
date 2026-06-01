import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Users, DollarSign, BookOpen, CheckCircle, Loader2 } from 'lucide-react';
import { Card, Button } from '@/components';
import { useCourse } from '@/hooks';
import { useAuth } from '@/context';
import { useMyStudent } from '@/hooks';
import { useEnrollInCourse } from '@/hooks';
import { useCreatePayment } from '@/hooks';
import { toast } from 'sonner';

export function CoursePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: course, isLoading } = useCourse(id);
  const { data: student } = useMyStudent();
  const enrollInCourse = useEnrollInCourse();
  const createPayment = useCreatePayment();
  const [enrolling, setEnrolling] = useState(false);

  const isStudent = user?.role === 'STUDENT';
  const isAlreadyEnrolled = student?.enrolledCourses?.some(
    (c) => (c._id || c) === id
  );
  const isFree = !course?.fee || course.fee === 0;

  const handleEnroll = async () => {
    if (!user) {
      window.location.href = '/signin';
      return;
    }
    try {
      setEnrolling(true);
      if (isFree) {
        await enrollInCourse.mutateAsync(id);
        toast.success('Enrolled successfully!');
      } else {
        await createPayment.mutateAsync({ courseId: id, method: 'CARD' });
        toast.success('Payment initiated. An admin will confirm your enrollment.');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Enrollment failed.');
    } finally {
      setEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50/50 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-gray-50/50 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 flex-1 w-full">
        <div className="mb-8">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3 ${
            course.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {course.isPublished ? 'Published' : 'Draft'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-sm text-gray-500">{course.description || 'No description provided.'}</p>
          {course.lecturer?.user?.name && (
            <p className="text-sm text-gray-600 mt-2">
              Instructor: <span className="font-medium">{course.lecturer.user.name}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Course Overview</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                {course.description || 'No overview available.'}
              </p>
            </Card>

            {course.objectives?.length > 0 && (
              <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Learn</h3>
                <ul className="space-y-2.5">
                  {course.objectives.map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          <div>
            <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-20">
              <div className="space-y-4 mb-6">
                {[
                  { icon: DollarSign, label: 'Price', value: isFree ? 'Free' : `$${course.fee}` },
                  { icon: BookOpen, label: 'Category', value: course.category || '—' },
                  { icon: Users, label: 'Enrolled', value: (course.enrolledStudents?.length ?? 0).toLocaleString() },
                  { icon: Clock, label: 'Duration', value: course.duration || '—' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 pb-4 border-b border-gray-50 last:border-b-0 last:pb-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary-600/10 flex items-center justify-center shrink-0">
                      <item.icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                      <p className="text-base font-bold text-gray-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {isAlreadyEnrolled ? (
                <div className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-sm border border-emerald-200">
                  <CheckCircle size={16} />
                  Enrolled
                </div>
              ) : isStudent || !user ? (
                <Button
                  onClick={handleEnroll}
                  disabled={enrolling || !course.isPublished}
                  className="w-full bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary text-white py-3 rounded-xl font-semibold text-sm shadow-md shadow-[rgba(255,165,0,0.15)] hover:shadow-lg hover:shadow-[rgba(255,165,0,0.25)] transition-all h-auto active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {enrolling ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      {isFree ? 'Enrolling...' : 'Initiating payment...'}
                    </span>
                  ) : (
                    isFree ? 'Enroll Now — Free' : `Enroll — $${course.fee}`
                  )}
                </Button>
              ) : null}

              {!course.isPublished && (
                <p className="text-xs text-center text-gray-400 mt-2">This course is not yet published.</p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
