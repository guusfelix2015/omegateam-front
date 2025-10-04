/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/lib/axios';
import type {
  Auction,
  AuctionsListResponse,
  CreateAuctionInput,
  CreateBidInput,
  GetAuctionsQuery,
  UserWonItem,
  AuctionedItem,
  ResetAuctionedFlagInput,
  AuditLog,
  AuctionAnalytics,
} from '../types/auction';
import {
  auctionSchema,
  auctionsListResponseSchema,
  userWonItemSchema,
  auctionedItemSchema,
  auditLogSchema,
  auctionAnalyticsSchema,
} from '../types/auction';

export const auctionService = {
  // Create auction (ADMIN only)
  async createAuction(data: CreateAuctionInput): Promise<Auction> {
    const response = await api.post('/auctions', data);
    return auctionSchema.parse(response.data);
  },

  // Start auction (ADMIN only)
  async startAuction(auctionId: string): Promise<Auction> {
    const response = await api.post(`/auctions/${auctionId}/start`);
    return auctionSchema.parse(response.data);
  },

  // Get auctions with pagination
  async getAuctions(params?: GetAuctionsQuery): Promise<AuctionsListResponse> {
    const response = await api.get('/auctions', { params });
    return auctionsListResponseSchema.parse(response.data);
  },

  // Get auction by ID
  async getAuctionById(auctionId: string): Promise<Auction> {
    const response = await api.get(`/auctions/${auctionId}`);
    return auctionSchema.parse(response.data);
  },

  // Get active auction
  async getActiveAuction(): Promise<Auction | null> {
    const response = await api.get('/auctions/active');
    // Backend now returns null instead of 404
    if (response.data === null) return null;
    return auctionSchema.parse(response.data);
  },

  // Place bid
  async placeBid(data: CreateBidInput): Promise<Auction> {
    const response = await api.post('/auctions/bids', data);
    return auctionSchema.parse(response.data);
  },

  // Finalize auction item (ADMIN only)
  async finalizeAuctionItem(itemId: string): Promise<void> {
    await api.post(`/auctions/items/${itemId}/finalize`);
  },

  // Get my won items
  async getMyWonItems(filters?: any): Promise<UserWonItem[]> {
    const response = await api.get('/auctions/my-won-items', {
      params: filters,
    });
    return response.data.map((item: unknown) => userWonItemSchema.parse(item));
  },

  // Get user's won items
  async getUserWonItems(userId: string): Promise<UserWonItem[]> {
    const response = await api.get(`/auctions/users/${userId}/won-items`);
    return response.data.map((item: unknown) => userWonItemSchema.parse(item));
  },

  // Cancel auction (ADMIN only)
  async cancelAuction(auctionId: string): Promise<Auction> {
    const response = await api.post(`/auctions/${auctionId}/cancel`);
    return auctionSchema.parse(response.data);
  },

  // Get auctioned items (ADMIN only)
  async getAuctionedItems(): Promise<AuctionedItem[]> {
    const response = await api.get('/auctions/auctioned-items');
    return response.data.map((item: unknown) => auctionedItemSchema.parse(item));
  },

  // Reset auctioned flag (ADMIN only)
  async resetAuctionedFlag(data: ResetAuctionedFlagInput): Promise<void> {
    await api.post('/auctions/reset-auctioned-flag', data);
  },

  // Get audit logs (ADMIN only)
  async getAuditLogs(entityId?: string): Promise<AuditLog[]> {
    const response = await api.get('/auctions/audit-logs', {
      params: entityId ? { entityId } : {},
    });
    return response.data.map((log: unknown) => auditLogSchema.parse(log));
  },

  // Get auction analytics (ADMIN only)
  async getAuctionAnalytics(): Promise<AuctionAnalytics> {
    const response = await api.get('/auctions/analytics');
    return auctionAnalyticsSchema.parse(response.data);
  },
};

