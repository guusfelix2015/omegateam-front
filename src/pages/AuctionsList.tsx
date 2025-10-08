/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gavel,
  Loader2,
  Calendar,
  Clock,
  Trophy,
  Plus,
  Play,
  X,
  RefreshCw,
} from 'lucide-react';
import {
  useAuctions,
  useStartAuction,
  useCancelAuction,
} from '../hooks/auction.hooks';
import { Layout } from '../components/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../hooks/useAuth';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente',
  ACTIVE: 'Ativo',
  FINISHED: 'Finalizado',
  CANCELLED: 'Cancelado',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500',
  ACTIVE: 'bg-green-500',
  FINISHED: 'bg-red-500',
  CANCELLED: 'bg-gray-500',
};

export default function AuctionsList() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [currentPage] = useState(1);
  const {
    data: auctionsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useAuctions({
    page: currentPage,
    limit: 20,
  });

  const startAuctionMutation = useStartAuction();
  const cancelAuctionMutation = useCancelAuction();

  const handleRefresh = async () => {
    await refetch();
  };

  const handleStartAuction = async (auctionId: string) => {
    if (window.confirm('Tem certeza que deseja iniciar este leilão?')) {
      try {
        await startAuctionMutation.mutateAsync(auctionId);
      } catch (error) {
        console.error('Failed to start auction:', error);
      }
    }
  };

  const handleCancelAuction = async (auctionId: string) => {
    if (window.confirm('Tem certeza que deseja cancelar este leilão?')) {
      try {
        await cancelAuctionMutation.mutateAsync(auctionId);
      } catch (error) {
        console.error('Failed to cancel auction:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando leilões...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-destructive">Erro ao carregar leilões</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
        </div>
      </Layout>
    );
  }

  const auctions = auctionsData?.data || [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Gavel className="h-8 w-8 text-primary" />
              Leilões
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie todos os leilões da CP
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefetching}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`}
              />
              Atualizar
            </Button>
            {isAdmin && (
              <Button onClick={() => navigate('/dropped-items')}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Leilão
              </Button>
            )}
          </div>
        </div>

        {/* Auctions List */}
        {auctions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Gavel className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Nenhum leilão encontrado
                </h3>
                <p className="text-muted-foreground mb-4">
                  Ainda não há leilões criados.
                </p>
                {isAdmin && (
                  <Button onClick={() => navigate('/dropped-items')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Leilão
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {auctions.map((auction: any) => (
              <Card key={auction.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Leilão #{auction.id.slice(-8)}
                        <Badge
                          className={`${STATUS_COLORS[auction.status]} text-white`}
                        >
                          {STATUS_LABELS[auction.status]}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(auction.createdAt).toLocaleDateString(
                            'pt-BR'
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Timer: {auction.defaultTimerSeconds}s
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          Incremento: {auction.minBidIncrement} DKP
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {auction.status === 'PENDING' && isAdmin && (
                        <Button
                          size="sm"
                          onClick={() => handleStartAuction(auction.id)}
                          disabled={startAuctionMutation.isPending}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Iniciar
                        </Button>
                      )}
                      {auction.status === 'ACTIVE' && (
                        <Button
                          size="sm"
                          onClick={() => navigate('/auctions/active')}
                        >
                          <Gavel className="h-4 w-4 mr-2" />
                          Ver Leilão
                        </Button>
                      )}
                      {auction.status === 'FINISHED' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/auctions/${auction.id}`)}
                        >
                          Ver Detalhes
                        </Button>
                      )}
                      {(auction.status === 'PENDING' ||
                        auction.status === 'ACTIVE') &&
                        isAdmin && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancelAuction(auction.id)}
                            disabled={cancelAuctionMutation.isPending}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                          </Button>
                        )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total de Itens:
                      </span>
                      <span className="font-medium">
                        {auction.items?.length || 0}
                      </span>
                    </div>
                    {auction.notes && (
                      <p className="text-sm text-muted-foreground italic">
                        "{auction.notes}"
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
