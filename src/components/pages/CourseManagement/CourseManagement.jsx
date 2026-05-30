
import React, { useState } from 'react';
import { BookOpen, Edit,Trash2 } from 'lucide-react';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, PageHeader,ConfirmationModal,CourseModal } from '@/components';
import { useAuth } from "@/context";
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks';
import { toast } from 'sonner';

export function CourseManagement() {
  const { user } = useAuth();
  const { data: courses = [], isLoading } = useCourses(user && user.role === 'ADMIN');
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteCourse.mutateAsync(deleteTarget._id || deleteTarget.id);
      toast.success('Course deleted');
      setDeleteTarget(null);
    } catch (err) {
      const response = err?.response?.data;
      toast.error(response?.message || 'Failed to delete course');
      console.error('Failed to delete course:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-bg-paper min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader title="Course Management" buttonText="Add Course" onButtonClick={() => { setSelectedCourse(null); setShowModal(true); }} />

      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-bg-surface border-b-2 border-primary">
            <TableRow>
              <TableHead className="font-bold text-text-strong p-4">Course Title</TableHead>
              <TableHead className="font-bold text-text-strong p-4">Instructor</TableHead>
              <TableHead className="font-bold text-text-strong p-4">Students</TableHead>
              <TableHead className="font-bold text-text-strong p-4">Lesson Hours</TableHead>
              <TableHead className="font-bold text-text-strong p-4">Actions</TableHead>
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
                <TableCell colSpan={5} className="text-center text-muted py-12">
                  No courses found.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course._id || course.id} className="hover:bg-bg-surface border-b border-border">
                    <TableCell className="text-muted p-4"><BookOpen size={16} className="inline mr-2" />{course.title}</TableCell>
                    <TableCell className="text-muted p-4">{course.lecturer?.user?.name || '—'}</TableCell>
                    <TableCell className="text-muted p-4">{course.students || '—'}</TableCell>
                    <TableCell className="text-muted p-4">{course.duration ?? '—'}</TableCell>
                    <TableCell className="p-4">
                      <Button size="sm" className="mr-2" onClick={() => { setSelectedCourse(course); setShowModal(true); }}><Edit size={16}/></Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(course)}><Trash2 size={16}/></Button>
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
        onClose={() => { setShowModal(false); setSelectedCourse(null); }}
        onSave={async (payload) => {
          try {
            setIsSaving(true);
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
            if (!response?.errors) {
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

      <ConfirmationModal
        open={!!deleteTarget}
        title="Delete course?"
        description={`This will permanently delete ${deleteTarget?.title || 'the selected course'}. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Keep course"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isConfirming={isDeleting}
      />
    </div>
  );
}
