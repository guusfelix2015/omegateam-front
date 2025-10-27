/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settings.service';
import { useToast } from './use-toast';

export const useGetAllSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await settingsService.getAllSettings();
      return response.data;
    },
  });
};

export const useGetSettingByKey = (key: string) => {
  return useQuery({
    queryKey: ['settings', key],
    queryFn: () => settingsService.getSettingByKey(key),
    enabled: !!key,
  });
};

export const useCreateSetting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      settingsService.createSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: 'Sucesso',
        description: 'Configuração criada com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description:
          error.response?.data?.error?.message || 'Erro ao criar configuração',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      settingsService.updateSetting(key, value),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings', data.key] });
      toast({
        title: 'Sucesso',
        description: 'Configuração atualizada com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description:
          error.response?.data?.error?.message || 'Erro ao atualizar configuração',
        variant: 'destructive',
      });
    },
  });
};

export const useUpsertSetting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      settingsService.upsertSetting(key, value),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings', data.key] });
      toast({
        title: 'Sucesso',
        description: 'Configuração salva com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description:
          error.response?.data?.error?.message || 'Erro ao salvar configuração',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteSetting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (key: string) => settingsService.deleteSetting(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: 'Sucesso',
        description: 'Configuração deletada com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description:
          error.response?.data?.error?.message || 'Erro ao deletar configuração',
        variant: 'destructive',
      });
    },
  });
};

