/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from './use-toast';
import {
  raidService,
  type GetRaidsQuery,
  type GetRaidInstancesQuery,
} from '../services/raid.service';
import type { CreateRaid, CreateRaidInstance, UpdateRaid } from '@/types/api';

// Raid hooks
export const useRaids = (query: GetRaidsQuery = {}) => {
  return useQuery({
    queryKey: ['raids', query],
    queryFn: () => raidService.getRaids(query),
  });
};

export const useRaid = (id: string) => {
  return useQuery({
    queryKey: ['raids', id],
    queryFn: () => raidService.getRaidById(id),
    enabled: !!id,
  });
};

export const useActiveRaids = () => {
  return useQuery({
    queryKey: ['raids', 'active'],
    queryFn: () => raidService.getActiveRaids(),
  });
};

export const useRaidStats = () => {
  return useQuery({
    queryKey: ['raids', 'stats'],
    queryFn: () => raidService.getRaidStats(),
  });
};

export const useCreateRaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRaid) => raidService.createRaid(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['raids'] });
      toast({
        title: 'Sucesso',
        description: 'Raid criado com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.response?.data?.error?.message || 'Erro ao criar raid',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateRaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRaid }) =>
      raidService.updateRaid(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['raids'] });
      toast({
        title: 'Sucesso',
        description: 'Raid atualizado com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.response?.data?.error?.message || 'Erro ao atualizar raid',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteRaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => raidService.deleteRaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['raids'] });
      toast({
        title: 'Sucesso',
        description: 'Raid excluído com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.response?.data?.error?.message || 'Erro ao excluir raid',
        variant: 'destructive',
      });
    },
  });
};

export const useToggleRaidStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, activate }: { id: string; activate: boolean }) =>
      activate ? raidService.activateRaid(id) : raidService.deactivateRaid(id),
    onSuccess: (_, { activate }) => {
      queryClient.invalidateQueries({ queryKey: ['raids'] });
      toast({
        title: 'Sucesso',
        description: `Raid ${activate ? 'ativado' : 'desativado'} com sucesso!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.response?.data?.error?.message || 'Erro ao alterar status do raid',
        variant: 'destructive',
      });
    },
  });
};

// Raid Instance hooks
export const useRaidInstances = (query: GetRaidInstancesQuery = {}) => {
  return useQuery({
    queryKey: ['raid-instances', query],
    queryFn: () => raidService.getRaidInstances(query),
  });
};

export const useRaidInstance = (id: string) => {
  return useQuery({
    queryKey: ['raid-instances', id],
    queryFn: () => raidService.getRaidInstanceById(id),
    enabled: !!id,
  });
};

export const useRecentRaidInstances = (limit: number = 5) => {
  return useQuery({
    queryKey: ['raid-instances', 'recent', limit],
    queryFn: () => raidService.getRecentRaidInstances(limit),
  });
};

export const useRaidInstanceStats = () => {
  return useQuery({
    queryKey: ['raid-instances', 'stats'],
    queryFn: () => raidService.getRaidInstanceStats(),
  });
};

export const useCreateRaidInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRaidInstance) => raidService.createRaidInstance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['raid-instances'] });
      queryClient.invalidateQueries({ queryKey: ['raids'] });
      toast({
        title: 'Sucesso',
        description: 'Instância de raid criada com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.response?.data?.error?.message || 'Erro ao criar instância de raid',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteRaidInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => raidService.deleteRaidInstance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['raid-instances'] });
      toast({
        title: 'Sucesso',
        description: 'Instância de raid excluída com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.response?.data?.error?.message || 'Erro ao excluir instância de raid',
        variant: 'destructive',
      });
    },
  });
};

export const useDkpPreview = () => {
  return useMutation({
    mutationFn: ({ raidId, participantIds }: { raidId: string; participantIds: string[] }) =>
      raidService.previewDkpCalculation(raidId, participantIds),
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.response?.data?.error?.message || 'Erro ao calcular preview de DKP',
        variant: 'destructive',
      });
    },
  });
};

export const useAddParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ raidInstanceId, userId }: { raidInstanceId: string; userId: string }) =>
      raidService.addParticipant(raidInstanceId, userId),
    onSuccess: (_, { raidInstanceId }) => {
      queryClient.invalidateQueries({ queryKey: ['raid-instances', raidInstanceId] });
      queryClient.invalidateQueries({ queryKey: ['raid-instances'] });
      toast({
        title: 'Sucesso',
        description: 'Participante adicionado com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.response?.data?.error?.message || 'Erro ao adicionar participante',
        variant: 'destructive',
      });
    },
  });
};

export const useRemoveParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ raidInstanceId, userId }: { raidInstanceId: string; userId: string }) =>
      raidService.removeParticipant(raidInstanceId, userId),
    onSuccess: (_, { raidInstanceId }) => {
      queryClient.invalidateQueries({ queryKey: ['raid-instances', raidInstanceId] });
      queryClient.invalidateQueries({ queryKey: ['raid-instances'] });
      toast({
        title: 'Sucesso',
        description: 'Participante removido com sucesso!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.response?.data?.error?.message || 'Erro ao remover participante',
        variant: 'destructive',
      });
    },
  });
};
