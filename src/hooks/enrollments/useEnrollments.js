import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollmentService } from "@/lib/api";

export function useMyEnrollments(initialData) {
  return useQuery({
    queryKey: ["enrollments", "me"],
    queryFn: async () => {
      const res = await enrollmentService.getMyEnrollments();
      return res.data?.courses ?? [];
    },
    initialData,
  });
}

export function useCourseEnrollments(courseId) {
  return useQuery({
    queryKey: ["enrollments", "course", courseId],
    queryFn: async () => {
      const res = await enrollmentService.getCourseEnrollments(courseId);
      return res.data?.students ?? [];
    },
    enabled: !!courseId,
  });
}

export function useEnrollInCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (courseId) => enrollmentService.enrollInCourse(courseId),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["enrollments", "me"] });
      qc.invalidateQueries({ queryKey: ["student", "me"] });
      // Refresh course lists so enrolled counts / state update in UI
      qc.invalidateQueries(["courses"]);
    },
  });
}

export function useUnenrollFromCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (courseId) => enrollmentService.unenrollFromCourse(courseId),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["enrollments", "me"] });
      qc.invalidateQueries({ queryKey: ["student", "me"] });
      qc.invalidateQueries(["courses"]);
    },
  });
}

export function useAdminEnrollStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, studentId }) => enrollmentService.adminEnrollStudent(courseId, studentId),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries(["courses"]);
    },
  });
}
