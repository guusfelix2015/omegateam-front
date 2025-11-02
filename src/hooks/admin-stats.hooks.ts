import { useQuery } from '@tanstack/react-query';
import {
  adminStatsService,
  type UserAnalyticsFilters,
  type RaidAnalyticsFilters,
  type DkpAnalyticsFilters,
} from '../services/admin-stats.service';

// Cache time: 5 minutes for dashboard stats
const STALE_TIME = 5 * 60 * 1000;

export const useAdminOverviewStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats', 'overview'],
    queryFn: () => adminStatsService.getOverviewStats(),
    staleTime: STALE_TIME,
  });
};

export const useUserAnalytics = (filters: UserAnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['admin', 'stats', 'users', filters],
    queryFn: () => adminStatsService.getUserAnalytics(filters),
    staleTime: STALE_TIME,
  });
};

export const useRaidAnalytics = (filters: RaidAnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['admin', 'stats', 'raids', filters],
    queryFn: () => adminStatsService.getRaidAnalytics(filters),
    staleTime: STALE_TIME,
  });
};

export const useDkpAnalytics = (filters: DkpAnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['admin', 'stats', 'dkp', filters],
    queryFn: () => adminStatsService.getDkpAnalytics(filters),
    staleTime: STALE_TIME,
  });
};

export const useCompanyPartyStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats', 'company-parties'],
    queryFn: () => adminStatsService.getCompanyPartyStats(),
    staleTime: STALE_TIME,
  });
};

export const useActivityFeed = (limit?: number) => {
  return useQuery({
    queryKey: ['admin', 'stats', 'activity', limit],
    queryFn: () => adminStatsService.getActivityFeed(limit),
    staleTime: STALE_TIME,
    // Removed auto-refetch to prevent excessive requests
    // refetchInterval: 30000,
  });
};
