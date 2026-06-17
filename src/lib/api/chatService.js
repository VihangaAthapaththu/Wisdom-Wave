import api from "./api";

export const chatService = {
  async getContacts() {
    const response = await api.get("/chat/contacts");
    return response.data;
  },

  async getConversations() {
    const response = await api.get("/chat/conversations");
    return response.data;
  },

  async startConversation(payload) {
    const response = await api.post("/chat/conversations", payload);
    return response.data;
  },

  async getMessages(conversationId, page = 1) {
    const response = await api.get(`/chat/conversations/${conversationId}/messages`, {
      params: { page },
    });
    return response.data;
  },

  async sendMessage(conversationId, content) {
    const response = await api.post(`/chat/conversations/${conversationId}/messages`, { content });
    return response.data;
  },

  async markRead(conversationId) {
    const response = await api.patch(`/chat/conversations/${conversationId}/read`);
    return response.data;
  },
};
