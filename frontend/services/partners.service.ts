import api from '../lib/api';
import { SearchFilters, SearchResult, Partner } from '../types';

export const PartnersService = {
  search: async (filters: SearchFilters): Promise<SearchResult> => {
    const params = new URLSearchParams();
    if (filters.q) params.append('q', filters.q);
    if (filters.wilaya) params.append('wilayaId', filters.wilaya);
    if (filters.category) params.append('categorySlug', filters.category);
    if (filters.plan) params.append('plan', filters.plan.toUpperCase());
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', filters.page.toString());

    const response = await api.get(`/partners?${params.toString()}`);
    return {
      partners: response.data.data.data,
      total: response.data.data.meta.total,
      page: response.data.data.meta.page,
      totalPages: response.data.data.meta.totalPages,
      filters,
    };
  },

  getFeatured: async (): Promise<Partner[]> => {
    const response = await api.get('/partners/featured');
    return response.data.data;
  },

  getBySlug: async (slug: string): Promise<Partner> => {
    const response = await api.get(`/partners/${slug}`);
    return response.data.data;
  },

  recordView: async (id: string) => {
    await api.post(`/partners/${id}/view`);
  },

  recordClick: async (id: string, type: 'whatsapp' | 'phone') => {
    await api.post(`/partners/${id}/click/${type}`);
  },

  // Dashboard endpoints for logged in partner
  getMyProfile: async (): Promise<Partner> => {
    const response = await api.get('/partners/me');
    return response.data.data;
  },

  updateMyProfile: async (data: any) => {
    const response = await api.put('/partners/me', data);
    return response.data.data;
  },

  updateLogo: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.put('/partners/me/logo', formData);
    return response.data.data;
  },

  updateCover: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.put('/partners/me/cover', formData);
    return response.data.data;
  },
  
  getPhotos: async () => {
    const response = await api.get('/partners/me/photos');
    return response.data.data;
  },
  
  addPhoto: async (file: File, caption?: string, order?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    if (caption) formData.append('caption', caption);
    if (order !== undefined) formData.append('order', String(order));
    
    const response = await api.post('/partners/me/photos', formData);
    return response.data.data;
  },
  
  deletePhoto: async (id: string) => {
    await api.delete(`/partners/me/photos/${id}`);
  },

  getVideos: async () => {
    const response = await api.get('/partners/me/videos');
    return response.data.data;
  },
  
  addVideo: async (file: File, caption?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (caption) formData.append('caption', caption);
    
    const response = await api.post('/partners/me/videos', formData);
    return response.data.data;
  },
  
  deleteVideo: async (id: string) => {
    await api.delete(`/partners/me/videos/${id}`);
  },
  
  getProducts: async () => {
    const response = await api.get('/partners/me/products');
    return response.data.data;
  },
  
  addProduct: async (data: FormData | any) => {
    const response = await api.post('/partners/me/products', data);
    return response.data.data;
  },

  updateProduct: async (id: string, data: FormData | any) => {
    const response = await api.put(`/partners/me/products/${id}`, data);
    return response.data.data;
  },
  
  deleteProduct: async (id: string) => {
    await api.delete(`/partners/me/products/${id}`);
  },

  requestDeletion: async () => {
    const response = await api.post('/partners/me/request-deletion');
    return response.data;
  },

  getMyStats: async () => {
    const response = await api.get('/partners/me/stats');
    return response.data.data || response.data;
  }
};
