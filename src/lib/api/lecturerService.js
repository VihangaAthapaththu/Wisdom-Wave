import api from "./api";

/**
 * Frontend lecturer service — wraps API calls to lecturer endpoints.
 */
export const lecturerService = {
  /**
   * Register a new lecturer (admin-only).
   * @param {Object} data - { name, email, password, specialization }
   * @returns {Promise<Object>}
   */
  async registerLecturer(data) {
    const response = await api.post("/lecturers", data);
    return response.data;
  },

  /**
   * Get all lecturers (admin-only).
   * @returns {Promise<Object>}
   */
  async getAllLecturers() {
    const response = await api.get("/lecturers");
    return response.data;
  },

  /**
   * Get a single lecturer by ID.
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getLecturerById(id) {
    const response = await api.get(`/lecturers/${id}`);
    return response.data;
  },

  /**
   * Get the logged-in lecturer's profile.
   * @returns {Promise<Object>}
   */
  async getMyProfile() {
    const response = await api.get("/lecturers/me");
    return response.data;
  },

  /**
   * Update a lecturer (admin-only).
   * @param {string} id
   * @param {Object} data - { name?, specialization? }
   * @returns {Promise<Object>}
   */
  async updateLecturer(id, data) {
    const response = await api.put(`/lecturers/${id}`, data);
    return response.data;
  },

  /**
   * Deactivate a lecturer (admin-only).
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async deactivateLecturer(id) {
    const response = await api.delete(`/lecturers/${id}`);
    return response.data;
  },

  /**
   * Get KPI summary for the logged-in lecturer.
   * @returns {Promise<Object>} { totalCourses, publishedCourses, totalStudents, totalMaterials }
   */
  async getMyKpis() {
    const response = await api.get("/lecturers/me/kpis");
    return response.data;
  },
};

