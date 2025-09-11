import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService, type UsersQuery, type CreateUserData, type UpdateUserData } from '../services/users.service';
import { useToast } from './use-toast';
import { type User } from '../types/api';

export const useUsers = (query: UsersQuery = {}) => {
  return useQuery({
    queryKey: ['users', query],
    queryFn: () => usersService.getAll(query),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: ['users', 'stats'],
    queryFn: () => usersService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersService.getById(id),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserData) => usersService.create(data),
    onSuccess: () => {
      // Invalidate users list and stats
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) => usersService.update(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific user and users list
      queryClient.invalidateQueries({ queryKey: ['users', id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => usersService.getMe(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Partial<User>) => usersService.updateProfile(data),
    onSuccess: (updatedUser) => {
      // Update the cached user data
      queryClient.setQueryData(['users', 'me'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });

      // Also invalidate auth cache to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.response?.data?.message || "Ocorreu um erro ao atualizar suas informações.",
        variant: "destructive",
      });
    },
  });
};
