import api from "./api";

export const notificationService = {
  async getNotifications({ page = 1, limit = 20 } = {}) {
    const response = await api.get("/notifications", { params: { page, limit } });
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get("/notifications/unread-count");
    return response.data;
  },

  async markOneRead(id) {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllRead() {
    const response = await api.patch("/notifications/read-all");
    return response.data;
  },
};
