import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assignmentService } from "@/lib/api";

export function useCourseAssignments(courseId) {
  return useQuery({
    queryKey: ["assignments", "course", courseId],
    queryFn: async () => {
      const res = await assignmentService.getAssignmentsForCourse(courseId);
      return res.data?.assignments ?? [];
    },
    enabled: !!courseId,
  });
}

export function useMyAssignments(initialData) {
  return useQuery({
    queryKey: ["assignments", "me"],
    queryFn: async () => {
      const res = await assignmentService.getMyAssignments();
      return res.data?.assignments ?? [];
    },
    initialData,
  });
}

export function useAssignmentSubmissions(assignmentId) {
  return useQuery({
    queryKey: ["submissions", assignmentId],
    queryFn: async () => {
      const res = await assignmentService.getSubmissions(assignmentId);
      return res.data?.submissions ?? [];
    },
    enabled: !!assignmentId,
  });
}

export function useCreateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, data }) => assignmentService.createAssignment(courseId, data),
    onSettled: (_, __, { courseId }) => {
      qc.invalidateQueries({ queryKey: ["assignments", "course", courseId] });
    },
  });
}

export function useUpdateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => assignmentService.updateAssignment(id, data),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
}

export function useDeleteAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => assignmentService.deleteAssignment(id),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
}

export function useSubmitAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => assignmentService.submitAssignment(id, data),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["assignments", "me"] });
    },
  });
}

export function useGradeSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ assignmentId, studentId, data }) =>
      assignmentService.gradeSubmission(assignmentId, studentId, data),
    onSettled: (_, __, { assignmentId }) => {
      qc.invalidateQueries({ queryKey: ["submissions", assignmentId] });
    },
  });
}
