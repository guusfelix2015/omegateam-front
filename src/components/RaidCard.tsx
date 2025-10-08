import { Link } from 'react-router-dom';
import {
  Edit,
  Trash2,
  Power,
  PowerOff,
  Users,
  Trophy,
  Plus,
  Calendar,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../hooks/useAuth';
import type { Raid } from '../types/api';

interface RaidCardProps {
  raid: Raid;
  onDelete?: (id: string, name: string) => void;
  onToggleStatus?: (id: string, currentStatus: boolean) => void;
  isDeleting?: boolean;
  isTogglingStatus?: boolean;
  showActions?: boolean;
  compact?: boolean;
}

export function RaidCard({
  raid,
  onDelete,
  onToggleStatus,
  isDeleting = false,
  isTogglingStatus = false,
  showActions = true,
  compact = false,
}: RaidCardProps) {
  const { isAdmin } = useAuth();

  const getBossLevelColor = (level: number) => {
    if (level >= 80) return 'bg-red-500';
    if (level >= 60) return 'bg-orange-500';
    if (level >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getBaseScoreColor = (score: number) => {
    if (score >= 800) return 'text-red-600';
    if (score >= 500) return 'text-orange-600';
    if (score >= 300) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getBossLevelDescription = (level: number) => {
    if (level >= 85) return 'Épico';
    if (level >= 80) return 'Lendário';
    if (level >= 70) return 'Difícil';
    if (level >= 60) return 'Moderado';
    if (level >= 40) return 'Fácil';
    return 'Iniciante';
  };

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary ${compact ? 'p-4' : ''}`}
    >
      <CardHeader className={compact ? 'pb-2' : 'pb-3'}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className={compact ? 'text-lg' : 'text-xl'}>
                {raid.name}
              </CardTitle>
              <Badge variant={raid.isActive ? 'default' : 'secondary'}>
                {raid.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              Criado em {new Date(raid.createdAt).toLocaleDateString('pt-BR')}
            </CardDescription>
          </div>
          {showActions && isAdmin && (
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/raids/${raid.id}/edit`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              {onToggleStatus && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleStatus(raid.id, raid.isActive)}
                  disabled={isTogglingStatus}
                >
                  {raid.isActive ? (
                    <PowerOff className="h-4 w-4" />
                  ) : (
                    <Power className="h-4 w-4" />
                  )}
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(raid.id, raid.name)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className={`space-y-4 ${compact ? 'pt-0' : ''}`}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${getBossLevelColor(raid.bossLevel)}`}
              />
              <span className="text-sm text-muted-foreground">Nível</span>
            </div>
            <p className="text-2xl font-bold">{raid.bossLevel}</p>
            <p className="text-xs text-muted-foreground">
              {getBossLevelDescription(raid.bossLevel)}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Trophy className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Score Base</span>
            </div>
            <p
              className={`text-2xl font-bold ${getBaseScoreColor(raid.baseScore)}`}
            >
              {raid.baseScore}
            </p>
            <p className="text-xs text-muted-foreground">DKP</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link to={`/raids/${raid.id}`}>
              <Users className="mr-2 h-4 w-4" />
              Ver Detalhes
            </Link>
          </Button>
          {showActions && isAdmin && raid.isActive && (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/raids/${raid.id}/instances/new`}>
                <Plus className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
