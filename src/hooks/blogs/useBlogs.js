import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "@/lib";

// ─── Helper extractors ────────────────────────────────────────────────────────

function _extractBlogs(resp) {
  if (!resp) return [];
  if (Array.isArray(resp)) return resp;
  if (resp.data?.blogs && Array.isArray(resp.data.blogs)) return resp.data.blogs;
  if (resp.data && Array.isArray(resp.data)) return resp.data;
  return [];
}

function _extractList(resp, key) {
  if (!resp) return [];
  if (resp.data?.[key] && Array.isArray(resp.data[key])) return resp.data[key];
  if (Array.isArray(resp.data)) return resp.data;
  return [];
}

// ─── Public Feed ──────────────────────────────────────────────────────────────

export function usePublicBlogFeed({ page = 1, category = "", search = "" } = {}) {
  return useQuery({
    queryKey: ["blogs", "public", { page, category, search }],
    queryFn: () => blogService.getPublicFeed({ page, limit: 12, category, search }),
    keepPreviousData: true,
  });
}

export function useBlogBySlug(slug) {
  return useQuery({
    queryKey: ["blogs", "slug", slug],
    queryFn: () => blogService.getBlogBySlug(slug),
    enabled: !!slug,
  });
}

// ─── Author Queries ───────────────────────────────────────────────────────────

export function useMyBlogs() {
  return useQuery({
    queryKey: ["blogs", "mine"],
    queryFn: async () => {
      const resp = await blogService.getMyBlogs();
      return _extractBlogs(resp);
    },
  });
}

export function useBlogForEdit(id) {
  return useQuery({
    queryKey: ["blogs", "edit", id],
    queryFn: async () => {
      const resp = await blogService.getBlogForEdit(id);
      return resp?.data?.blog || resp?.blog || resp?.data || resp || null;
    },
    enabled: !!id,
  });
}

// ─── Admin Queries ────────────────────────────────────────────────────────────

export function useModerationQueue() {
  return useQuery({
    queryKey: ["blogs", "pending"],
    queryFn: async () => {
      const resp = await blogService.getModerationQueue();
      return _extractBlogs(resp);
    },
  });
}

export function useAllBlogsAdmin({ page = 1 } = {}) {
  return useQuery({
    queryKey: ["blogs", "admin-all", { page }],
    queryFn: async () => {
      const resp = await blogService.getAllBlogs({ page });
      return _extractBlogs(resp);
    },
  });
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const resp = await blogService.getCategories();
      return _extractList(resp, "categories");
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Templates ────────────────────────────────────────────────────────────────

export function useTemplates() {
  return useQuery({
    queryKey: ["blog-templates"],
    queryFn: async () => {
      const resp = await blogService.getTemplates();
      return _extractList(resp, "templates");
    },
  });
}

// ─── Blog Mutations ───────────────────────────────────────────────────────────

export function useCreateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData) => blogService.createBlog(formData),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blogs", "mine"] }),
  });
}

export function useUpdateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }) => blogService.updateBlog(id, formData),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["blogs", "mine"] });
      qc.invalidateQueries({ queryKey: ["blogs", "edit", id] });
    },
  });
}

export function useSubmitBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => blogService.submitBlog(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blogs", "mine"] }),
  });
}

export function useDeleteBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => blogService.deleteBlog(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
}

// ─── Admin Mutations ──────────────────────────────────────────────────────────

export function useApproveBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => blogService.approveBlog(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blogs", "pending"] });
      qc.invalidateQueries({ queryKey: ["blogs", "public"] });
      qc.invalidateQueries({ queryKey: ["blogs", "admin-all"] });
    },
  });
}

export function useRejectBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, moderationNote }) => blogService.rejectBlog(id, moderationNote),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blogs", "pending"] });
    },
  });
}

// ─── Category Mutations ───────────────────────────────────────────────────────

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => blogService.createCategory(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => blogService.updateCategory(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => blogService.deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-categories"] }),
  });
}

// ─── Template Mutations ───────────────────────────────────────────────────────

export function useCreateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => blogService.createTemplate(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-templates"] }),
  });
}

export function useUpdateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => blogService.updateTemplate(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-templates"] }),
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => blogService.deleteTemplate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-templates"] }),
  });
}
