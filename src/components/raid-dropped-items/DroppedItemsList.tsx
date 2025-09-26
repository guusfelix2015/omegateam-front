import { useState } from 'react';
import { Edit, Trash2, Plus, Coins, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useRaidInstanceDroppedItems, useDeleteRaidDroppedItem } from '../../hooks/raid-dropped-items.hooks';
import { useAuth } from '../../hooks/useAuth';
import { AddDroppedItemDialog } from './AddDroppedItemDialog';
import { EditDroppedItemDialog } from './EditDroppedItemDialog';
import type { RaidDroppedItem } from '../../types/api';

interface DroppedItemsListProps {
  raidInstanceId: string;
}

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

export function DroppedItemsList({ raidInstanceId }: DroppedItemsListProps) {
  const { isAdmin } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<RaidDroppedItem | null>(null);

  const { data: droppedItems, isLoading, error } = useRaidInstanceDroppedItems(raidInstanceId);
  const deleteItemMutation = useDeleteRaidDroppedItem();

  const handleDeleteItem = async (item: RaidDroppedItem) => {
    if (window.confirm(`Tem certeza que deseja remover "${item.name}"?`)) {
      await deleteItemMutation.mutateAsync(item.id);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Itens Dropados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Carregando itens...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Itens Dropados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-destructive">Erro ao carregar itens dropados</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Itens Dropados
              </CardTitle>
              <CardDescription>
                {droppedItems?.length || 0} {droppedItems?.length === 1 ? 'item dropado' : 'itens dropados'}
              </CardDescription>
            </div>
            {isAdmin && (
              <Button onClick={() => setShowAddDialog(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!droppedItems || droppedItems.length === 0 ? (
            <div className="text-center py-8">
              <Coins className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum item dropado</h3>
              <p className="text-muted-foreground mb-4">
                Esta raid instance ainda não possui itens dropados registrados.
              </p>
              {isAdmin && (
                <Button onClick={() => setShowAddDialog(true)} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Item
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {droppedItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
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
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4" />
                          <span className="font-medium">{item.minDkpBid} DKP</span>
                          <span>lance mínimo</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(item.droppedAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>

                      {item.notes && (
                        <div className="flex items-start gap-1 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{item.notes}</span>
                        </div>
                      )}
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item)}
                          disabled={deleteItemMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddDroppedItemDialog
        raidInstanceId={raidInstanceId}
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      {editingItem && (
        <EditDroppedItemDialog
          item={editingItem}
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
        />
      )}
    </>
  );
}
