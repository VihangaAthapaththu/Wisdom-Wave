import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lecturerService } from "@/lib";

function _extractList(resp) {
  if (!resp) return [];
  if (Array.isArray(resp)) return resp;
  if (Array.isArray(resp.data)) return resp.data;
  if (Array.isArray(resp.lecturers)) return resp.lecturers;
  if (resp.data && Array.isArray(resp.data.lecturers))
    return resp.data.lecturers;
  const candidate = resp.lecturers || resp.data || resp;
  if (Array.isArray(candidate)) return candidate;
  return [];
}

export function useLecturers(initialData) {
  return useQuery({
    queryKey: ["lecturers"],
    queryFn: async () => {
      const resp = await lecturerService.getAllLecturers();
      return _extractList(resp);
    },
    initialData,
  });
}

export function useLecturer(id, initialData) {
  return useQuery({
    queryKey: ["lecturers", id],
    queryFn: async () => {
      const resp = await lecturerService.getLecturerById(id);
      return resp?.data || resp;
    },
    initialData,
    enabled: !!id,
  });
}

export function useMyLecturer(initialData) {
  return useQuery({
    queryKey: ["lecturer", "me"],
    queryFn: async () => {
      const resp = await lecturerService.getMyProfile();
      return resp?.data?.lecturer || resp?.lecturer || resp?.data || resp;
    },
    initialData,
  });
}

export function useMyLecturerKpis() {
  return useQuery({
    queryKey: ["lecturer", "me", "kpis"],
    queryFn: async () => {
      const resp = await lecturerService.getMyKpis();
      return resp?.data?.kpis || resp?.kpis || resp?.data || resp;
    },
    staleTime: 30_000,
  });
}

export function useRegisterLecturer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => lecturerService.registerLecturer(payload),
    onSettled: () => qc.invalidateQueries(["lecturers"]),
  });
}

export function useDeactivateLecturer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => lecturerService.deactivateLecturer(id),
    onSettled: () => qc.invalidateQueries(["lecturers"]),
  });
}

export default null;
