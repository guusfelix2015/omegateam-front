/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  Trophy,
  TrendingUp,
  Calendar,
  Coins,
  Award,
  History,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  useMyDkpSummary,
  useMyDkpHistory,
  useRefreshDkpData,
} from '../hooks/dkp.hooks';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/Layout';
import type { DkpTransactionType } from '../types/api';
import type { DkpHistoryQuery } from '@/services/dkp.service';

export default function DkpProfile() {
  const { user } = useAuth();
  const [historyQuery, setHistoryQuery] = useState<DkpHistoryQuery>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data: summary, isLoading: isLoadingSummary } = useMyDkpSummary();
  const { data: history, isLoading: isLoadingHistory } =
    useMyDkpHistory(historyQuery);
  const refreshData = useRefreshDkpData();

  const handleFilterChange = (key: keyof DkpHistoryQuery, value: any) => {
    setHistoryQuery((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage: number) => {
    setHistoryQuery((prev) => ({ ...prev, page: newPage }));
  };

  const getTransactionTypeColor = (type: DkpTransactionType) => {
    switch (type) {
      case 'RAID_REWARD':
        return 'bg-green-500';
      case 'MANUAL_ADJUSTMENT':
        return 'bg-blue-500';
      case 'ITEM_PURCHASE':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTransactionTypeLabel = (type: DkpTransactionType) => {
    switch (type) {
      case 'RAID_REWARD':
        return 'Recompensa de Raid';
      case 'MANUAL_ADJUSTMENT':
        return 'Ajuste Manual';
      case 'ITEM_PURCHASE':
        return 'Compra de Item';
      default:
        return type;
    }
  };

  if (isLoadingSummary) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando perfil DKP...</span>
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
              <Trophy className="h-8 w-8 text-yellow-600" />
              Meu Perfil DKP
            </h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe seus pontos DKP e histórico de atividades
            </p>
          </div>
          <Button onClick={refreshData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>

        {/* DKP Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Coins className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">DKP Atual</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {summary?.currentDkpPoints || 0}
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
                  <p className="text-sm text-muted-foreground">Total Ganho</p>
                  <p className="text-2xl font-bold text-green-600">
                    {summary?.totalEarned || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Award className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Raids Participados
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {summary?.raidParticipations || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Última Atividade
                  </p>
                  <p className="text-sm font-semibold">
                    {summary?.lastActivity
                      ? new Date(summary.lastActivity).toLocaleDateString(
                          'pt-BR'
                        )
                      : 'Nunca'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas Detalhadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">DKP de Raids:</span>
                <span className="font-semibold text-green-600">
                  +{summary?.totalRaidRewards || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ajustes Manuais:</span>
                <span className="font-semibold text-blue-600">
                  {summary?.totalManualAdjustments || 0 > 0 ? '+' : ''}
                  {summary?.totalManualAdjustments || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">DKP Gasto:</span>
                <span className="font-semibold text-red-600">
                  -{summary?.totalSpent || 0}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">
                    Saldo Final:
                  </span>
                  <span className="font-bold text-lg text-yellow-600">
                    {summary?.currentDkpPoints || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Jogador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.avatar || undefined} />
                  <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.nickname}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nível:</span>
                  <span className="font-semibold">{user?.lvl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gear Score:</span>
                  <span className="font-semibold">{user?.gearScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Classe:</span>
                  <span className="font-semibold">
                    {user?.classe?.name || 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Histórico de Transações
                </CardTitle>
                <CardDescription>
                  Todas as suas transações DKP em ordem cronológica
                </CardDescription>
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <Select
                  value={historyQuery.type || 'all'}
                  onValueChange={(value) =>
                    handleFilterChange(
                      'type',
                      value === 'all' ? undefined : value
                    )
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="RAID_REWARD">Raids</SelectItem>
                    <SelectItem value="MANUAL_ADJUSTMENT">Ajustes</SelectItem>
                    <SelectItem value="ITEM_PURCHASE">Compras</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : !history?.data || history.data.length === 0 ? (
              <div className="text-center py-8">
                <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma transação encontrada
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.data.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 rounded-full ${getTransactionTypeColor(transaction.type)}`}
                      />
                      <div>
                        <p className="font-semibold">{transaction.reason}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {getTransactionTypeLabel(transaction.type)}
                          </Badge>
                          <span>•</span>
                          <span>
                            {new Date(transaction.createdAt).toLocaleDateString(
                              'pt-BR'
                            )}
                          </span>
                          {transaction.raidInstance && (
                            <>
                              <span>•</span>
                              <span>{transaction.raidInstance.raid.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          transaction.amount > 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.amount > 0 ? '+' : ''}
                        {transaction.amount}
                      </p>
                      <p className="text-xs text-muted-foreground">DKP</p>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {history.pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(historyQuery.page! - 1)}
                      disabled={!history.pagination.hasPrev}
                    >
                      Anterior
                    </Button>
                    <span className="flex items-center px-3 text-sm">
                      Página {history.pagination.page} de{' '}
                      {history.pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(historyQuery.page! + 1)}
                      disabled={!history.pagination.hasNext}
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
    </Layout>
  );
}
