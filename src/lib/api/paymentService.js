import api from "./api";

export const paymentService = {
  async createPayment({ courseId, method }) {
    const response = await api.post("/payments", { courseId, method });
    return response.data;
  },

  async getAllPayments() {
    const response = await api.get("/payments");
    return response.data;
  },

  async getMyPayments() {
    const response = await api.get("/payments/mine");
    return response.data;
  },

  async confirmPayment(paymentId) {
    const response = await api.put(`/payments/${paymentId}/confirm`);
    return response.data;
  },

  async failPayment(paymentId) {
    const response = await api.put(`/payments/${paymentId}/fail`);
    return response.data;
  },

  async verifySession(paymentId, sessionId) {
    const response = await api.post(`/payments/${paymentId}/verify-session`, { sessionId });
    return response.data;
  },
};
