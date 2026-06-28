import api from '../lib/api';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResult {
  data: Notification[];
  meta: {
    total: number;
    unreadCount: number;
    page: number;
    totalPages: number;
  };
}

export const NotificationsService = {
  getAll: async (page = 1): Promise<NotificationsResult> => {
    const response = await api.get(`/notifications?page=${page}`);
    return response.data?.data ?? response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/notifications/unread-count');
    const payload = response.data?.data ?? response.data;
    return payload.count ?? 0;
  },

  markRead: async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },

  markAllRead: async (): Promise<void> => {
    await api.put('/notifications/read-all');
  },

  deleteOne: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};
