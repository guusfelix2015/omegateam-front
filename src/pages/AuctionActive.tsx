import { useState, useEffect, useCallback } from 'react';
import { Gavel, Clock, Trophy, TrendingUp, Sparkles, Crown, Timer } from 'lucide-react';
import { useActiveAuction, usePlaceBid, useStartAuction, useFinalizeAuctionItem } from '../hooks/auction.hooks';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function AuctionActive() {
  const { isAdmin } = useAuth();
  const { data: auction, isLoading, error } = useActiveAuction(); // Adaptive polling (3s → 1s in last 10s)
  const placeBidMutation = usePlaceBid();
  const startAuctionMutation = useStartAuction();
  const finalizeItemMutation = useFinalizeAuctionItem();
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [localTimer, setLocalTimer] = useState<number>(0);

  // Get current item in auction
  const currentItem = auction?.items.find((item) => item.status === 'IN_AUCTION');

  // Calculate time remaining based on timestamp
  const calculateTimeRemaining = useCallback(() => {
    if (!currentItem?.startedAt || !auction?.defaultTimerSeconds) return 0;

    const startTime = new Date(currentItem.startedAt).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    const remaining = auction.defaultTimerSeconds - elapsed;

    return Math.max(0, remaining);
  }, [currentItem?.startedAt, auction?.defaultTimerSeconds]);

  // Update timer local a cada 100ms para suavidade
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalTimer(calculateTimeRemaining());
    }, 100);

    return () => clearInterval(interval);
  }, [calculateTimeRemaining]);

  // Sincronizar com servidor a cada polling
  useEffect(() => {
    if (currentItem) {
      setLocalTimer(calculateTimeRemaining());
    }
  }, [currentItem, calculateTimeRemaining]);

  // Set initial bid amount when current item changes
  useEffect(() => {
    if (currentItem) {
      const minBid = currentItem.currentBid
        ? currentItem.currentBid + (auction?.minBidIncrement || 1)
        : currentItem.minBid;
      setBidAmount(minBid);
    }
  }, [currentItem, auction?.minBidIncrement]);

  const handlePlaceBid = async () => {
    if (!currentItem) return;

    const minBid = currentItem.currentBid
      ? currentItem.currentBid + (auction?.minBidIncrement || 1)
      : currentItem.minBid;

    if (bidAmount < minBid) {
      alert(`Minimum bid is ${minBid} DKP`);
      return;
    }

    try {
      await placeBidMutation.mutateAsync({
        auctionItemId: currentItem.id,
        amount: bidAmount,
      });
    } catch (error) {
      console.error('Failed to place bid:', error);
      alert('Failed to place bid. Please try again.');
    }
  };

  const handleStartAuction = async () => {
    if (!auction) return;

    try {
      await startAuctionMutation.mutateAsync(auction.id);
    } catch (error) {
      console.error('Failed to start auction:', error);
      alert('Failed to start auction. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading auction...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error loading auction</div>
        </div>
      </Layout>
    );
  }

  if (!auction) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Leilão Ativo</h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe o leilão em tempo real
            </p>
          </div>

          <Card className="p-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-muted p-6">
                  <Gavel className="h-16 w-16 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Nenhum Leilão Ativo</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Não há leilão em andamento no momento. Aguarde o próximo leilão.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  const isPending = auction.status === 'PENDING';
  const isActive = auction.status === 'ACTIVE';

  const handleFinalizeItem = async () => {
    if (!currentItem) return;

    if (window.confirm('Tem certeza que deseja finalizar este item?')) {
      try {
        await finalizeItemMutation.mutateAsync(currentItem.id);
      } catch (error) {
        console.error('Failed to finalize item:', error);
        alert('Erro ao finalizar item. Tente novamente.');
      }
    }
  };

  const GRADE_COLORS: Record<string, string> = {
    S: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
    A: 'bg-gradient-to-r from-purple-400 to-pink-500 text-white',
    B: 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white',
    C: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
    D: 'bg-gradient-to-r from-gray-400 to-slate-500 text-white',
  };

  const CATEGORY_LABELS: Record<string, string> = {
    WEAPON: 'Arma',
    ARMOR: 'Armadura',
    HELMET: 'Capacete',
    PANTS: 'Calça',
    BOOTS: 'Botas',
    GLOVES: 'Luvas',
    NECKLACE: 'Colar',
    EARRING: 'Brinco',
    RING: 'Anel',
    SHIELD: 'Escudo',
    COMUM: 'Comum',
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Auction Header */}
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                <Gavel className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  {isPending ? (
                    <>
                      <Timer className="h-8 w-8 text-yellow-600" />
                      Leilão Pendente
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-8 w-8 text-green-600 animate-pulse" />
                      Leilão ao Vivo
                    </>
                  )}
                </h1>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={auction.creator.avatar || undefined} />
                    <AvatarFallback>{auction.creator.nickname[0]}</AvatarFallback>
                  </Avatar>
                  <span>Criado por {auction.creator.nickname}</span>
                  <span>•</span>
                  <span>{new Date(auction.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
            {isPending && isAdmin && (
              <Button
                onClick={handleStartAuction}
                disabled={startAuctionMutation.isPending}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                {startAuctionMutation.isPending ? 'Iniciando...' : 'Iniciar Leilão'}
              </Button>
            )}
          </div>

          {auction.notes && (
            <div className="mt-4 p-4 bg-muted rounded-lg border-l-4 border-primary">
              <p className="text-sm">{auction.notes}</p>
            </div>
          )}
        </Card>

        {/* Current Item */}
        {isActive && currentItem && (
          <Card className="p-6 border-2 border-primary shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Crown className="h-6 w-6 text-yellow-600" />
              <h2 className="text-2xl font-bold">Item em Leilão</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Item Info */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg">
                    <Gavel className="h-12 w-12 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{currentItem.raidDroppedItem.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={GRADE_COLORS[currentItem.raidDroppedItem.grade]}>
                        Grade {currentItem.raidDroppedItem.grade}
                      </Badge>
                      <Badge variant="outline">
                        {CATEGORY_LABELS[currentItem.raidDroppedItem.category] || currentItem.raidDroppedItem.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {currentItem.raidDroppedItem.raidInstance.raid.name}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Current Bid Info */}
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border-2 border-green-200 dark:border-green-800">
                  {currentItem.currentBid && currentItem.currentWinner ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>Lance Atual Mais Alto</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border-2 border-green-500">
                            <AvatarImage src={currentItem.currentWinner.avatar || undefined} />
                            <AvatarFallback className="bg-green-500 text-white">
                              {currentItem.currentWinner.nickname[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{currentItem.currentWinner.nickname}</div>
                            <div className="text-sm text-muted-foreground">{currentItem.currentWinner.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                            {currentItem.currentBid.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">DKP</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-sm text-muted-foreground mb-2">Lance Mínimo</div>
                      <div className="text-3xl font-bold">{currentItem.minBid.toLocaleString()} DKP</div>
                      <div className="text-sm text-muted-foreground mt-2">Nenhum lance ainda</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Timer */}
              <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <Clock className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <div className="text-center">
                  <div className={`text-6xl font-bold ${localTimer <= 10 ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-blue-600 dark:text-blue-400'}`}>
                    {localTimer}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">segundos restantes</div>
                </div>
                {localTimer <= 10 && (
                  <div className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm font-semibold animate-pulse">
                    ⚡ Encerrando!
                  </div>
                )}
              </div>
            </div>

            {/* Bid Form */}
            <div className="mt-6 p-6 bg-muted rounded-lg border-2 border-dashed border-primary/50">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Seu Lance (DKP)</label>
                  <Input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    min={
                      currentItem.currentBid
                        ? currentItem.currentBid + (auction.minBidIncrement || 1)
                        : currentItem.minBid
                    }
                    placeholder={`Mínimo: ${currentItem.currentBid ? currentItem.currentBid + (auction.minBidIncrement || 1) : currentItem.minBid} DKP`}
                    className="text-lg h-12"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    onClick={handlePlaceBid}
                    disabled={placeBidMutation.isPending}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  >
                    {placeBidMutation.isPending ? 'Enviando...' : 'Dar Lance'}
                  </Button>
                  {isAdmin && (
                    <Button
                      onClick={handleFinalizeItem}
                      disabled={finalizeItemMutation.isPending}
                      size="lg"
                      variant="destructive"
                    >
                      {finalizeItemMutation.isPending ? 'Finalizando...' : 'Finalizar'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Bids */}
            {currentItem.bids.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-semibold">Lances Recentes</h4>
                  <Badge variant="secondary">{currentItem.bids.length}</Badge>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {currentItem.bids.slice(0, 10).map((bid, index) => (
                    <div
                      key={bid.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${index === 0
                        ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                        : 'bg-muted border-border'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {index === 0 && <Crown className="h-4 w-4 text-yellow-600" />}
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={bid.user.avatar || undefined} />
                          <AvatarFallback>{bid.user.nickname[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{bid.user.nickname}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(bid.createdAt).toLocaleTimeString('pt-BR')}
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${index === 0 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                        {bid.amount.toLocaleString()} DKP
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Items Queue */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Gavel className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Itens do Leilão</h2>
            <Badge variant="secondary">{auction.items.length} itens</Badge>
          </div>

          <div className="space-y-3">
            {auction.items.map((item, index) => {
              const STATUS_CONFIG: Record<string, {
                bg: string;
                border: string;
                badge: string;
                label: string;
                icon: React.ReactNode;
              }> = {
                IN_AUCTION: {
                  bg: 'bg-blue-50 dark:bg-blue-950',
                  border: 'border-blue-500 dark:border-blue-600',
                  badge: 'bg-blue-500 text-white',
                  label: 'Em Leilão',
                  icon: <Sparkles className="h-4 w-4 animate-pulse" />,
                },
                SOLD: {
                  bg: 'bg-green-50 dark:bg-green-950',
                  border: 'border-green-500 dark:border-green-600',
                  badge: 'bg-green-500 text-white',
                  label: 'Vendido',
                  icon: <Trophy className="h-4 w-4" />,
                },
                NO_BIDS: {
                  bg: 'bg-gray-50 dark:bg-gray-900',
                  border: 'border-gray-300 dark:border-gray-700',
                  badge: 'bg-gray-500 text-white',
                  label: 'Sem Lances',
                  icon: null,
                },
                WAITING: {
                  bg: 'bg-slate-50 dark:bg-slate-900',
                  border: 'border-slate-200 dark:border-slate-700',
                  badge: 'bg-slate-400 text-white',
                  label: 'Aguardando',
                  icon: <Clock className="h-4 w-4" />,
                },
                CANCELLED: {
                  bg: 'bg-red-50 dark:bg-red-950',
                  border: 'border-red-300 dark:border-red-700',
                  badge: 'bg-red-500 text-white',
                  label: 'Cancelado',
                  icon: null,
                },
              };

              const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.WAITING;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border-2 ${config.bg} ${config.border} transition-all hover:shadow-md`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-lg">{item.raidDroppedItem.name}</span>
                          <Badge className={GRADE_COLORS[item.raidDroppedItem.grade]} variant="secondary">
                            {item.raidDroppedItem.grade}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{CATEGORY_LABELS[item.raidDroppedItem.category] || item.raidDroppedItem.category}</span>
                          <span>•</span>
                          <span>{item.raidDroppedItem.raidInstance.raid.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {item.currentWinner && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={item.currentWinner.avatar || undefined} />
                            <AvatarFallback>{item.currentWinner.nickname[0]}</AvatarFallback>
                          </Avatar>
                          <div className="text-right">
                            <div className="text-sm font-medium">{item.currentWinner.nickname}</div>
                            {item.currentBid && (
                              <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                                {item.currentBid.toLocaleString()} DKP
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <Badge className={`${config.badge} flex items-center gap-1 px-3 py-1`}>
                        {config.icon}
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
