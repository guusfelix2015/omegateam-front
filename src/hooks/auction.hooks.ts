/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auctionService } from '../services/auction.service';
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
  WonItemsQuery,
  AuctionAnalytics,
} from '../types/auction';

// Query keys
export const auctionKeys = {
  all: ['auctions'] as const,
  lists: () => [...auctionKeys.all, 'list'] as const,
  list: (params?: GetAuctionsQuery) =>
    [...auctionKeys.lists(), params] as const,
  details: () => [...auctionKeys.all, 'detail'] as const,
  detail: (id: string) => [...auctionKeys.details(), id] as const,
  active: () => [...auctionKeys.all, 'active'] as const,
  wonItems: () => [...auctionKeys.all, 'won-items'] as const,
  myWonItems: () => [...auctionKeys.wonItems(), 'me'] as const,
  userWonItems: (userId: string) =>
    [...auctionKeys.wonItems(), userId] as const,
  auctionedItems: () => [...auctionKeys.all, 'auctioned-items'] as const,
  auditLogs: () => [...auctionKeys.all, 'audit-logs'] as const,
  auditLog: (entityId: string) =>
    [...auctionKeys.auditLogs(), entityId] as const,
  analytics: () => [...auctionKeys.all, 'analytics'] as const,
};

// Get auctions with pagination
export function useAuctions(params?: GetAuctionsQuery) {
  return useQuery<AuctionsListResponse>({
    queryKey: auctionKeys.list(params),
    queryFn: () => auctionService.getAuctions(params),
  });
}

// Get auction by ID
export function useAuction(auctionId: string) {
  return useQuery<Auction>({
    queryKey: auctionKeys.detail(auctionId),
    queryFn: () => auctionService.getAuctionById(auctionId),
    enabled: !!auctionId,
  });
}

// Helper function to calculate time remaining
function calculateTimeRemaining(
  startedAt: string | null,
  defaultTimerSeconds: number
): number {
  if (!startedAt) return 0;

  const startTime = new Date(startedAt).getTime();
  const now = Date.now();
  const elapsed = Math.floor((now - startTime) / 1000);
  const remaining = defaultTimerSeconds - elapsed;

  return Math.max(0, remaining);
}

// Get active auction with adaptive polling
export function useActiveAuction() {
  const query = useQuery<Auction | null>({
    queryKey: auctionKeys.active(),
    queryFn: () => auctionService.getActiveAuction(),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 3000; // No active auction - poll every 3s

      // Find current item in auction
      const currentItem = data.items.find(
        (item: any) => item.status === 'IN_AUCTION'
      );
      if (!currentItem || !currentItem.startedAt) return 3000;

      // Calculate time remaining
      const timeRemaining = calculateTimeRemaining(
        currentItem.startedAt,
        data.defaultTimerSeconds
      );

      // Adaptive polling:
      // - Last 10 seconds: poll every 1 second (fast updates)
      // - Rest of time: poll every 3 seconds (normal)
      return timeRemaining <= 10 ? 1000 : 3000;
    },
    refetchIntervalInBackground: false,
  });

  return query;
}

// Get my won items
export function useMyWonItems(filters?: WonItemsQuery) {
  return useQuery<UserWonItem[]>({
    queryKey: [...auctionKeys.myWonItems(), filters],
    queryFn: () => auctionService.getMyWonItems(filters),
  });
}

// Get user's won items
export function useUserWonItems(userId: string) {
  return useQuery<UserWonItem[]>({
    queryKey: auctionKeys.userWonItems(userId),
    queryFn: () => auctionService.getUserWonItems(userId),
    enabled: !!userId,
  });
}

// Create auction mutation
export function useCreateAuction() {
  const queryClient = useQueryClient();

  return useMutation<Auction, Error, CreateAuctionInput>({
    mutationFn: (data) => auctionService.createAuction(data),
    onSuccess: () => {
      // Invalidate auctions list
      queryClient.invalidateQueries({ queryKey: auctionKeys.lists() });
    },
  });
}

// Start auction mutation
export function useStartAuction() {
  const queryClient = useQueryClient();

  return useMutation<Auction, Error, string>({
    mutationFn: (auctionId) => auctionService.startAuction(auctionId),
    onSuccess: (data) => {
      // Invalidate auctions list and active auction
      queryClient.invalidateQueries({ queryKey: auctionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: auctionKeys.active() });
      queryClient.invalidateQueries({ queryKey: auctionKeys.detail(data.id) });
    },
  });
}

// Place bid mutation
export function usePlaceBid() {
  const queryClient = useQueryClient();

  return useMutation<Auction, Error, CreateBidInput>({
    mutationFn: (data) => auctionService.placeBid(data),
    onSuccess: (data) => {
      // Invalidate active auction and auction detail
      queryClient.invalidateQueries({ queryKey: auctionKeys.active() });
      queryClient.invalidateQueries({ queryKey: auctionKeys.detail(data.id) });
    },
  });
}

// Finalize auction item mutation (ADMIN only)
export function useFinalizeAuctionItem() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (itemId) => auctionService.finalizeAuctionItem(itemId),
    onSuccess: () => {
      // Invalidate active auction and auctions list
      queryClient.invalidateQueries({ queryKey: auctionKeys.active() });
      queryClient.invalidateQueries({ queryKey: auctionKeys.lists() });
    },
  });
}

// Cancel auction mutation
export function useCancelAuction() {
  const queryClient = useQueryClient();

  return useMutation<Auction, Error, string>({
    mutationFn: (auctionId) => auctionService.cancelAuction(auctionId),
    onSuccess: (data) => {
      // Invalidate auctions list, active auction, and auction detail
      queryClient.invalidateQueries({ queryKey: auctionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: auctionKeys.active() });
      queryClient.invalidateQueries({ queryKey: auctionKeys.detail(data.id) });
    },
  });
}

// Get auctioned items (ADMIN only)
export function useAuctionedItems() {
  return useQuery<AuctionedItem[]>({
    queryKey: auctionKeys.auctionedItems(),
    queryFn: () => auctionService.getAuctionedItems(),
  });
}

// Reset auctioned flag mutation (ADMIN only)
export function useResetAuctionedFlag() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ResetAuctionedFlagInput>({
    mutationFn: (data) => auctionService.resetAuctionedFlag(data),
    onSuccess: () => {
      // Invalidate auctioned items list
      queryClient.invalidateQueries({ queryKey: auctionKeys.auctionedItems() });
      queryClient.invalidateQueries({ queryKey: auctionKeys.auditLogs() });
    },
  });
}

// Get audit logs (ADMIN only)
export function useAuditLogs(entityId?: string) {
  return useQuery<AuditLog[]>({
    queryKey: entityId
      ? auctionKeys.auditLog(entityId)
      : auctionKeys.auditLogs(),
    queryFn: () => auctionService.getAuditLogs(entityId),
  });
}

// Get auction analytics (ADMIN only)
export function useAuctionAnalytics() {
  return useQuery<AuctionAnalytics>({
    queryKey: auctionKeys.analytics(),
    queryFn: () => auctionService.getAuctionAnalytics(),
  });
}
