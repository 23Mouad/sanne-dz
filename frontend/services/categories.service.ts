import api from '../lib/api';
import { Category, WilayaInfo } from '../types';

export const CategoriesService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    // Backend returns array directly (no .data wrapper)
    const raw = response.data;
    return Array.isArray(raw) ? raw : (raw?.data ?? []);
  },
  
  getBySlug: async (slug: string): Promise<Category> => {
    const response = await api.get(`/categories/${slug}`);
    return response.data?.data ?? response.data;
  }
};

export const WilayasService = {
  getActive: async (): Promise<WilayaInfo[]> => {
    const response = await api.get('/wilayas/active');
    return response.data.data;
  },

  getAll: async (): Promise<WilayaInfo[]> => {
    const response = await api.get('/wilayas');
    return response.data.data;
  }
};
