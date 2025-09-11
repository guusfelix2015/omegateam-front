import { useQuery } from '@tanstack/react-query';
import { usersService, type UsersQuery } from '../services/users.service';

export const useUsers = (query: UsersQuery = {}) => {
  return useQuery({
    queryKey: ['users', query],
    queryFn: () => usersService.getAll(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
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
    enabled: !!id,
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => usersService.getMe(),
  });
};
