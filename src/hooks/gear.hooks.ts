/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gearService } from '../services/gear.service';
import { useToast } from './use-toast';
import type { UpdateUserGear } from '../types/api';

export const useUserGear = () => {
  return useQuery({
    queryKey: ['users', 'gear'],
    queryFn: () => gearService.getUserGear(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateUserGear = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateUserGear) => gearService.updateUserGear(data),
    onSuccess: (updatedGear) => {
      queryClient.setQueryData(['users', 'gear'], updatedGear);
      queryClient.invalidateQueries({ queryKey: ['users', 'gear'] });

      // Also invalidate user profile data since gear score is part of user
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });

      toast({
        title: "Gear atualizado!",
        description: `Seu gear score agora é ${updatedGear.gearScore}.`,
      });
    },
    onError: (error: any) => {
      console.error('Error updating gear:', error);
      toast({
        title: "Erro ao atualizar gear",
        description: error.response?.data?.error?.message || error.response?.data?.message || "Ocorreu um erro ao atualizar seu gear.",
        variant: "destructive",
      });
    },
  });
};

// Get specific user's gear (Admin only)
export const useUserGearById = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId, 'gear'],
    queryFn: () => gearService.getUserGearById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
