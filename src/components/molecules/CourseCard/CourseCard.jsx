import React, { useState } from 'react';
import { Clock, Users, Loader2, CheckCircle } from 'lucide-react';
import { Card, Button } from '@/components';
import { useAuth } from '@/context';
import { useMyStudent } from '@/hooks';
import { useEnrollInCourse, useCreatePayment } from '@/hooks';
import { formatLKR } from '@/lib/currency';
import { toastApiError } from '@/lib/api/errorUtils';
import { toast } from 'sonner';

export function CourseCard({ course }) {
  const IconComp = course.icon;
  const badgeLabel = course.level || course.badge || (course.isPublished ? 'Published' : 'Draft');
  const durationLabel = course.duration ?? course.durationLabel ?? 'TBD';
  const studentsLabel = course.students ?? course.enrolledCount ?? course.enrollmentText ?? 'Open';
  const [enrolling, setEnrolling] = useState(false);
  const { user } = useAuth();
  const { data: student } = useMyStudent();
  const enrollInCourse = useEnrollInCourse();
  const createPayment = useCreatePayment();

  const courseId = course.id || course._id;
  const isStudent = user?.role === 'STUDENT';
  const isAlreadyEnrolled = student?.enrolledCourses?.some((c) => (c._id || c) === courseId);
  const isFree = !course?.fee || course.fee === 0;

  return (
    <div className="block h-full">
      <Card className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[rgba(255,165,0,0.05)] transition-all duration-300 flex flex-col relative overflow-hidden h-full hover:-translate-y-1.5">
        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          {badgeLabel}
        </div>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary-600/10 flex items-center justify-center mb-5 group-hover:from-primary/25 group-hover:to-primary-600/15 transition-colors duration-300">
          {React.isValidElement(IconComp) ? (
            IconComp
          ) : IconComp ? (
            // Support function components and forwardRef objects (lucide icons)
            // Render as a component type when possible
            typeof IconComp === 'function' || typeof IconComp === 'object' ? (
              <IconComp size={26} className="text-primary" />
            ) : null
          ) : null}
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed flex-grow">{course.description}</p>

        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-primary" />
            <span>{durationLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-primary" />
            <span>{typeof studentsLabel === 'number' ? studentsLabel.toLocaleString() : studentsLabel}</span>
          </div>
        </div>

        {isAlreadyEnrolled ? (
          <div className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-sm border border-emerald-200">
            <CheckCircle size={16} />
            Enrolled
          </div>
        ) : (isStudent || !user) ? (
          <Button
            onClick={async () => {
              if (!user) {
                window.location.href = '/signin';
                return;
              }
              try {
                setEnrolling(true);
                if (isFree) {
                  await enrollInCourse.mutateAsync(courseId);
                  toast.success('Enrolled successfully!');
                } else {
                  const result = await createPayment.mutateAsync({ courseId, method: 'CARD' });
                  const sessionUrl = result?.data?.sessionUrl;
                  if (sessionUrl) {
                    // Redirect user to Stripe Checkout
                    window.location.href = sessionUrl;
                    return;
                  }
                  toast.success(result?.message || 'Payment initiated. An admin will confirm your enrollment.');
                }
              } catch (err) {
                toastApiError(err, 'Enrollment failed.');
              } finally {
                setEnrolling(false);
              }
            }}
            disabled={enrolling || !course.isPublished}
            className="w-full bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary text-white py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-[rgba(255,165,0,0.15)] hover:shadow-lg hover:shadow-[rgba(255,165,0,0.25)] transition-all duration-300 h-auto active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {enrolling ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                {isFree ? 'Enrolling...' : 'Initiating payment...'}
              </span>
            ) : isFree ? (
              'Enroll Now — Free'
            ) : (
              `Enroll — ${formatLKR(course.fee)}`
            )}
          </Button>
        ) : null}
      </Card>
    </div>
  );
}
