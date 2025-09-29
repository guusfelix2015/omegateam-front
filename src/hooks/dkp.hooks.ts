/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { dkpService, type DkpLeaderboardQuery, type DkpHistoryQuery } from '../services/dkp.service';
import type {

  DkpAdjustment,
  DkpTransaction,
} from '../types/api';

// DKP Leaderboard
export function useDkpLeaderboard(query: DkpLeaderboardQuery = {}) {
  return useQuery({
    queryKey: ['dkp', 'leaderboard', query],
    queryFn: () => dkpService.getDkpLeaderboard(query),
  });
}

// DKP Statistics
export function useDkpStats() {
  return useQuery({
    queryKey: ['dkp', 'stats'],
    queryFn: () => dkpService.getDkpStats(),
  });
}

// Current User DKP Summary
export function useMyDkpSummary() {
  return useQuery({
    queryKey: ['dkp', 'my-summary'],
    queryFn: () => dkpService.getMyDkpSummary(),
  });
}

// Current User DKP History
export function useMyDkpHistory(query: DkpHistoryQuery = {}) {
  return useQuery({
    queryKey: ['dkp', 'my-history', query],
    queryFn: () => dkpService.getMyDkpHistory(query),
  });
}

// User DKP Summary (authenticated users)
export function useUserDkpSummary(userId: string) {
  return useQuery({
    queryKey: ['dkp', 'user-summary', userId],
    queryFn: () => dkpService.getUserDkpSummary(userId),
    enabled: !!userId,
  });
}

// User DKP History (authenticated users)
export function useUserDkpHistory(userId: string, query: DkpHistoryQuery = {}) {
  return useQuery({
    queryKey: ['dkp', 'user-history', userId, query],
    queryFn: () => dkpService.getUserDkpHistory(userId, query),
    enabled: !!userId,
  });
}

// Create Manual DKP Adjustment (Admin only)
export function useCreateDkpAdjustment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DkpAdjustment) => dkpService.createDkpAdjustment(data),
    onSuccess: (data: DkpTransaction) => {
      toast.success('Ajuste de DKP criado com sucesso!');

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['dkp'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });

      // Update specific user's data if we have the userId
      if (data.userId) {
        queryClient.invalidateQueries({
          queryKey: ['dkp', 'user-summary', data.userId]
        });
        queryClient.invalidateQueries({
          queryKey: ['dkp', 'user-history', data.userId]
        });
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Erro ao criar ajuste de DKP';
      toast.error(message);
    },
  });
}

// Refresh DKP data
export function useRefreshDkpData() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['dkp'] });
    toast.success('Dados DKP atualizados!');
  };
}
