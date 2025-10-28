import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { User } from '@/types/api';

export interface InactivityStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersNeverLoggedIn: number;
  potentiallyInactiveUsers: number;
}

export interface InactiveUser {
  id: string;
  email: string;
  name: string;
  lastLoginAt: string | null;
}

export interface LastLoginInfo {
  lastLoginAt: string | null;
  daysSinceLastLogin: number | null;
}

/**
 * Hook para obter estatísticas de inatividade de usuários
 * Apenas ADMIN pode acessar
 */
export function useInactivityStats() {
  return useQuery<InactivityStats>({
    queryKey: ['inactivity-stats'],
    queryFn: async () => {
      const response = await api.get('/users/inactivity/stats');
      return response.data;
    },
    staleTime: 0, // 5 minutos
  });
}

/**
 * Hook para obter lista de usuários inativos
 * Apenas ADMIN pode acessar
 */
export function useInactiveUsersList(days: number = 7) {
  return useQuery<{ users: InactiveUser[]; count: number }>({
    queryKey: ['inactive-users', days],
    queryFn: async () => {
      const response = await api.get('/users/inactivity/list', {
        params: { days },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook para obter informações de último login de um usuário
 * Usuário pode ver suas próprias informações, ADMIN pode ver de qualquer um
 */
export function useUserLastLogin(userId: string) {
  return useQuery<LastLoginInfo>({
    queryKey: ['user-last-login', userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}/last-login`);
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para reativar um usuário inativo
 * Apenas ADMIN pode fazer isso
 */
export function useReactivateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, string>({
    mutationFn: async (userId: string) => {
      const response = await api.post(`/users/${userId}/reactivate`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidar caches relacionados
      queryClient.invalidateQueries({ queryKey: ['inactivity-stats'] });
      queryClient.invalidateQueries({ queryKey: ['inactive-users'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Função auxiliar para formatar dias desde último login
 */
export function formatDaysSinceLogin(daysSinceLastLogin: number | null): string {
  if (daysSinceLastLogin === null) {
    return 'Nunca fez login';
  }

  if (daysSinceLastLogin === 0) {
    return 'Hoje';
  }

  if (daysSinceLastLogin === 1) {
    return 'Ontem';
  }

  if (daysSinceLastLogin < 7) {
    return `${daysSinceLastLogin} dias atrás`;
  }

  if (daysSinceLastLogin < 30) {
    const weeks = Math.floor(daysSinceLastLogin / 7);
    return `${weeks} semana${weeks > 1 ? 's' : ''} atrás`;
  }

  const months = Math.floor(daysSinceLastLogin / 30);
  return `${months} mês${months > 1 ? 'es' : ''} atrás`;
}

/**
 * Função auxiliar para determinar status de atividade
 */
export function getActivityStatus(
  isActive: boolean,
  daysSinceLastLogin: number | null
): 'active' | 'inactive' | 'never-logged' {
  if (!isActive) {
    return 'inactive';
  }

  if (daysSinceLastLogin === null) {
    return 'never-logged';
  }

  return 'active';
}

/**
 * Função auxiliar para obter cor de status
 */
export function getActivityStatusColor(
  status: 'active' | 'inactive' | 'never-logged'
): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-red-100 text-red-800';
    case 'never-logged':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Função auxiliar para obter label de status
 */
export function getActivityStatusLabel(
  status: 'active' | 'inactive' | 'never-logged'
): string {
  switch (status) {
    case 'active':
      return 'Ativo';
    case 'inactive':
      return 'Inativo';
    case 'never-logged':
      return 'Nunca fez login';
    default:
      return 'Desconhecido';
  }
}

