import api from "./api";

export const progressService = {
  async getProgressOverview() {
    const response = await api.get("/progress/overview");
    return response.data;
  },

  async getCourseProgress(courseId) {
    const response = await api.get(`/progress/courses/${courseId}`);
    return response.data;
  },

  async markMaterialComplete(courseId, materialId) {
    const response = await api.post(`/progress/courses/${courseId}/materials/${materialId}`);
    return response.data;
  },

  async unmarkMaterialComplete(courseId, materialId) {
    const response = await api.delete(`/progress/courses/${courseId}/materials/${materialId}`);
    return response.data;
  },
};
