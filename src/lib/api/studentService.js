import api from "./api";

export const studentService = {
  async getAllStudents() {
    const response = await api.get("/students");
    return response.data;
  },

  async getMyProfile() {
    const response = await api.get("/students/me");
    return response.data;
  },

  async updateMyProfile(data) {
    const response = await api.put("/students/me", data);
    return response.data;
  },

  async registerStudent(data) {
    const response = await api.post("/students", data);
    return response.data;
  },
};
