import api from "./api";

export const materialService = {
  async getMaterials(courseId) {
    const response = await api.get(`/courses/${courseId}/materials`);
    return response.data;
  },

  async addMaterial(courseId, data) {
    const response = await api.post(`/courses/${courseId}/materials`, data);
    return response.data;
  },

  async deleteMaterial(courseId, materialId) {
    const response = await api.delete(`/courses/${courseId}/materials/${materialId}`);
    return response.data;
  },
};
