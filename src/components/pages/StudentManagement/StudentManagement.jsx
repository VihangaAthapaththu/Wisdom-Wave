import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components';
import { PageHeader, PageLoader } from '@/components';
import { ConfirmationModal } from '@/components';
import { useStudents, useDeactivateStudent } from '@/hooks';
import { toast } from 'sonner';

export function StudentManagement() {
  const { data: students = [], isLoading } = useStudents();
  const deactivate = useDeactivateStudent();
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    try {
      setIsDeactivating(true);
      await deactivate.mutateAsync(deactivateTarget._id);
      toast.success('Student deactivated successfully.');
      setDeactivateTarget(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to deactivate student.');
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <div className="bg-bg-paper min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader title="Student Management" />

      {isLoading ? (
        <PageLoader text="Loading students..." size={280} fullScreen={true} />
      ) : (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="bg-bg-surface border-b-2 border-primary">
              <TableRow>
                <TableHead className="font-bold text-text-strong p-4">Name</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Email</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Enrollments</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Status</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Joined</TableHead>
                <TableHead className="font-bold text-text-strong p-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted py-12">
                    <Users className="w-12 h-12 mx-auto mb-3 text-border" />
                    <p className="text-base font-medium">No students registered yet</p>
                    <p className="text-sm mt-1">Students can register via the sign-up page.</p>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student._id} className="hover:bg-bg-surface border-b border-border">
                    <TableCell className="text-text-strong p-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {student.user?.name?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                        {student.user?.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted p-4">{student.user?.email}</TableCell>
                    <TableCell className="text-muted p-4">{student.enrolledCourses?.length ?? 0}</TableCell>
                    <TableCell className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        student.user?.isActive
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${student.user?.isActive ? 'bg-emerald-500' : 'bg-red-400'}`} />
                        {student.user?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted p-4 text-sm">
                      {student.user?.createdAt ? new Date(student.user.createdAt).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell className="p-4">
                      {student.user?.isActive && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeactivateTarget(student)}
                          className="text-xs"
                        >
                          Deactivate
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmationModal
        open={!!deactivateTarget}
        title="Deactivate student?"
        description={`This will deactivate ${deactivateTarget?.user?.name || 'this student'}'s account. They will no longer be able to sign in.`}
        confirmText="Deactivate"
        cancelText="Cancel"
        onCancel={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivate}
        isConfirming={isDeactivating}
      />
    </div>
  );
}
