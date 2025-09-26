import { api } from '../lib/axios';
import {
  RaidDroppedItemSchema,
  RaidDroppedItemsListSchema,
  RaidDroppedItemStatsSchema,
  type RaidDroppedItem,
  type CreateRaidDroppedItem,
  type UpdateRaidDroppedItem,
  type RaidDroppedItemsList,
  type RaidDroppedItemStats,
  type ItemCategory,
  type ItemGrade,
} from '../types/api';

export interface GetRaidDroppedItemsParams {
  page?: number;
  limit?: number;
  raidInstanceId?: string;
  category?: ItemCategory;
  grade?: ItemGrade;
  sortBy?: 'droppedAt' | 'name' | 'minDkpBid';
  sortOrder?: 'asc' | 'desc';
}

export const raidDroppedItemsService = {
  // Get all dropped items (admin only)
  async getAll(params: GetRaidDroppedItemsParams = {}): Promise<RaidDroppedItemsList> {
    try {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.raidInstanceId) searchParams.append('raidInstanceId', params.raidInstanceId);
      if (params.category) searchParams.append('category', params.category);
      if (params.grade) searchParams.append('grade', params.grade);
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

      const response = await api.get(`/raid-dropped-items?${searchParams.toString()}`);
      return RaidDroppedItemsListSchema.parse(response.data);
    } catch (error) {
      console.error('Failed to fetch raid dropped items:', error);
      throw error;
    }
  },

  // Get dropped item by ID
  async getById(id: string): Promise<RaidDroppedItem> {
    try {
      const response = await api.get(`/raid-dropped-items/${id}`);
      return RaidDroppedItemSchema.parse(response.data);
    } catch (error) {
      console.error('Failed to fetch raid dropped item:', error);
      throw error;
    }
  },

  // Get dropped items for specific raid instance
  async getByRaidInstanceId(raidInstanceId: string): Promise<RaidDroppedItem[]> {
    try {
      const response = await api.get(`/raid-instances/${raidInstanceId}/dropped-items`);
      // Backend returns { data: RaidDroppedItem[] }
      const data = response.data.data || response.data;
      return Array.isArray(data) ? data.map(item => RaidDroppedItemSchema.parse(item)) : [];
    } catch (error) {
      console.error('Failed to fetch raid instance dropped items:', error);
      throw error;
    }
  },

  // Create dropped item for raid instance (admin only)
  async create(raidInstanceId: string, data: CreateRaidDroppedItem): Promise<RaidDroppedItem> {
    try {
      const response = await api.post(`/raid-instances/${raidInstanceId}/dropped-items`, data);
      return RaidDroppedItemSchema.parse(response.data);
    } catch (error) {
      console.error('Failed to create raid dropped item:', error);
      throw error;
    }
  },

  // Update dropped item (admin only)
  async update(id: string, data: UpdateRaidDroppedItem): Promise<RaidDroppedItem> {
    try {
      const response = await api.put(`/raid-dropped-items/${id}`, data);
      return RaidDroppedItemSchema.parse(response.data);
    } catch (error) {
      console.error('Failed to update raid dropped item:', error);
      throw error;
    }
  },

  // Delete dropped item (admin only)
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/raid-dropped-items/${id}`);
    } catch (error) {
      console.error('Failed to delete raid dropped item:', error);
      throw error;
    }
  },

  // Get dropped items statistics (admin only)
  async getStats(): Promise<RaidDroppedItemStats> {
    try {
      const response = await api.get('/raid-dropped-items/stats');
      return RaidDroppedItemStatsSchema.parse(response.data);
    } catch (error) {
      console.error('Failed to fetch raid dropped items stats:', error);
      throw error;
    }
  },
};
