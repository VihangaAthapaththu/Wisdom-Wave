import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Edit, Trash2, Eye, Users, Clock, Wallet } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  PageHeader,
  ConfirmationModal,
  CourseModal,
  PageLoader,
} from "@/components";
import { useAuth } from "@/context";
import {
  useCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from "@/hooks";
import { toast } from "sonner";
import { toastApiError } from "@/lib/api/errorUtils";
import { formatLKR } from "@/lib/currency";

function StatusBadge({ published }) {
  return published ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
      Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
      Draft
    </span>
  );
}

export function CourseManagement() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const navigate = useNavigate();
  const { data: courses = [], isLoading } = useCourses(isAdmin);
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
      toast.success("Course deleted");
      setDeleteTarget(null);
    } catch (err) {
      toastApiError(err, "Failed to delete course");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-bg-paper min-h-screen p-4 md:p-6 lg:p-10 flex flex-col">
      <PageHeader
        title="Course Management"
        buttonText={isAdmin ? "Add Course" : undefined}
        onButtonClick={
          isAdmin
            ? () => {
                setSelectedCourse(null);
                setShowModal(true);
              }
            : undefined
        }
      />

      {isLoading ? (
        <PageLoader text="Loading courses..." size={280} fullScreen={true} />
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-gray-50 border-b-2 border-primary/20">
                  <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-5 py-3.5 whitespace-nowrap">
                    Course
                  </TableHead>
                  <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-5 py-3.5 whitespace-nowrap">
                    Instructor
                  </TableHead>
                  <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-5 py-3.5 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <Users size={13} /> Students
                    </span>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-5 py-3.5 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} /> Duration
                    </span>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-5 py-3.5 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <Wallet size={13} /> Fee
                    </span>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-5 py-3.5 whitespace-nowrap">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-5 py-3.5 whitespace-nowrap">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <BookOpen size={36} className="opacity-30" />
                        <p className="text-sm font-medium">No courses found</p>
                        <p className="text-xs">Add a course to get started</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  courses.map((course) => (
                    <TableRow
                      key={course._id || course.id}
                      className="hover:bg-gray-50/70 border-b border-gray-100 transition-colors duration-150 last:border-0"
                    >
                      {/* Course title */}
                      <TableCell className="px-5 py-4 max-w-[240px]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/15 to-primary-600/10 flex items-center justify-center shrink-0">
                            <BookOpen size={14} className="text-primary" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                            {course.title}
                          </span>
                        </div>
                      </TableCell>

                      {/* Instructor */}
                      <TableCell className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {course.lecturer?.user?.name || (
                          <span className="text-gray-400 italic">Unassigned</span>
                        )}
                      </TableCell>

                      {/* Students — uses enrollmentCount from repository */}
                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700">
                          <Users size={13} className="text-gray-400" />
                          {course.enrollmentCount ?? 0}
                        </span>
                      </TableCell>

                      {/* Duration */}
                      <TableCell className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {course.duration != null ? (
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} className="text-gray-400" />
                            {course.duration}h
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>

                      {/* Fee */}
                      <TableCell className="px-5 py-4 text-sm text-gray-700 whitespace-nowrap font-medium">
                        {course.fee != null && course.fee > 0 ? (
                          <span className="text-gray-800">
                            {formatLKR(course.fee)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                            Free
                          </span>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge published={course.isPublished} />
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            title="View"
                            onClick={() => navigate(`/courses/${course._id || course.id}`)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors duration-150 cursor-pointer"
                          >
                            <Eye size={15} />
                          </button>
                          {isAdmin && (
                            <>
                              <button
                                title="Edit"
                                onClick={() => {
                                  setSelectedCourse(course);
                                  setShowModal(true);
                                }}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                              >
                                <Edit size={15} />
                              </button>
                              <button
                                title="Delete"
                                onClick={() => setDeleteTarget(course)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                              >
                                <Trash2 size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {courses.length > 0 && (
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
              {courses.length} course{courses.length !== 1 ? "s" : ""} total
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <>
          <CourseModal
            open={showModal}
            title={selectedCourse ? "Edit Course" : "Add Course"}
            initialValues={selectedCourse || {}}
            onClose={() => {
              setShowModal(false);
              setSelectedCourse(null);
            }}
            onSave={async (payload) => {
              try {
                setIsSaving(true);
                const wasUpdate = !!selectedCourse;
                if (wasUpdate) {
                  await updateCourse.mutateAsync({
                    id: selectedCourse._id || selectedCourse.id,
                    payload,
                  });
                } else {
                  await createCourse.mutateAsync(payload);
                }
                setShowModal(false);
                setSelectedCourse(null);
                toast.success(wasUpdate ? "Course updated" : "Course created");
              } catch (err) {
                toastApiError(err, "Failed to save course");
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
            description={`This will permanently delete "${deleteTarget?.title || "the selected course"}". This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Keep course"
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
            isConfirming={isDeleting}
          />
        </>
      )}
    </div>
  );
}
