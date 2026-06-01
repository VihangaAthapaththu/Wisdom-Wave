import api from "./api";

export const assignmentService = {
  // Course-scoped
  async getAssignmentsForCourse(courseId) {
    const response = await api.get(`/courses/${courseId}/assignments`);
    return response.data;
  },

  async createAssignment(courseId, data) {
    const response = await api.post(`/courses/${courseId}/assignments`, data);
    return response.data;
  },

  // Assignment-scoped
  async getAssignmentById(id) {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  },

  async updateAssignment(id, data) {
    const response = await api.put(`/assignments/${id}`, data);
    return response.data;
  },

  async deleteAssignment(id) {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  },

  async submitAssignment(id, data) {
    const response = await api.post(`/assignments/${id}/submit`, data);
    return response.data;
  },

  async getSubmissions(assignmentId) {
    const response = await api.get(`/assignments/${assignmentId}/submissions`);
    return response.data;
  },

  async gradeSubmission(assignmentId, studentId, data) {
    const response = await api.put(`/assignments/${assignmentId}/submissions/${studentId}`, data);
    return response.data;
  },

  // Student-scoped
  async getMyAssignments() {
    const response = await api.get("/students/me/assignments");
    return response.data;
  },
};
