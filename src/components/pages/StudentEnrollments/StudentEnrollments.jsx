import { useState } from 'react';
import { BookOpen, CheckCircle, Loader2, UserPlus, X, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
} from '@/components';
import { PageHeader } from '@/components/molecules';
import { useStudents } from '@/hooks';
import { useAdminEnrollStudent } from '@/hooks';
import { useCourses } from '@/hooks';
import { formatLKR } from '@/lib/currency';
import { getApiError } from '@/lib/api/errorUtils';
import { validateForm } from '@/lib/validation/validateForm';
import { adminEnrollSchema } from '@/lib/validation/schemas';
import { toast } from 'sonner';

export function StudentEnrollments() {
  const { data: students = [], isLoading } = useStudents();
  const { data: courses = [], isLoading: coursesLoading } = useCourses(true);
  const adminEnroll = useAdminEnrollStudent();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ studentId: '', courseId: '' });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Flatten: one row per (student, enrolledCourse) pair
  const rows = students.flatMap((student) =>
    (student.enrolledCourses ?? []).map((course) => ({
      studentId: student._id,
      studentName: student.user?.name || '—',
      courseId: course._id || course,
      courseTitle: course.title || '—',
      enrolledAt: student.updatedAt || student.createdAt,
    }))
  );

  const openModal = () => {
    setForm({ studentId: '', courseId: '' });
    setFormError('');
    setShowModal(true);
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    const { success } = validateForm(adminEnrollSchema, { studentId: form.studentId, courseId: form.courseId });
    if (!success) {
      setFormError('Please select both a student and a course.');
      return;
    }
    setFormError('');
    try {
      setIsSubmitting(true);
      await adminEnroll.mutateAsync({ courseId: form.courseId, studentId: form.studentId });
      toast.success('Student enrolled successfully.');
      setShowModal(false);
    } catch (err) {
      const { status, message } = getApiError(err, 'Failed to enroll student.');
      setFormError(status ? `${message} (Error ${status})` : message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bg-paper min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader title="Student Enrollments" />

      <div className="flex justify-end mb-4">
        <Button
          onClick={openModal}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
        >
          <UserPlus size={15} /> Manually Enroll Student
        </Button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="bg-bg-surface border-b-2 border-primary">
              <TableRow>
                <TableHead className="font-bold text-text-strong p-4">Student</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Course</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted py-12">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-border" />
                    <p className="font-medium">No enrollments yet.</p>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, idx) => (
                  <TableRow key={`${row.studentId}-${row.courseId}-${idx}`} className="hover:bg-bg-surface border-b border-border">
                    <TableCell className="text-muted p-4">{row.studentName}</TableCell>
                    <TableCell className="text-muted p-4">
                      <BookOpen size={16} className="inline mr-2" />
                      {row.courseTitle}
                    </TableCell>
                    <TableCell className="text-muted p-4">
                      <CheckCircle size={16} className="inline text-success mr-2" />
                      Active
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Manually Enroll Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">Manually Enroll Student</h2>
                <p className="text-xs text-gray-400 mt-0.5">Enroll a student in a course without payment.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
              >
                <X size={17} />
              </button>
            </div>
            <form onSubmit={handleEnroll} className="p-6 flex flex-col gap-4">
              {formError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 px-3 py-2.5 rounded-lg text-sm">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" /> {formError}
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Student *</label>
                <select
                  value={form.studentId}
                  onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors bg-white"
                >
                  <option value="">— Select student —</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.user?.name || s._id} {s.user?.email ? `(${s.user.email})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Course *</label>
                <select
                  value={form.courseId}
                  onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors bg-white"
                  disabled={coursesLoading}
                >
                  <option value="">— Select course —</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title} {c.fee > 0 ? `(${formatLKR(c.fee)})` : '(Free)'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-primary to-primary-600 text-white px-5"
                >
                  {isSubmitting ? (
                    <><Loader2 size={14} className="animate-spin" /> Enrolling...</>
                  ) : (
                    'Enroll Student'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
