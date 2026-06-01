import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "@/lib";

function _extractStudents(resp) {
  if (!resp) return [];
  if (Array.isArray(resp)) return resp;
  if (Array.isArray(resp.data)) return resp.data;
  if (Array.isArray(resp.students)) return resp.students;
  if (resp.data && Array.isArray(resp.data.students)) return resp.data.students;
  const candidate = resp.students || resp.data || resp;
  if (Array.isArray(candidate)) return candidate;
  return [];
}

export function useStudents(initialData) {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const resp = await studentService.getAllStudents();
      return _extractStudents(resp);
    },
    initialData,
  });
}

export function useMyStudent(initialData) {
  return useQuery({
    queryKey: ["student", "me"],
    queryFn: async () => {
      const resp = await studentService.getMyProfile();
      return resp?.data?.student || resp?.student || resp?.data || resp;
    },
    initialData,
  });
}

export function useUpdateMyStudentProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => studentService.updateMyProfile(payload),
    onSuccess: (data) => {
      qc.setQueryData(["student", "me"], data?.data?.student || data?.student || data?.data || data);
    },
    onSettled: () => {
      qc.invalidateQueries(["student", "me"]);
    },
  });
}

import api from "@/lib/api/api";

export function useDeactivateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (studentId) => api.delete(`/students/${studentId}`),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export default null;
