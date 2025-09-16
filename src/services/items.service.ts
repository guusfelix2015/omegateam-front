import { api } from '../lib/axios';
import {
  ItemSchema,
  ItemsListSchema,
  ItemStatsSchema,
  LookupsSchema,
  type Item,
  type CreateItem,
  type UpdateItem,
  type ItemsList,
  type ItemStats,
  type Lookups,
} from '../types/api';

export interface GetItemsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  grade?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const itemsService = {
  async getAll(params: GetItemsParams = {}): Promise<ItemsList> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.search) searchParams.append('search', params.search);
      if (params.category) searchParams.append('category', params.category);
      if (params.grade) searchParams.append('grade', params.grade);
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

      const response = await api.get(`/items?${searchParams.toString()}`);

      try {
        return ItemsListSchema.parse(response.data);
      } catch (parseError) {
        console.warn('Failed to parse items list:', response.data, parseError);
        return response.data as ItemsList;
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Item> {
    try {
      const response = await api.get(`/items/${id}`);

      try {
        return ItemSchema.parse(response.data);
      } catch (parseError) {
        console.warn('Failed to parse item:', response.data, parseError);
        return response.data as Item;
      }
    } catch (error) {
      console.error('Failed to fetch item:', error);
      throw error;
    }
  },

  async create(data: CreateItem): Promise<Item> {
    try {
      const response = await api.post('/items', data);
      return ItemSchema.parse(response.data);
    } catch (error) {
      console.error('Failed to create item:', error);
      throw error;
    }
  },

  async update(id: string, data: UpdateItem): Promise<Item> {
    try {
      const response = await api.put(`/items/${id}`, data);
      return ItemSchema.parse(response.data);
    } catch (error) {
      console.error('Failed to update item:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/items/${id}`);
    } catch (error) {
      console.error('Failed to delete item:', error);
      throw error;
    }
  },

  async getStats(): Promise<ItemStats> {
    try {
      const response = await api.get('/items/stats');

      try {
        return ItemStatsSchema.parse(response.data);
      } catch (parseError) {
        console.warn('Failed to parse item stats:', response.data, parseError);
        return response.data as ItemStats;
      }
    } catch (error) {
      console.error('Failed to fetch item stats:', error);
      throw error;
    }
  },

  async getLookups(): Promise<Lookups> {
    try {
      const response = await api.get('/lookups');

      try {
        return LookupsSchema.parse(response.data);
      } catch (parseError) {
        console.warn('Failed to parse lookups:', response.data, parseError);
        return response.data as Lookups;
      }
    } catch (error) {
      console.error('Failed to fetch lookups:', error);
      throw error;
    }
  },
};
