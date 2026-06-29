import api from '../lib/api';
import { AdminStats } from '../types';

export const AdminService = {
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get('/admin/stats');
    return response.data.data;
  },

  getPartners: async (status?: string, search?: string, page = 1) => {
    const params = new URLSearchParams({ page: page.toString() });
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    const response = await api.get(`/admin/partners?${params.toString()}`);
    return response.data.data;
  },

  approvePartner: async (id: string) => {
    const response = await api.put(`/admin/partners/${id}/approve`);
    return response.data;
  },

  rejectPartner: async (id: string, reason = 'Non spécifié') => {
    const response = await api.put(`/admin/partners/${id}/reject`, { reason });
    return response.data;
  },

  suspendPartner: async (id: string, reason?: string) => {
    const response = await api.put(`/admin/partners/${id}/suspend`, { reason });
    return response.data;
  },

  deletePartner: async (id: string) => {
    const response = await api.delete(`/admin/partners/${id}`);
    return response.data;
  },

  getUsers: async (page = 1) => {
    const response = await api.get(`/admin/users?page=${page}`);
    return response.data.data;
  },

  banUser: async (id: string) => {
    const response = await api.put(`/admin/users/${id}/ban`);
    return response.data;
  },

  unbanUser: async (id: string) => {
    const response = await api.put(`/admin/users/${id}/unban`);
    return response.data;
  },

  getSubscriptionConfig: async () => {
    const response = await api.get('/admin/config/subscription');
    return response.data.data;
  },

  updateSubscriptionConfig: async (data: any) => {
    const response = await api.put('/admin/config/subscription', data);
    return response.data;
  },

  updatePartnerPlan: async (partnerId: string, isPro: boolean) => {
    const response = await api.put(`/admin/partners/${partnerId}/plan`, { isPro });
    return response.data;
  }
};
