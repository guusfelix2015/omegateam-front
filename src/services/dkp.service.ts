import { api } from '../lib/axios';
import {
  DkpTransactionSchema,
  DkpLeaderboardEntrySchema,
  UserDkpSummarySchema,
  DkpStatsSchema,
  DkpAdjustmentSchema,
  type DkpTransaction,
  type UserDkpSummary,
  type DkpStats,
  type DkpAdjustment,
  type DkpTransactionType,
} from '../types/api';
import { z } from 'zod';

// Response schemas for paginated data
const DkpLeaderboardResponseSchema = z.object({
  data: z.array(DkpLeaderboardEntrySchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

const DkpHistoryResponseSchema = z.object({
  data: z.array(DkpTransactionSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

export type DkpLeaderboardResponse = z.infer<typeof DkpLeaderboardResponseSchema>;
export type DkpHistoryResponse = z.infer<typeof DkpHistoryResponseSchema>;

export interface DkpLeaderboardQuery {
  page?: number;
  limit?: number;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface DkpHistoryQuery {
  page?: number;
  limit?: number;
  type?: DkpTransactionType;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'amount';
  sortOrder?: 'asc' | 'desc';
}

export const dkpService = {
  // DKP Leaderboard
  async getDkpLeaderboard(query: DkpLeaderboardQuery = {}): Promise<DkpLeaderboardResponse> {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);
    if (query.search) params.append('search', query.search);

    const response = await api.get(`/dkp/leaderboard?${params.toString()}`);
    return DkpLeaderboardResponseSchema.parse(response.data);
  },

  // DKP Statistics
  async getDkpStats(): Promise<DkpStats> {
    const response = await api.get('/dkp/stats');
    return DkpStatsSchema.parse(response.data);
  },

  // Current user's DKP history
  async getMyDkpHistory(query: DkpHistoryQuery = {}): Promise<DkpHistoryResponse> {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.type) params.append('type', query.type);
    if (query.dateFrom) params.append('dateFrom', query.dateFrom);
    if (query.dateTo) params.append('dateTo', query.dateTo);
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);

    const response = await api.get(`/dkp/my-history?${params.toString()}`);
    return DkpHistoryResponseSchema.parse(response.data);
  },

  // Current user's DKP summary
  async getMyDkpSummary(): Promise<UserDkpSummary> {
    const response = await api.get('/dkp/my-summary');
    return UserDkpSummarySchema.parse(response.data);
  },

  // Manual DKP adjustment (ADMIN only)
  async createDkpAdjustment(data: DkpAdjustment): Promise<DkpTransaction> {
    const validatedData = DkpAdjustmentSchema.parse(data);
    const response = await api.post('/dkp/adjustments', validatedData);
    return DkpTransactionSchema.parse(response.data);
  },

  // Get specific user's DKP history (ADMIN only)
  async getUserDkpHistory(userId: string, query: DkpHistoryQuery = {}): Promise<DkpHistoryResponse> {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.type) params.append('type', query.type);
    if (query.dateFrom) params.append('dateFrom', query.dateFrom);
    if (query.dateTo) params.append('dateTo', query.dateTo);
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);

    const response = await api.get(`/dkp/users/${userId}/history?${params.toString()}`);
    return DkpHistoryResponseSchema.parse(response.data);
  },

  // Get specific user's DKP summary (ADMIN only)
  async getUserDkpSummary(userId: string): Promise<UserDkpSummary> {
    const response = await api.get(`/dkp/users/${userId}/summary`);
    return UserDkpSummarySchema.parse(response.data);
  },
};
