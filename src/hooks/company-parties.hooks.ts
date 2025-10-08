/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companyPartiesService } from '../services/company-parties.service';
import {
  type CreateCompanyParty,
  type UpdateCompanyParty,
  type AddPlayerToParty,
} from '../types/api';
import { useToast } from './use-toast';

// Query hooks
export const useCompanyParties = () => {
  return useQuery({
    queryKey: ['company-parties'],
    queryFn: () => companyPartiesService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useCompanyParty = (id: string) => {
  return useQuery({
    queryKey: ['company-parties', id],
    queryFn: () => companyPartiesService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

// Mutation hooks
export const useCreateCompanyParty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCompanyParty) =>
      companyPartiesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-parties'] });
      toast({
        title: 'Company Party criada!',
        description: 'A Company Party foi criada com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar Company Party',
        description:
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateCompanyParty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCompanyParty }) =>
      companyPartiesService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['company-parties'] });
      queryClient.invalidateQueries({ queryKey: ['company-parties', id] });
      toast({
        title: 'Company Party atualizada!',
        description: 'As alterações foram salvas com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar Company Party',
        description:
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteCompanyParty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => companyPartiesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-parties'] });
      toast({
        title: 'Company Party excluída!',
        description: 'A Company Party foi excluída com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir Company Party',
        description:
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
};

export const useAddPlayerToParty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      partyId,
      data,
    }: {
      partyId: string;
      data: AddPlayerToParty;
    }) => companyPartiesService.addPlayer(partyId, data),
    onSuccess: (_, { partyId }) => {
      queryClient.invalidateQueries({ queryKey: ['company-parties'] });
      queryClient.invalidateQueries({ queryKey: ['company-parties', partyId] });
      queryClient.invalidateQueries({
        queryKey: ['company-parties', partyId, 'members'],
      });
      toast({
        title: 'Jogador adicionado!',
        description: 'O jogador foi adicionado à Company Party com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao adicionar jogador',
        description:
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
};

export const useRemovePlayerFromParty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      partyId,
      playerId,
    }: {
      partyId: string;
      playerId: string;
    }) => companyPartiesService.removePlayer(partyId, playerId),
    onSuccess: (_, { partyId }) => {
      queryClient.invalidateQueries({ queryKey: ['company-parties'] });
      queryClient.invalidateQueries({ queryKey: ['company-parties', partyId] });
      queryClient.invalidateQueries({
        queryKey: ['company-parties', partyId, 'members'],
      });
      toast({
        title: 'Jogador removido!',
        description: 'O jogador foi removido da Company Party com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao remover jogador',
        description:
          error.response?.data?.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
};
