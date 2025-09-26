/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { raidDroppedItemsService, type GetRaidDroppedItemsParams } from '../services/raid-dropped-items.service';
import { type CreateRaidDroppedItem, type UpdateRaidDroppedItem } from '../types/api';
import { useToast } from './use-toast';

// Query hooks
export const useRaidDroppedItems = (params: GetRaidDroppedItemsParams = {}) => {
  return useQuery({
    queryKey: ['raid-dropped-items', params],
    queryFn: () => raidDroppedItemsService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useRaidDroppedItem = (id: string) => {
  return useQuery({
    queryKey: ['raid-dropped-items', id],
    queryFn: () => raidDroppedItemsService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useRaidInstanceDroppedItems = (raidInstanceId: string) => {
  return useQuery({
    queryKey: ['raid-instances', raidInstanceId, 'dropped-items'],
    queryFn: () => raidDroppedItemsService.getByRaidInstanceId(raidInstanceId),
    enabled: !!raidInstanceId,
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates for active raids)
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useRaidDroppedItemStats = () => {
  return useQuery({
    queryKey: ['raid-dropped-items', 'stats'],
    queryFn: () => raidDroppedItemsService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

// Mutation hooks
export const useCreateRaidDroppedItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ raidInstanceId, data }: { raidInstanceId: string; data: CreateRaidDroppedItem }) =>
      raidDroppedItemsService.create(raidInstanceId, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['raid-dropped-items'] });
      queryClient.invalidateQueries({ queryKey: ['raid-instances', variables.raidInstanceId, 'dropped-items'] });
      queryClient.invalidateQueries({ queryKey: ['raid-instances', variables.raidInstanceId] });
      
      toast({
        title: "Item dropado adicionado!",
        description: `${data.name} foi adicionado à raid instance.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar item dropado",
        description: error.response?.data?.error?.message || error.response?.data?.message || "Erro interno do servidor",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateRaidDroppedItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRaidDroppedItem }) =>
      raidDroppedItemsService.update(id, data),
    onSuccess: (data) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['raid-dropped-items'] });
      queryClient.invalidateQueries({ queryKey: ['raid-dropped-items', data.id] });
      queryClient.invalidateQueries({ queryKey: ['raid-instances', data.raidInstanceId, 'dropped-items'] });
      
      toast({
        title: "Item dropado atualizado!",
        description: `${data.name} foi atualizado com sucesso.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar item dropado",
        description: error.response?.data?.error?.message || error.response?.data?.message || "Erro interno do servidor",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteRaidDroppedItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => raidDroppedItemsService.delete(id),
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['raid-dropped-items'] });
      queryClient.removeQueries({ queryKey: ['raid-dropped-items', deletedId] });
      
      // Also invalidate raid instances queries to update counts
      queryClient.invalidateQueries({ queryKey: ['raid-instances'] });
      
      toast({
        title: "Item dropado removido!",
        description: "O item foi removido com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover item dropado",
        description: error.response?.data?.error?.message || error.response?.data?.message || "Erro interno do servidor",
        variant: "destructive",
      });
    },
  });
};
