import api from "./api";

export const blogService = {
  // ─── Public ────────────────────────────────────────────────────────────────

  async getPublicFeed({ page = 1, limit = 12, category = "", search = "" } = {}) {
    const params = new URLSearchParams({ page, limit });
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    const response = await api.get(`/blogs?${params}`);
    return response.data;
  },

  async getBlogBySlug(slug) {
    const response = await api.get(`/blogs/${slug}`);
    return response.data;
  },

  // ─── Authenticated Author ──────────────────────────────────────────────────

  async getMyBlogs() {
    const response = await api.get("/blogs/me");
    return response.data;
  },

  async getBlogForEdit(id) {
    const response = await api.get(`/blogs/${id}/edit`);
    return response.data;
  },

  async createBlog(formData) {
    const response = await api.post("/blogs", formData);
    return response.data;
  },

  async updateBlog(id, formData) {
    const response = await api.put(`/blogs/${id}`, formData);
    return response.data;
  },

  async submitBlog(id) {
    const response = await api.patch(`/blogs/${id}/submit`);
    return response.data;
  },

  async deleteBlog(id) {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },

  // ─── Admin Moderation ──────────────────────────────────────────────────────

  async getModerationQueue() {
    const response = await api.get("/blogs/admin/pending");
    return response.data;
  },

  async getAllBlogs({ page = 1, limit = 20 } = {}) {
    const response = await api.get(`/blogs/admin/all?page=${page}&limit=${limit}`);
    return response.data;
  },

  async approveBlog(id) {
    const response = await api.patch(`/blogs/${id}/approve`);
    return response.data;
  },

  async rejectBlog(id, moderationNote) {
    const response = await api.patch(`/blogs/${id}/reject`, { moderationNote });
    return response.data;
  },

  // ─── Categories ────────────────────────────────────────────────────────────

  async getCategories() {
    const response = await api.get("/blogs/categories");
    return response.data;
  },

  async createCategory(data) {
    const response = await api.post("/blogs/categories", data);
    return response.data;
  },

  async updateCategory(id, data) {
    const response = await api.put(`/blogs/categories/${id}`, data);
    return response.data;
  },

  async deleteCategory(id) {
    const response = await api.delete(`/blogs/categories/${id}`);
    return response.data;
  },

  // ─── Templates ─────────────────────────────────────────────────────────────

  async getTemplates() {
    const response = await api.get("/blogs/templates");
    return response.data;
  },

  async createTemplate(data) {
    const response = await api.post("/blogs/templates", data);
    return response.data;
  },

  async updateTemplate(id, data) {
    const response = await api.put(`/blogs/templates/${id}`, data);
    return response.data;
  },

  async deleteTemplate(id) {
    const response = await api.delete(`/blogs/templates/${id}`);
    return response.data;
  },
};
