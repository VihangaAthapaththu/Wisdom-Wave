import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { materialService } from "@/lib/api";

export function useCourseMaterials(courseId) {
  return useQuery({
    queryKey: ["materials", courseId],
    queryFn: async () => {
      const res = await materialService.getMaterials(courseId);
      return res.data?.materials ?? [];
    },
    enabled: !!courseId,
  });
}

export function useAddMaterial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, data }) => materialService.addMaterial(courseId, data),
    onSettled: (_, __, { courseId }) => {
      qc.invalidateQueries({ queryKey: ["materials", courseId] });
    },
  });
}

export function useDeleteMaterial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, materialId }) => materialService.deleteMaterial(courseId, materialId),
    onSettled: (_, __, { courseId }) => {
      qc.invalidateQueries({ queryKey: ["materials", courseId] });
    },
  });
}
