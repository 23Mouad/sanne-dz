import { useState, useEffect } from 'react';
import { CategoriesService } from '@/services/categories.service';
import type { Category } from '@/types';

// Global cache to avoid multiple requests
let categoriesCache: Category[] | null = null;
let fetchPromise: Promise<Category[]> | null = null;

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(categoriesCache || []);
  const [loading, setLoading] = useState(!categoriesCache);

  useEffect(() => {
    if (categoriesCache) {
      setCategories(categoriesCache);
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = CategoriesService.getAll().then(data => {
        categoriesCache = data;
        return data;
      });
    }

    fetchPromise.then(data => {
      setCategories(data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  return { categories, loading };
}
