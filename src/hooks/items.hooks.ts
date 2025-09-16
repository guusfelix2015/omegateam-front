/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { itemsService, type GetItemsParams } from '../services/items.service';
import { type CreateItem, type UpdateItem } from '../types/api';
import { useToast } from './use-toast';

// Query hooks
export const useItems = (params: GetItemsParams = {}) => {
  return useQuery({
    queryKey: ['items', params],
    queryFn: () => itemsService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useItem = (id: string) => {
  return useQuery({
    queryKey: ['items', id],
    queryFn: () => itemsService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useItemStats = () => {
  return useQuery({
    queryKey: ['items', 'stats'],
    queryFn: () => itemsService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useLookups = () => {
  return useQuery({
    queryKey: ['lookups'],
    queryFn: () => itemsService.getLookups(),
    staleTime: 30 * 60 * 1000, // 30 minutes (lookups don't change often)
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

// Mutation hooks
export const useCreateItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateItem) => itemsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast({
        title: "Item criado!",
        description: "O item foi criado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar item",
        description: error.response?.data?.error?.message || error.response?.data?.message || "Erro interno do servidor",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItem }) =>
      itemsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['items', id] });
      toast({
        title: "Item atualizado!",
        description: "O item foi atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar item",
        description: error.response?.data?.error?.message || error.response?.data?.message || "Erro interno do servidor",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => itemsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast({
        title: "Item excluído!",
        description: "O item foi excluído com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir item",
        description: error.response?.data?.error?.message || error.response?.data?.message || "Erro interno do servidor",
        variant: "destructive",
      });
    },
  });
};
