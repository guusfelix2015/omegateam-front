import {
  formatDaysSinceLogin,
  getActivityStatus,
  getActivityStatusColor,
  getActivityStatusLabel,
} from '@/hooks/useUserInactivity';
import type { User } from '@/types/api';

interface UserInactivityStatusProps {
  user: User;
  showLabel?: boolean;
  showDays?: boolean;
  className?: string;
}

/**
 * Componente para exibir status de inatividade de um usuário
 * Mostra um badge com a cor e texto apropriados
 */
export function UserInactivityStatus({
  user,
  showLabel = true,
  showDays = true,
  className = '',
}: UserInactivityStatusProps) {
  const daysSinceLastLogin = user.lastLoginAt
    ? Math.ceil(
      (new Date().getTime() - new Date(user.lastLoginAt).getTime()) /
      (1000 * 60 * 60 * 24)
    )
    : null;

  const status = getActivityStatus(user.isActive, daysSinceLastLogin);
  const statusColor = getActivityStatusColor(status);
  const statusLabel = getActivityStatusLabel(status);
  const daysLabel = formatDaysSinceLogin(daysSinceLastLogin);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
        {showLabel && statusLabel}
        {showDays && showLabel && ' - '}
        {showDays && daysLabel}
      </div>
    </div>
  );
}

interface UserLastLoginDisplayProps {
  lastLoginAt: string | null;
  className?: string;
}

/**
 * Componente para exibir apenas a data de último login
 */
export function UserLastLoginDisplay({
  lastLoginAt,
  className = '',
}: UserLastLoginDisplayProps) {
  if (!lastLoginAt) {
    return (
      <span className={`text-gray-500 text-sm ${className}`}>
        Nunca fez login
      </span>
    );
  }

  const date = new Date(lastLoginAt);
  const formatted = date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <span className={`text-gray-700 text-sm ${className}`}>
      {formatted}
    </span>
  );
}

interface InactivityWarningProps {
  user: User;
  inactiveDaysThreshold?: number;
}

/**
 * Componente para exibir aviso de inatividade
 * Mostra um alerta se o usuário está próximo de ser marcado como inativo
 */
export function InactivityWarning({
  user,
  inactiveDaysThreshold = 7,
}: InactivityWarningProps) {
  if (!user.lastLoginAt || !user.isActive) {
    return null;
  }

  const daysSinceLastLogin = Math.ceil(
    (new Date().getTime() - new Date(user.lastLoginAt).getTime()) /
    (1000 * 60 * 60 * 24)
  );

  const daysUntilInactive = inactiveDaysThreshold - daysSinceLastLogin;

  if (daysUntilInactive <= 0) {
    return null; // Usuário já deveria estar inativo
  }

  if (daysUntilInactive <= 2) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
        ⚠️ Atenção: Você será marcado como inativo em {daysUntilInactive} dia
        {daysUntilInactive > 1 ? 's' : ''} se não fizer login.
      </div>
    );
  }

  return null;
}

interface InactivityStatsCardProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    usersNeverLoggedIn: number;
    potentiallyInactiveUsers: number;
  };
}

/**
 * Componente para exibir estatísticas de inatividade
 */
export function InactivityStatsCard({ stats }: InactivityStatsCardProps) {
  const activePercentage = stats.totalUsers > 0
    ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Estatísticas de Inatividade</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total de Usuários</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Usuários Ativos</p>
          <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
          <p className="text-xs text-gray-500 mt-1">{activePercentage}%</p>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Usuários Inativos</p>
          <p className="text-2xl font-bold text-red-600">{stats.inactiveUsers}</p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Potencialmente Inativos</p>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.potentiallyInactiveUsers}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Nunca Fizeram Login</p>
          <p className="text-2xl font-bold text-gray-600">
            {stats.usersNeverLoggedIn}
          </p>
        </div>
      </div>
    </div>
  );
}

