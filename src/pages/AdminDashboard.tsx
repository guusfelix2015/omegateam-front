import { useState, useMemo } from 'react';
import { Layout } from '../components/Layout';
import {
  useAdminOverviewStats,
  useUserAnalytics,
  useRaidAnalytics,
  useDkpAnalytics,
  useCompanyPartyStats,
  useActivityFeed,
} from '../hooks/admin-stats.hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Users, Trophy, Coins, ShoppingCart, TrendingUp, Activity } from 'lucide-react';
import { BarChartComponent } from '../components/charts/BarChartComponent';
import { PieChartComponent } from '../components/charts/PieChartComponent';
import { AreaChartComponent } from '../components/charts/AreaChartComponent';
import { LineChartComponent } from '../components/charts/LineChartComponent';
import type { UserAnalyticsFilters } from '../services/admin-stats.service';

export default function AdminDashboard() {
  const [userFilters] = useState<UserAnalyticsFilters>({});
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Memoize date filters to prevent infinite re-renders
  const dateFilters = useMemo(() => {
    const now = new Date();
    if (dateRange === '7d') {
      return {
        dateFrom: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
    } else if (dateRange === '30d') {
      return {
        dateFrom: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
    } else if (dateRange === '90d') {
      return {
        dateFrom: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }
    return {};
  }, [dateRange]);

  const { data: overview, isLoading: overviewLoading } = useAdminOverviewStats();
  const { data: userAnalytics, isLoading: userLoading } = useUserAnalytics({
    ...userFilters,
    ...dateFilters,
  });
  const { data: raidAnalytics, isLoading: raidLoading } = useRaidAnalytics(dateFilters);
  const { data: dkpAnalytics, isLoading: dkpLoading } = useDkpAnalytics(dateFilters);
  const { data: cpStats } = useCompanyPartyStats();
  const { data: activityFeed } = useActivityFeed(10);

  if (overviewLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Carregando dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">
            Visualização completa das estatísticas e métricas do sistema
          </p>
        </div>

        {/* Date Range Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setDateRange('7d')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              dateRange === '7d'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Últimos 7 dias
          </button>
          <button
            onClick={() => setDateRange('30d')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              dateRange === '30d'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Últimos 30 dias
          </button>
          <button
            onClick={() => setDateRange('90d')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              dateRange === '90d'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Últimos 90 dias
          </button>
          <button
            onClick={() => setDateRange('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              dateRange === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Todos os tempos
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.users.total || 0}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500">
                  {overview?.users.newLast30Days || 0} novos (30d)
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {overview?.users.active || 0} ativos, {overview?.users.inactive || 0} inativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Raids</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.raids.total || 0}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Activity className="h-3 w-3 text-blue-500 mr-1" />
                <span className="text-blue-500">
                  {overview?.raids.last30Days || 0} nos últimos 30d
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {overview?.raids.audited || 0} auditados, {overview?.raids.pendingAudit || 0}{' '}
                pendentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">DKP em Circulação</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview?.dkp.totalInCirculation.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Média: {overview?.dkp.averagePerPlayer.toFixed(0) || 0} DKP/jogador
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auctions</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.auctions.total || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {overview?.auctions.totalItemsSold || 0} itens vendidos
              </p>
              <p className="text-xs text-muted-foreground">
                {overview?.auctions.active || 0} ativas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Different Analytics */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="raids">Raids</TabsTrigger>
            <TabsTrigger value="dkp">DKP</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            {userLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando análises de usuários...
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <BarChartComponent
                    title="Distribuição por Nível"
                    description="Jogadores agrupados por faixa de nível"
                    data={userAnalytics?.levelDistribution || []}
                    dataKey="count"
                    xAxisKey="range"
                    color="#8b5cf6"
                    yAxisLabel="Jogadores"
                  />

                  <PieChartComponent
                    title="Distribuição por Classe"
                    description="Porcentagem de jogadores por classe"
                    data={userAnalytics?.classDistribution || []}
                    dataKey="count"
                    nameKey="name"
                    showPercentage={true}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <PieChartComponent
                    title="Tipo de Jogador"
                    description="Distribuição PVP vs PVE"
                    data={userAnalytics?.playerTypeDistribution || []}
                    dataKey="count"
                    nameKey="type"
                    colors={['#3b82f6', '#10b981']}
                    showPercentage={true}
                  />

                  <PieChartComponent
                    title="Distribuição por Clan"
                    description="CLA1 vs CLA2"
                    data={userAnalytics?.clanDistribution || []}
                    dataKey="count"
                    nameKey="clan"
                    colors={['#ef4444', '#f59e0b']}
                    showPercentage={true}
                  />
                </div>

                {/* Top Players */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top 10 - Gear Score</CardTitle>
                      <CardDescription>Jogadores com maior Gear Score</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {userAnalytics?.topPlayersByGearScore.slice(0, 10).map((player, idx) => (
                          <div
                            key={player.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-muted-foreground w-6">
                                #{idx + 1}
                              </span>
                              <div>
                                <p className="font-medium text-sm">{player.nickname}</p>
                                {player.className && (
                                  <p className="text-xs text-muted-foreground">
                                    {player.className}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className="font-bold text-purple-600">{player.gearScore}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top 10 - DKP</CardTitle>
                      <CardDescription>Jogadores com maior DKP</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {userAnalytics?.topPlayersByDkp.slice(0, 10).map((player, idx) => (
                          <div
                            key={player.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-muted-foreground w-6">
                                #{idx + 1}
                              </span>
                              <div>
                                <p className="font-medium text-sm">{player.nickname}</p>
                                {player.className && (
                                  <p className="text-xs text-muted-foreground">
                                    {player.className}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className="font-bold text-yellow-600">{player.dkpPoints}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Averages */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Gear Score Médio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {userAnalytics?.averageGearScore.toFixed(0) || 0}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">DKP Médio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {userAnalytics?.averageDkp.toFixed(0) || 0}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Nível Médio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {userAnalytics?.averageLevel.toFixed(0) || 0}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Raids Tab */}
          <TabsContent value="raids" className="space-y-4">
            {raidLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando análises de raids...
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Média de Participantes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {raidAnalytics?.averageParticipantsPerRaid.toFixed(1) || 0}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Taxa de Confirmação</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {raidAnalytics?.attendanceConfirmationRate.toFixed(1) || 0}%
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">DKP Médio por Raid</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {raidAnalytics?.averageDkpPerRaid.toFixed(0) || 0}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <AreaChartComponent
                  title="Atividade de Raids ao Longo do Tempo"
                  description="Número de raids realizados por dia"
                  data={raidAnalytics?.raidTrends || []}
                  dataKey="count"
                  xAxisKey="date"
                  color="#3b82f6"
                  yAxisLabel="Raids"
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Raids Mais Populares</CardTitle>
                      <CardDescription>Top 5 raids por número de execuções</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {raidAnalytics?.mostPopularRaids.map((raid) => (
                          <div
                            key={raid.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
                          >
                            <div>
                              <p className="font-medium text-sm">{raid.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {raid.totalParticipants} participantes totais
                              </p>
                            </div>
                            <span className="font-bold text-blue-600">{raid.instanceCount}x</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <LineChartComponent
                    title="DKP Distribuído por Dia"
                    description="Total de DKP distribuído em raids"
                    data={raidAnalytics?.raidTrends || []}
                    dataKey="dkpDistributed"
                    xAxisKey="date"
                    color="#f59e0b"
                    yAxisLabel="DKP"
                  />
                </div>
              </>
            )}
          </TabsContent>

          {/* DKP Tab */}
          <TabsContent value="dkp" className="space-y-4">
            {dkpLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando análises de DKP...
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <LineChartComponent
                    title="Tendência de DKP"
                    description="DKP distribuído ao longo do tempo"
                    data={dkpAnalytics?.dkpTrends || []}
                    dataKey="totalAmount"
                    xAxisKey="date"
                    color="#10b981"
                    yAxisLabel="DKP"
                  />

                  <BarChartComponent
                    title="Distribuição de DKP"
                    description="Número de jogadores por faixa de DKP"
                    data={dkpAnalytics?.dkpDistributionHistogram || []}
                    dataKey="count"
                    xAxisKey="range"
                    color="#ef4444"
                    yAxisLabel="Jogadores"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Transações por Tipo</CardTitle>
                      <CardDescription>Distribuição de tipos de transação</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {dkpAnalytics?.transactionsByType.map((transaction) => (
                          <div
                            key={transaction.type}
                            className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
                          >
                            <div>
                              <p className="font-medium text-sm">{transaction.type}</p>
                              <p className="text-xs text-muted-foreground">
                                {transaction.count} transações
                              </p>
                            </div>
                            <span className="font-bold text-green-600">
                              {transaction.totalAmount.toLocaleString()} DKP
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top 10 - DKP Holders</CardTitle>
                      <CardDescription>Jogadores com mais DKP</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {dkpAnalytics?.topDkpHolders.slice(0, 10).map((player, idx) => (
                          <div
                            key={player.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-muted-foreground w-6">
                                #{idx + 1}
                              </span>
                              <div>
                                <p className="font-medium text-sm">{player.nickname}</p>
                                {player.className && (
                                  <p className="text-xs text-muted-foreground">
                                    {player.className}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className="font-bold text-yellow-600">{player.dkpPoints}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Últimas 10 atividades no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityFeed?.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          activity.type === 'raid'
                            ? 'bg-blue-500/20 text-blue-500'
                            : activity.type === 'auction'
                            ? 'bg-purple-500/20 text-purple-500'
                            : activity.type === 'user'
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}
                      >
                        {activity.type === 'raid' ? (
                          <Trophy className="h-4 w-4" />
                        ) : activity.type === 'auction' ? (
                          <ShoppingCart className="h-4 w-4" />
                        ) : activity.type === 'user' ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          <Coins className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(activity.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Company Party Stats */}
            {cpStats && (
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas de Company Parties</CardTitle>
                  <CardDescription>
                    {cpStats.totalParties} CPs com {cpStats.totalMembers} membros totais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Média de {cpStats.averageMembersPerParty.toFixed(1)} membros por CP
                  </p>
                  <div className="space-y-2">
                    {cpStats.parties.map((party) => (
                      <div
                        key={party.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
                      >
                        <div>
                          <p className="font-medium text-sm">{party.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {party.memberCount} membros
                          </p>
                        </div>
                        <div className="text-right text-xs">
                          <p className="text-muted-foreground">
                            GS Médio: {party.averageGearScore.toFixed(0)}
                          </p>
                          <p className="text-muted-foreground">
                            DKP Médio: {party.averageDkp.toFixed(0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
