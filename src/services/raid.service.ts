/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '../lib/axios';
import {
  RaidSchema,
  RaidInstanceSchema,
  CreateRaidSchema,
  UpdateRaidSchema,
  CreateRaidInstanceSchema,
  CreateRaidInstanceWithItemsSchema,
  type Raid,
  type RaidInstance,
  type CreateRaid,
  type UpdateRaid,
  type CreateRaidInstance,
  type CreateRaidInstanceWithItems,
} from '../types/api';
import { z } from 'zod';

// Response schemas for paginated data
const RaidsResponseSchema = z.object({
  data: z.array(RaidSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

const RaidInstancesResponseSchema = z.object({
  data: z.array(RaidInstanceSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

const RaidStatsSchema = z.object({
  total: z.number(),
  active: z.number(),
  inactive: z.number(),
  averageBossLevel: z.number(),
  averageBaseScore: z.number(),
});

const RaidInstanceStatsSchema = z.object({
  total: z.number(),
  totalParticipants: z.number(),
  averageParticipantsPerRaid: z.number(),
  totalDkpAwarded: z.number(),
  averageDkpPerRaid: z.number(),
});

const DkpPreviewSchema = z.object({
  totalDkpToAward: z.number(),
  averageDkpPerParticipant: z.number(),
  participants: z.array(
    z.object({
      userId: z.string(),
      name: z.string(),
      gearScore: z.number(),
      dkpAwarded: z.number(),
    })
  ),
});

export type RaidsResponse = z.infer<typeof RaidsResponseSchema>;
export type RaidInstancesResponse = z.infer<typeof RaidInstancesResponseSchema>;
export type RaidStats = z.infer<typeof RaidStatsSchema>;
export type RaidInstanceStats = z.infer<typeof RaidInstanceStatsSchema>;
export type DkpPreview = z.infer<typeof DkpPreviewSchema>;

export interface GetRaidsQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'bossLevel' | 'baseScore' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface GetRaidInstancesQuery {
  page?: number;
  limit?: number;
  raidId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'completedAt' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export const raidService = {
  // Raid management
  async getRaids(query: GetRaidsQuery = {}): Promise<RaidsResponse> {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.search) params.append('search', query.search);
    if (query.isActive !== undefined)
      params.append('isActive', query.isActive.toString());
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);

    const response = await api.get(`/raids?${params.toString()}`);
    return RaidsResponseSchema.parse(response.data);
  },

  async getRaidById(id: string): Promise<Raid> {
    const response = await api.get(`/raids/${id}`);
    return RaidSchema.parse(response.data);
  },

  async getActiveRaids(): Promise<Raid[]> {
    const response = await api.get('/raids/active');
    return z.object({ data: z.array(RaidSchema) }).parse(response.data).data;
  },

  async getRaidStats(): Promise<RaidStats> {
    const response = await api.get('/raids/stats');
    return RaidStatsSchema.parse(response.data);
  },

  async createRaid(data: CreateRaid): Promise<Raid> {
    const validatedData = CreateRaidSchema.parse(data);
    const response = await api.post('/raids', validatedData);
    return RaidSchema.parse(response.data);
  },

  async updateRaid(id: string, data: UpdateRaid): Promise<Raid> {
    const validatedData = UpdateRaidSchema.parse(data);
    const response = await api.put(`/raids/${id}`, validatedData);
    return RaidSchema.parse(response.data);
  },

  async deleteRaid(id: string): Promise<void> {
    await api.delete(`/raids/${id}`);
  },

  async deactivateRaid(id: string): Promise<Raid> {
    const response = await api.patch(`/raids/${id}/deactivate`);
    return RaidSchema.parse(response.data);
  },

  async activateRaid(id: string): Promise<Raid> {
    const response = await api.patch(`/raids/${id}/activate`);
    return RaidSchema.parse(response.data);
  },

  // Raid instance management
  async getRaidInstances(
    query: GetRaidInstancesQuery = {}
  ): Promise<RaidInstancesResponse> {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.raidId) params.append('raidId', query.raidId);
    if (query.dateFrom) params.append('dateFrom', query.dateFrom);
    if (query.dateTo) params.append('dateTo', query.dateTo);
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);

    const response = await api.get(`/raid-instances?${params.toString()}`);
    return RaidInstancesResponseSchema.parse(response.data);
  },

  async getRaidInstanceById(id: string): Promise<RaidInstance> {
    const response = await api.get(`/raid-instances/${id}`);
    return RaidInstanceSchema.parse(response.data);
  },

  async getRecentRaidInstances(limit: number = 5): Promise<RaidInstance[]> {
    const response = await api.get(`/raid-instances/recent?limit=${limit}`);
    return z.object({ data: z.array(RaidInstanceSchema) }).parse(response.data)
      .data;
  },

  async getRaidInstanceStats(): Promise<RaidInstanceStats> {
    const response = await api.get('/raid-instances/stats');
    return RaidInstanceStatsSchema.parse(response.data);
  },

  async createRaidInstance(data: CreateRaidInstance): Promise<RaidInstance> {
    const validatedData = CreateRaidInstanceSchema.parse(data);
    const response = await api.post('/raid-instances', validatedData);
    return RaidInstanceSchema.parse(response.data);
  },

  async createRaidInstanceWithItems(
    data: CreateRaidInstanceWithItems
  ): Promise<RaidInstance> {
    const validatedData = CreateRaidInstanceWithItemsSchema.parse(data);
    const response = await api.post(
      '/raid-instances/with-items',
      validatedData
    );
    return RaidInstanceSchema.parse(response.data);
  },

  async deleteRaidInstance(id: string): Promise<void> {
    await api.delete(`/raid-instances/${id}`);
  },

  async previewDkpCalculation(
    raidId: string,
    participantIds: string[]
  ): Promise<DkpPreview> {
    const response = await api.post('/raid-instances/preview-dkp', {
      raidId,
      participantIds,
    });
    return DkpPreviewSchema.parse(response.data);
  },

  async addParticipant(raidInstanceId: string, userId: string): Promise<any> {
    const response = await api.post(
      `/raid-instances/${raidInstanceId}/participants`,
      {
        userId,
      }
    );
    return response.data;
  },

  async removeParticipant(
    raidInstanceId: string,
    userId: string
  ): Promise<void> {
    await api.delete(
      `/raid-instances/${raidInstanceId}/participants/${userId}`
    );
  },
};
