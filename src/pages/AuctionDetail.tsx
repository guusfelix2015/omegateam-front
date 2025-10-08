import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Trophy,
  Coins,
  User,
  CheckCircle,
  XCircle,
} from 'lucide-react';
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
import { useAuction } from '../hooks/auction.hooks';

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

const ITEM_STATUS_LABELS: Record<string, string> = {
  WAITING: 'Aguardando',
  IN_AUCTION: 'Em Leilão',
  SOLD: 'Vendido',
  NO_BIDS: 'Sem Lances',
  CANCELLED: 'Cancelado',
};

const ITEM_STATUS_COLORS: Record<string, string> = {
  WAITING: 'bg-gray-500',
  IN_AUCTION: 'bg-blue-500',
  SOLD: 'bg-green-500',
  NO_BIDS: 'bg-yellow-500',
  CANCELLED: 'bg-red-500',
};

const CATEGORY_LABELS: Record<string, string> = {
  HELMET: 'Capacete',
  ARMOR: 'Armadura',
  PANTS: 'Calças',
  BOOTS: 'Botas',
  GLOVES: 'Luvas',
  NECKLACE: 'Colar',
  EARRING: 'Brinco',
  RING: 'Anel',
  SHIELD: 'Escudo',
  WEAPON: 'Arma',
  COMUM: 'Comum',
};

const GRADE_COLORS: Record<string, string> = {
  D: 'bg-gray-500',
  C: 'bg-green-500',
  B: 'bg-blue-500',
  A: 'bg-purple-500',
  S: 'bg-orange-500',
};

export default function AuctionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: auction, isLoading, error } = useAuction(id || '');

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div>Carregando detalhes do leilão...</div>
        </div>
      </Layout>
    );
  }

  if (error || !auction) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-destructive">Erro ao carregar leilão</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/auctions')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Detalhes do Leilão</h1>
              <p className="text-muted-foreground mt-1">
                Leilão #{auction.id.slice(-8)}
              </p>
            </div>
          </div>
          <Badge
            className={`${STATUS_COLORS[auction.status]} text-white text-lg px-4 py-2`}
          >
            {STATUS_LABELS[auction.status]}
          </Badge>
        </div>

        {/* Auction Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Leilão</CardTitle>
            <CardDescription>Configurações e detalhes gerais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Criado em</p>
                  <p className="font-medium">
                    {new Date(auction.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Timer Padrão</p>
                  <p className="font-medium">
                    {auction.defaultTimerSeconds} segundos
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-3">
                  <Coins className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Incremento Mínimo
                  </p>
                  <p className="font-medium">{auction.minBidIncrement} DKP</p>
                </div>
              </div>
            </div>

            {auction.notes && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Observações:</p>
                <p className="text-sm text-muted-foreground">{auction.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Items List */}
        <Card>
          <CardHeader>
            <CardTitle>Itens do Leilão ({auction.items.length})</CardTitle>
            <CardDescription>
              Lista de todos os itens incluídos neste leilão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auction.items.map((item, index) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-semibold text-muted-foreground">
                          #{index + 1}
                        </span>
                        <h4 className="font-medium text-lg">
                          {item.raidDroppedItem.name}
                        </h4>
                        <Badge
                          className={`text-white ${GRADE_COLORS[item.raidDroppedItem.grade]}`}
                        >
                          {item.raidDroppedItem.grade}
                        </Badge>
                        <Badge variant="secondary">
                          {CATEGORY_LABELS[item.raidDroppedItem.category] ||
                            item.raidDroppedItem.category}
                        </Badge>
                        <Badge
                          className={`text-white ${ITEM_STATUS_COLORS[item.status]}`}
                        >
                          {ITEM_STATUS_LABELS[item.status]}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Trophy className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Raid:</span>
                          <span className="font-medium">
                            {item.raidDroppedItem.raidInstance.raid.name}
                          </span>
                        </div>

                        {item.currentBid && (
                          <div className="flex items-center gap-2 text-sm">
                            <Coins className="h-4 w-4 text-green-600" />
                            <span className="text-muted-foreground">
                              Lance Atual:
                            </span>
                            <span className="font-semibold text-green-600">
                              {item.currentBid} DKP
                            </span>
                          </div>
                        )}

                        {item.currentWinner && (
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="text-muted-foreground">
                              Vencedor:
                            </span>
                            <span className="font-medium text-blue-600">
                              {item.currentWinner.nickname}
                            </span>
                          </div>
                        )}

                        {item.status === 'SOLD' && (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-medium">Vendido</span>
                          </div>
                        )}

                        {item.status === 'NO_BIDS' && (
                          <div className="flex items-center gap-2 text-sm text-yellow-600">
                            <XCircle className="h-4 w-4" />
                            <span className="font-medium">Sem lances</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Total de Itens
                </p>
                <p className="text-2xl font-bold">{auction.items.length}</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Vendidos</p>
                <p className="text-2xl font-bold text-green-600">
                  {auction.items.filter((i) => i.status === 'SOLD').length}
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  DKP Total Arrecadado
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {auction.items
                    .filter((i) => i.status === 'SOLD')
                    .reduce((sum, i) => sum + (i.currentBid || 0), 0)}{' '}
                  DKP
                </p>
              </div>
            </div>

            {auction.items.filter((i) => i.status === 'NO_BIDS').length > 0 && (
              <div className="mt-4 text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Itens Sem Lances
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {auction.items.filter((i) => i.status === 'NO_BIDS').length}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
