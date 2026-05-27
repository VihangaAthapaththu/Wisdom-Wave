import api from "./api";

const courseService = {
  async getAll() {
    const response = await api.get("/courses");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  async getMyCourses() {
    const response = await api.get("/courses/me");
    return response.data;
  },

  async createCourse(data) {
    const response = await api.post("/courses", data);
    return response.data;
  },

  async updateCourse(id, data) {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
  },

  async deleteCourse(id) {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
};

export default courseService;
