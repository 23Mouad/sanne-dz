import api from '../lib/api';

export const SubscriptionsService = {
  // ===== PARTNER ENDPOINTS =====
  requestUpgrade: async (cycle: 'MONTHLY' | 'ANNUAL', whatsappClicked: boolean, receiptSent: boolean) => {
    const response = await api.post('/subscriptions/request-upgrade', { cycle, whatsappClicked, receiptSent });
    return response.data;
  },

  getPendingRequest: async () => {
    const response = await api.get('/subscriptions/pending-request');
    return response.data.data;
  },

  getConfig: async () => {
    const response = await api.get('/subscriptions/config');
    return response.data.data;
  },

  getHistory: async () => {
    const response = await api.get('/subscriptions/history');
    return response.data.data;
  },

  // ===== ADMIN ENDPOINTS =====
  adminGetPendingPayments: async (page = 1) => {
    const response = await api.get(`/subscriptions/payments/pending?page=${page}`);
    return response.data.data;
  },

  adminApprovePayment: async (id: string) => {
    const response = await api.put(`/subscriptions/payments/${id}/approve`);
    return response.data;
  },

  adminRejectPayment: async (id: string) => {
    const response = await api.put(`/subscriptions/payments/${id}/reject`);
    return response.data;
  }
};
