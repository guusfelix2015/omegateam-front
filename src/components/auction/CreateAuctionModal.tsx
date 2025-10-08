import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Gavel, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { useCreateAuction } from '../../hooks/auction.hooks';
import type { RaidDroppedItem } from '../../types/api';

interface CreateAuctionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preSelectedItem?: RaidDroppedItem;
}

const GRADE_COLORS: Record<string, string> = {
  D: 'bg-gray-500',
  C: 'bg-green-500',
  B: 'bg-blue-500',
  A: 'bg-purple-500',
  S: 'bg-orange-500',
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

export function CreateAuctionModal({
  open,
  onOpenChange,
  preSelectedItem,
}: CreateAuctionModalProps) {
  const navigate = useNavigate();
  const createAuctionMutation = useCreateAuction();
  const [defaultTimerSeconds, setDefaultTimerSeconds] = useState<number>(20);
  const [minBidIncrement, setMinBidIncrement] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!preSelectedItem) {
      return;
    }

    try {
      await createAuctionMutation.mutateAsync({
        itemIds: [preSelectedItem.id],
        defaultTimerSeconds,
        minBidIncrement,
        notes: notes || undefined,
      });

      // Close modal and navigate to auctions list
      onOpenChange(false);
      navigate('/auctions');
    } catch (error) {
      console.error('Failed to create auction:', error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setDefaultTimerSeconds(20);
    setMinBidIncrement(1);
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            Criar Novo Leilão
          </DialogTitle>
          <DialogDescription>
            Configure os parâmetros do leilão para o item selecionado
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selected Item Display */}
          {preSelectedItem && (
            <div className="border rounded-lg p-4 bg-blue-50">
              <Label className="text-sm font-medium mb-2 block">
                Item Selecionado
              </Label>
              <div className="flex items-center gap-2">
                <span className="font-medium">{preSelectedItem.name}</span>
                <Badge
                  variant="outline"
                  className={`text-white ${GRADE_COLORS[preSelectedItem.grade]}`}
                >
                  {preSelectedItem.grade}
                </Badge>
                <Badge variant="secondary">
                  {CATEGORY_LABELS[preSelectedItem.category] ||
                    preSelectedItem.category}
                </Badge>
                <span className="text-sm text-muted-foreground ml-auto">
                  Lance mínimo: {preSelectedItem.minDkpBid} DKP
                </span>
              </div>
            </div>
          )}

          {/* Auction Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">Configurações do Leilão</h3>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Default Timer */}
              <div className="space-y-2">
                <Label htmlFor="defaultTimer">Timer Padrão (segundos)</Label>
                <Input
                  id="defaultTimer"
                  type="number"
                  min="10"
                  max="300"
                  value={defaultTimerSeconds}
                  onChange={(e) =>
                    setDefaultTimerSeconds(Number(e.target.value))
                  }
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Tempo para cada item (10-300 segundos)
                </p>
              </div>

              {/* Minimum Bid Increment */}
              <div className="space-y-2">
                <Label htmlFor="minBidIncrement">Incremento Mínimo (DKP)</Label>
                <Input
                  id="minBidIncrement"
                  type="number"
                  min="1"
                  value={minBidIncrement}
                  onChange={(e) => setMinBidIncrement(Number(e.target.value))}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Valor mínimo de aumento entre lances
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Adicione observações sobre este leilão..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createAuctionMutation.isPending}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!preSelectedItem || createAuctionMutation.isPending}
            >
              {createAuctionMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Gavel className="h-4 w-4 mr-2" />
                  Criar Leilão
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
