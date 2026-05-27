import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import courseService from '@/lib/api/courseService';

function _extractCourses(resp) {
  if (!resp) return [];
  if (Array.isArray(resp)) return resp;
  if (Array.isArray(resp.data)) return resp.data;
  if (Array.isArray(resp.courses)) return resp.courses;
  if (resp.data && Array.isArray(resp.data.courses)) return resp.data.courses;
  const candidate = resp.courses || resp.data || resp;
  if (Array.isArray(candidate)) return candidate;
  return [];
}

export function useCourses(fetchAll = false, initialData) {
  return useQuery({
    queryKey: ['courses', fetchAll ? 'all' : 'mine'],
    queryFn: async () => {
      const resp = fetchAll ? await courseService.getAll() : await courseService.getMyCourses();
      return _extractCourses(resp);
    },
    initialData,
  });
}

export function useCourse(id, initialData) {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: async () => {
      const resp = await courseService.getById(id);
      return resp?.data || resp || null;
    },
    initialData,
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => courseService.createCourse(payload),
    onMutate: async (newCourse) => {
      await qc.cancelQueries(['courses']);
      const previous = qc.getQueryData(['courses']);
      qc.setQueryData(['courses'], (old = []) => [...old, newCourse]);
      return { previous };
    },
    onError: (err, newCourse, context) => {
      if (context?.previous) qc.setQueryData(['courses'], context.previous);
    },
    onSettled: () => qc.invalidateQueries(['courses']),
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => courseService.updateCourse(id, payload),
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries(['courses']);
      const previous = qc.getQueryData(['courses']);
      qc.setQueryData(['courses'], (old = []) => old.map(item => (item._id === id || item.id === id ? { ...item, ...payload } : item)));
      return { previous };
    },
    onError: (err, vars, context) => {
      if (context?.previous) qc.setQueryData(['courses'], context.previous);
    },
    onSettled: () => qc.invalidateQueries(['courses']),
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => courseService.deleteCourse(id),
    onMutate: async (id) => {
      await qc.cancelQueries(['courses']);
      const previous = qc.getQueryData(['courses']);
      qc.setQueryData(['courses'], (old = []) => old.filter(item => item._id !== id && item.id !== id));
      return { previous };
    },
    onError: (err, id, context) => {
      if (context?.previous) qc.setQueryData(['courses'], context.previous);
    },
    onSettled: () => qc.invalidateQueries(['courses']),
  });
}

export default null;
