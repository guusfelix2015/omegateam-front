import { Link } from 'react-router-dom';
import {
  Swords,
  Trophy,
  Calendar,
  Target,
  Plus,
  Loader2,
  Clock,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  useRaidStats,
  useRaidInstanceStats,
  useActiveRaids,
  useRecentRaidInstances,
} from '../hooks/raids.hooks';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/Layout';

export default function RaidsDashboard() {
  const { isAdmin } = useAuth();

  const { data: raidStats, isLoading: isLoadingRaidStats } = useRaidStats();
  const { data: instanceStats, isLoading: isLoadingInstanceStats } =
    useRaidInstanceStats();
  const { data: activeRaids, isLoading: isLoadingActiveRaids } =
    useActiveRaids();
  const { data: recentInstances, isLoading: isLoadingRecentInstances } =
    useRecentRaidInstances(5);

  const isLoading =
    isLoadingRaidStats ||
    isLoadingInstanceStats ||
    isLoadingActiveRaids ||
    isLoadingRecentInstances;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando dashboard...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Swords className="h-8 w-8 text-primary" />
              Dashboard de Raids
            </h1>
            <p className="text-muted-foreground mt-1">
              Visão geral das atividades de raid e distribuição de DKP
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/raids">
                <Swords className="mr-2 h-4 w-4" />
                Ver Todos os Raids
              </Link>
            </Button>
            {isAdmin && (
              <Button asChild>
                <Link to="/raids/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Raid
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Swords className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total de Raids
                  </p>
                  <p className="text-2xl font-bold">{raidStats?.total || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Raids Ativos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {raidStats?.active || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Execuções</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {instanceStats?.total || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    DKP Distribuído
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {instanceStats?.totalDkpAwarded || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Active Raids */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Raids Ativos
              </CardTitle>
              <CardDescription>Raids disponíveis para execução</CardDescription>
            </CardHeader>
            <CardContent>
              {!activeRaids || activeRaids.length === 0 ? (
                <div className="text-center py-8">
                  <Swords className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum raid ativo</p>
                  {isAdmin && (
                    <Button asChild className="mt-4" size="sm">
                      <Link to="/raids/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Primeiro Raid
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {activeRaids.slice(0, 5).map((raid) => (
                    <div
                      key={raid.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{raid.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Nível {raid.bossLevel} • Score Base: {raid.baseScore}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/raids/${raid.id}`}>Ver</Link>
                        </Button>
                        {isAdmin && (
                          <Button size="sm" asChild>
                            <Link to={`/raids/${raid.id}/instances/new`}>
                              <Plus className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {activeRaids.length > 5 && (
                    <div className="text-center pt-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/raids">
                          Ver todos os {activeRaids.length} raids ativos
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Instances */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Execuções Recentes
              </CardTitle>
              <CardDescription>
                Últimas instâncias de raid executadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!recentInstances || recentInstances.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Nenhuma execução recente
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentInstances.map((instance) => (
                    <div
                      key={instance.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <div>
                          <p className="font-semibold">{instance.raid.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(instance.completedAt).toLocaleDateString(
                              'pt-BR'
                            )}{' '}
                            •{instance.participants.length} participantes
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          DKP Total
                        </p>
                        <p className="font-bold text-yellow-600">
                          {instance.participants.reduce(
                            (sum, p) => sum + p.dkpAwarded,
                            0
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Nível Médio dos Bosses:
                </span>
                <span className="font-semibold">
                  {Math.round(raidStats?.averageBossLevel || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Score Base Médio:</span>
                <span className="font-semibold">
                  {Math.round(raidStats?.averageBaseScore || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Participantes Totais:
                </span>
                <span className="font-semibold">
                  {instanceStats?.totalParticipants || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Média de Participantes:
                </span>
                <span className="font-semibold">
                  {Math.round(instanceStats?.averageParticipantsPerRaid || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  DKP Médio por Raid:
                </span>
                <span className="font-semibold">
                  {Math.round(instanceStats?.averageDkpPerRaid || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Taxa de Atividade:
                </span>
                <span className="font-semibold">
                  {raidStats?.total
                    ? Math.round((raidStats.active / raidStats.total) * 100)
                    : 0}
                  %
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full justify-start"
              >
                <Link to="/raids">
                  <Swords className="mr-2 h-4 w-4" />
                  Gerenciar Raids
                </Link>
              </Button>
              {isAdmin && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full justify-start"
                  >
                    <Link to="/raids/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Novo Raid
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
