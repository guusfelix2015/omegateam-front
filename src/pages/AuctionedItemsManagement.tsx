import { useState } from 'react';
import { Coins, Loader2, RotateCcw } from 'lucide-react';
import { useAuctionedItems, useResetAuctionedFlag } from '../hooks/auction.hooks';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

const GRADE_COLORS: Record<string, string> = {
  S: 'bg-purple-600',
  A: 'bg-blue-600',
  B: 'bg-green-600',
  C: 'bg-yellow-600',
  D: 'bg-gray-600',
};

const CATEGORY_LABELS: Record<string, string> = {
  WEAPON: 'Arma',
  ARMOR: 'Armadura',
  HELMET: 'Capacete',
  GLOVES: 'Luvas',
  BOOTS: 'Botas',
  SHIELD: 'Escudo',
  NECKLACE: 'Colar',
  EARRING: 'Brinco',
  RING: 'Anel',
  PANTS: 'Calça',
  COMUM: 'Comum',
};

export default function AuctionedItemsManagement() {
  const { data: auctionedItems, isLoading } = useAuctionedItems();
  const resetFlagMutation = useResetAuctionedFlag();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [resetReason, setResetReason] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  const handleResetFlag = async () => {
    if (!selectedItem) return;

    try {
      await resetFlagMutation.mutateAsync({
        itemId: selectedItem,
        reason: resetReason || undefined,
      });

      alert('Flag resetada com sucesso!');
      setShowResetModal(false);
      setSelectedItem(null);
      setResetReason('');
    } catch (error) {
      console.error('Erro ao resetar flag:', error);
      alert('Erro ao resetar flag. Tente novamente.');
    }
  };

  const openResetModal = (itemId: string) => {
    setSelectedItem(itemId);
    setShowResetModal(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando itens leiloados...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Coins className="h-8 w-8 text-primary" />
            Itens Leiloados
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie itens que já foram leiloados
          </p>
        </div>

        {/* Itens Leiloados */}
        <Card>
          <CardHeader>
            <CardTitle>Itens Leiloados</CardTitle>
            <CardDescription>
              Total: {auctionedItems?.length || 0} itens
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!auctionedItems || auctionedItems.length === 0 ? (
              <div className="text-center py-8">
                <Coins className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum item foi leiloado ainda.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {auctionedItems.map((item) => {
                  const lastAuction = item.auctionItems[0];
                  return (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{item.name}</h4>
                            <Badge variant="outline" className={`text-white ${GRADE_COLORS[item.grade]}`}>
                              {item.grade}
                            </Badge>
                            <Badge variant="secondary">
                              {CATEGORY_LABELS[item.category] || item.category}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Raid:</span>{' '}
                              {item.raidInstance?.raid?.name || 'N/A'}
                            </div>
                            {lastAuction && (
                              <>
                                <div>
                                  <span className="font-medium">Último Leilão:</span>{' '}
                                  {new Date(lastAuction.auction.createdAt).toLocaleDateString('pt-BR')}
                                </div>
                                {lastAuction.currentWinner && (
                                  <div>
                                    <span className="font-medium">Vencedor:</span>{' '}
                                    {lastAuction.currentWinner.nickname}
                                  </div>
                                )}
                                {lastAuction.currentBid && (
                                  <div className="flex items-center gap-1">
                                    <Coins className="h-4 w-4 text-green-600" />
                                    <span className="font-semibold text-green-600">
                                      {lastAuction.currentBid} DKP
                                    </span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openResetModal(item.id)}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Resetar Flag
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Reset */}
      <Dialog open={showResetModal} onOpenChange={setShowResetModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resetar Flag de Item Leiloado</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja resetar a flag deste item? Ele poderá ser leiloado novamente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Motivo (opcional)</Label>
              <Textarea
                id="reason"
                value={resetReason}
                onChange={(e) => setResetReason(e.target.value)}
                rows={3}
                placeholder="Descreva o motivo do reset..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowResetModal(false);
                setSelectedItem(null);
                setResetReason('');
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleResetFlag}
              disabled={resetFlagMutation.isPending}
            >
              {resetFlagMutation.isPending ? 'Resetando...' : 'Confirmar Reset'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

