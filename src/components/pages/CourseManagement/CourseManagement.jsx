
import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { PageHeader } from '@/components/molecules';
import { useAuth } from "@/context";
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/courses/useCourses';
import { CourseModal } from '@/components';
import { toast } from 'sonner';

export function CourseManagement() {
  const { user } = useAuth();
  const { data: courses = [], isLoading } = useCourses(user && user.role === 'ADMIN');
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState([]);
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const handleDelete = async (course) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await deleteCourse.mutateAsync(course._id || course.id);
      toast.success('Course deleted');
    } catch (err) {
      const response = err?.response?.data;
      toast.error(response?.message || 'Failed to delete course');
      console.error('Failed to delete course:', err);
    }
  };

  return (
    <div className="bg-[#faf8f5] min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader title="Course Management" buttonText="Add Course" onButtonClick={() => { setSelectedCourse(null); setFieldErrors([]); setShowModal(true); }} />

      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-[#f5f5f5] border-b-2 border-[#FFA500]">
            <TableRow>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Course Title</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Instructor</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Students</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Lessons</TableHead>
              <TableHead className="font-bold text-[#1a1a1a] p-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  Loading...
                </TableCell>
              </TableRow>
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-[#666666] py-12">
                  No courses found.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course._id || course.id} className="hover:bg-[#f5f5f5] border-b border-[#e0e0e0]">
                  <TableCell className="text-[#666666] p-4"><BookOpen size={16} className="inline mr-2" />{course.title}</TableCell>
                  <TableCell className="text-[#666666] p-4">{course.lecturer?.user?.name || '—'}</TableCell>
                  <TableCell className="text-[#666666] p-4">{course.students || '—'}</TableCell>
                  <TableCell className="text-[#666666] p-4">{course.duration ?? '—'}</TableCell>
                  <TableCell className="p-4">
                    <Button size="sm" className="bg-[#FFA500] text-white hover:bg-[#ff8c00] mr-2" onClick={() => { setSelectedCourse(course); setFieldErrors([]); setShowModal(true); }}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(course)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CourseModal
        open={showModal}
        title={selectedCourse ? 'Edit Course' : 'Add Course'}
        initialValues={selectedCourse || {}}
        onClose={() => { setShowModal(false); setSelectedCourse(null); setFieldErrors([]); }}
        onSave={async (payload) => {
          try {
            setIsSaving(true);
            setFieldErrors([]);
            const wasUpdate = !!selectedCourse;
            if (wasUpdate) {
              await updateCourse.mutateAsync({ id: selectedCourse._id || selectedCourse.id, payload });
            } else {
              await createCourse.mutateAsync(payload);
            }
            setShowModal(false);
            setSelectedCourse(null);
            toast.success(wasUpdate ? 'Course updated' : 'Course created');
          } catch (err) {
            const response = err?.response?.data;
            if (response?.errors) setFieldErrors(response.errors);
            else {
              console.error(err);
              toast.error(response?.message || 'Failed to save course');
            }
            throw err;
          } finally {
            setIsSaving(false);
          }
        }}
        isSubmitting={isSaving}
      />
    </div>
  );
}
