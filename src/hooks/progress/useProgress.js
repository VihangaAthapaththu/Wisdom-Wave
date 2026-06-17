import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { progressService } from "@/lib";
import { useAuth } from "@/context";

export function useProgressOverview() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["progress", "overview"],
    queryFn: async () => {
      const resp = await progressService.getProgressOverview();
      return resp?.data?.progress || resp?.data || resp;
    },
    enabled: user?.role === "STUDENT",
    staleTime: 30_000,
  });
}

export function useCourseProgress(courseId) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["progress", "course", courseId],
    queryFn: async () => {
      const resp = await progressService.getCourseProgress(courseId);
      return resp?.data?.progress || resp?.data || resp;
    },
    enabled: !!courseId && user?.role === "STUDENT",
    staleTime: 30_000,
  });
}

export function useMarkMaterialComplete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, materialId }) =>
      progressService.markMaterialComplete(courseId, materialId),
    onSettled: (_data, _err, { courseId }) => {
      qc.invalidateQueries({ queryKey: ["progress", "overview"] });
      qc.invalidateQueries({ queryKey: ["progress", "course", courseId] });
    },
  });
}

export function useUnmarkMaterialComplete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, materialId }) =>
      progressService.unmarkMaterialComplete(courseId, materialId),
    onSettled: (_data, _err, { courseId }) => {
      qc.invalidateQueries({ queryKey: ["progress", "overview"] });
      qc.invalidateQueries({ queryKey: ["progress", "course", courseId] });
    },
  });
}

export default null;
