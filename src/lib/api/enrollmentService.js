import api from "./api";

export const enrollmentService = {
  async enrollInCourse(courseId) {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  async unenrollFromCourse(courseId) {
    const response = await api.delete(`/courses/${courseId}/unenroll`);
    return response.data;
  },

  async getMyEnrollments() {
    const response = await api.get("/students/me/enrollments");
    return response.data;
  },

  async getCourseEnrollments(courseId) {
    const response = await api.get(`/courses/${courseId}/enrollments`);
    return response.data;
  },

  async adminEnrollStudent(courseId, studentId) {
    const response = await api.post(`/courses/${courseId}/admin-enroll`, { studentId });
    return response.data;
  },
};
