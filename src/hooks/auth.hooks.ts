/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { type LoginRequest } from '../types/api';
import { useToast } from './use-toast';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: async (data) => {
      console.log('Login successful, token received:', data.token);

      // Store token
      authService.setToken(data.token);

      // Fetch user data immediately and cache it
      try {
        console.log('Fetching user data...');
        const user = await authService.getCurrentUser();
        console.log('User data fetched:', user);

        // Set the data directly and invalidate to trigger refetch
        queryClient.setQueryData(['auth', 'user'], user);
        await queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });

        console.log('User data cached and queries invalidated');
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // If user fetch fails, remove the token
        authService.removeToken();
        throw error;
      }

      // Show success message
      toast({
        title: "Login realizado com sucesso!",
        description: data.message || "Login realizado com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      toast({
        title: "Erro no login",
        description: error.response?.data?.message || "Credenciais inválidas",
        variant: "destructive",
      });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Remove token
      authService.removeToken();

      // Clear all cached data
      queryClient.clear();

      toast({
        title: "Logout realizado com sucesso!",
        description: "Até logo!",
      });
    },
    onError: () => {
      // Even if logout fails on server, clear local data
      authService.removeToken();
      queryClient.clear();
    },
  });
};

export const useCurrentUser = () => {
  const token = authService.getToken();

  return useQuery({
    queryKey: ['auth', 'user', token], // Include token in query key for reactivity
    queryFn: () => authService.getCurrentUser(),
    enabled: !!token,
    retry: (failureCount, error: any) => {
      // Don't retry if it's an auth error
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useAuthState = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  const hasToken = !!authService.getToken();
  const isAuthenticated = !!user && hasToken && !error;

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isAdmin: user?.role === 'ADMIN',
    isPlayer: user?.role === 'PLAYER',
  };
};
