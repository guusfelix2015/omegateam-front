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

      authService.setToken(data.token);

      try {
        const user = await authService.getCurrentUser();

        queryClient.setQueryData(['auth', 'user'], user);
        await queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });

      } catch (error) {
        authService.removeToken();
        throw error;
      }

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
    mutationFn: async () => {
      authService.removeToken();

      queryClient.clear();

      try {
        await authService.logout();
      } catch (error) {
        console.error('Error logging out:', error);
      }
    },
    onSuccess: () => {
      toast({
        title: "Logout realizado com sucesso!",
        description: "Até logo!",
      });
    },
    onError: () => {
      authService.removeToken();
      queryClient.clear();

      toast({
        title: "Logout realizado",
        description: "Sessão encerrada",
      });
    },
  });
};

export const useCurrentUser = () => {
  const token = authService.getToken();

  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => authService.getCurrentUser(),
    enabled: !!token,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount if data exists and is fresh
    refetchOnReconnect: false,
    networkMode: 'online', // Only fetch when online
  });
};

export const useAuthState = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  const hasToken = !!authService.getToken();

  const isAuthError = error?.response?.status === 401 || error?.response?.status === 404;
  const isAuthenticated = !!user && hasToken && !error && !isAuthError;

  if (isAuthError && hasToken) {
    console.log('Invalid token detected, clearing...');
    authService.removeToken();
  }

  return {
    user: isAuthError ? undefined : user,
    isAuthenticated,
    isLoading: isAuthError ? false : isLoading,
    error: isAuthError ? null : error,
    isAdmin: user?.role === 'ADMIN',
    isPlayer: user?.role === 'PLAYER' || user?.role === 'CP_LEADER',
    isCPLeader: user?.role === 'CP_LEADER',
  };
};
