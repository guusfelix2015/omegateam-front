import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  TrendingUp,
  Users,
  Award,
  Crown,
  Target,
  Search,
  Loader2,
  RefreshCw,
  Plus,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useDkpLeaderboard, useDkpStats, useMyDkpSummary, useRefreshDkpData } from '../hooks/dkp.hooks';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/Layout';
import { useDebounce } from '../hooks/useDebounce';
import type { DkpLeaderboardQuery } from '@/services/dkp.service';

export default function DkpDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [leaderboardQuery, setLeaderboardQuery] = useState<DkpLeaderboardQuery>({
    page: 1,
    limit: 10,
    sortOrder: 'desc',
  });

  const debouncedSearch = useDebounce(searchTerm, 300);
  const refreshData = useRefreshDkpData();

  const { data: stats } = useDkpStats();
  const { data: myDkpSummary, isLoading: isLoadingMySummary } = useMyDkpSummary();
  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useDkpLeaderboard({
    ...leaderboardQuery,
    search: debouncedSearch || undefined,
  });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setLeaderboardQuery(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setLeaderboardQuery(prev => ({ ...prev, page: newPage }));
  };

  const handlePlayerClick = (playerId: string) => {
    if (isAdmin) {
      navigate(`/members/${playerId}`);
    }
  };

  const getUserRank = () => {
    if (!leaderboard?.data || !user) return null;
    const userIndex = leaderboard.data.findIndex(entry => entry.id === user.id);
    return userIndex >= 0 ? userIndex + 1 : null;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-600" />
              Dashboard DKP
            </h1>
            <p className="text-muted-foreground mt-1">
              Ranking e estatísticas do sistema Dragon Kill Points
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/dkp/profile">
                <Award className="mr-2 h-4 w-4" />
                Meu Perfil
              </Link>
            </Button>
            {isAdmin && (
              <Button variant="outline" asChild>
                <Link to="/dkp/admin">
                  <Plus className="mr-2 h-4 w-4" />
                  Gerenciar DKP
                </Link>
              </Button>
            )}
            <Button onClick={refreshData} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">DKP Total Distribuído</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats?.totalDkpAwarded || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Transações Totais</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats?.totalTransactions || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">DKP Médio por Usuário</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(stats?.averageDkpPerUser || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Crown className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Líder Atual</p>
                  <p className="text-lg font-bold text-purple-600">
                    {stats?.topDkpHolder?.nickname || 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats?.topDkpHolder?.dkpPoints || 0} DKP
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* My DKP Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-yellow-600" />
                Meu DKP
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingMySummary ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-600">
                      {myDkpSummary?.currentDkpPoints || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">DKP Atual</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Ganho:</span>
                      <span className="font-semibold text-green-600">
                        +{myDkpSummary?.totalEarned || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Raids Participados:</span>
                      <span className="font-semibold">
                        {myDkpSummary?.raidParticipations || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Minha Posição:</span>
                      <span className="font-semibold">
                        {getUserRank() ? `#${getUserRank()}` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <Button asChild className="w-full" variant="outline">
                    <Link to="/dkp/profile">
                      Ver Perfil Completo
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* DKP Leaderboard */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-purple-600" />
                    Ranking DKP
                  </CardTitle>
                  <CardDescription>
                    Top jogadores por pontos DKP
                    {isAdmin && (
                      <span className="block text-xs text-primary mt-1">
                        Clique em um jogador para ver detalhes
                      </span>
                    )}
                  </CardDescription>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar jogador..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingLeaderboard ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : !leaderboard?.data || leaderboard.data.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Nenhum jogador encontrado' : 'Nenhum dado disponível'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.data.map((entry, index) => {
                    const position = (leaderboard.pagination.page - 1) * leaderboard.pagination.limit + index + 1;
                    const isCurrentUser = entry.id === user?.id;

                    return (
                      <div
                        key={entry.id}
                        onClick={() => handlePlayerClick(entry.id)}
                        className={`flex items-center justify-between p-4 rounded-lg transition-colors ${isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'bg-muted'
                          } ${isAdmin ? 'cursor-pointer hover:bg-muted/80' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${position === 1 ? 'bg-yellow-500 text-white' :
                            position === 2 ? 'bg-gray-400 text-white' :
                              position === 3 ? 'bg-amber-600 text-white' :
                                'bg-muted-foreground text-white'
                            }`}>
                            {position}
                          </div>

                          <Avatar className="h-10 w-10">
                            <AvatarImage src={entry.avatar || undefined} />
                            <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                          </Avatar>

                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{entry.name}</p>
                              {isCurrentUser && (
                                <Badge variant="outline" className="text-xs">
                                  Você
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {entry.nickname} • Lvl {entry.lvl} • GS: {entry.gearScore}
                            </p>
                            {entry.classe && (
                              <p className="text-xs text-muted-foreground">
                                {entry.classe.name}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-lg font-bold text-yellow-600">
                              {entry.dkpPoints}
                            </p>
                            <p className="text-xs text-muted-foreground">DKP</p>
                          </div>
                          {isAdmin && (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Pagination */}
                  {leaderboard.pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(leaderboardQuery.page! - 1)}
                        disabled={!leaderboard.pagination.hasPrev}
                      >
                        Anterior
                      </Button>
                      <span className="flex items-center px-3 text-sm">
                        Página {leaderboard.pagination.page} de {leaderboard.pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(leaderboardQuery.page! + 1)}
                        disabled={!leaderboard.pagination.hasNext}
                      >
                        Próxima
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" asChild className="h-auto p-4">
                <Link to="/raids">
                  <div className="text-center">
                    <Award className="mx-auto h-6 w-6 mb-2" />
                    <p className="font-semibold">Ver Raids</p>
                    <p className="text-xs text-muted-foreground">Participar de raids para ganhar DKP</p>
                  </div>
                </Link>
              </Button>

              <Button variant="outline" asChild className="h-auto p-4">
                <Link to="/dkp/profile">
                  <div className="text-center">
                    <Trophy className="mx-auto h-6 w-6 mb-2" />
                    <p className="font-semibold">Meu Histórico</p>
                    <p className="text-xs text-muted-foreground">Ver todas as transações DKP</p>
                  </div>
                </Link>
              </Button>

              {isAdmin && (
                <Button variant="outline" asChild className="h-auto p-4">
                  <Link to="/dkp/admin">
                    <div className="text-center">
                      <Plus className="mx-auto h-6 w-6 mb-2" />
                      <p className="font-semibold">Gerenciar DKP</p>
                      <p className="text-xs text-muted-foreground">Fazer ajustes manuais</p>
                    </div>
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
