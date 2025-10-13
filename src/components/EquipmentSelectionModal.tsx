import { useState, useMemo } from 'react';
import {
  Sword,
  Shield,
  Crown,
  Package,
  Shirt,
  Footprints,
  Hand,
  Star,
  X,
  Check,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import type { Item, ItemCategory } from '../types/api';
import type { EquipmentSlotType } from '../utils/equipment.utils';
import { getSlotLabel, getGradeColorClasses } from '../utils/equipment.utils';

interface EquipmentSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  slotType: EquipmentSlotType;
  category: ItemCategory;
  currentItem?: Item;
  availableItems: Item[];
  onEquip: (item: Item) => void;
  onUnequip: () => void;
}

/**
 * Get icon component for item category
 */
const getCategoryIcon = (category: ItemCategory, className: string = 'h-5 w-5') => {
  switch (category) {
    case 'WEAPON':
      return <Sword className={className} />;
    case 'SHIELD':
      return <Shield className={className} />;
    case 'RING':
    case 'EARRING':
    case 'NECKLACE':
      return <Crown className={className} />;
    case 'HELMET':
      return <Crown className={className} />;
    case 'ARMOR':
    case 'PANTS':
      return <Shirt className={className} />;
    case 'BOOTS':
      return <Footprints className={className} />;
    case 'GLOVES':
      return <Hand className={className} />;
    default:
      return <Package className={className} />;
  }
};

/**
 * Equipment selection modal - allows selecting an item for a specific slot
 */
export const EquipmentSelectionModal: React.FC<EquipmentSelectionModalProps> = ({
  isOpen,
  onClose,
  slotType,
  category,
  currentItem,
  availableItems,
  onEquip,
  onUnequip,
}) => {
  const [search, setSearch] = useState('');
  const slotLabel = getSlotLabel(slotType);

  // Filter items by search
  const filteredItems = useMemo(() => {
    if (!search) return availableItems;
    const searchLower = search.toLowerCase();
    return availableItems.filter((item) =>
      item.name.toLowerCase().includes(searchLower)
    );
  }, [availableItems, search]);

  // Sort items by grade (S > A > B > C > D) and then by GS value
  const sortedItems = useMemo(() => {
    const gradeOrder = { S: 5, A: 4, B: 3, C: 2, D: 1 };
    return [...filteredItems].sort((a, b) => {
      const gradeCompare = (gradeOrder[b.grade] || 0) - (gradeOrder[a.grade] || 0);
      if (gradeCompare !== 0) return gradeCompare;
      return b.valorGsInt - a.valorGsInt;
    });
  }, [filteredItems]);

  const handleEquipItem = (item: Item) => {
    onEquip(item);
    onClose();
  };

  const handleUnequip = () => {
    onUnequip();
    onClose();
  };

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getCategoryIcon(category)}
            Selecionar {slotLabel}
          </DialogTitle>
          <DialogDescription>
            Escolha um item para equipar no slot de {slotLabel.toLowerCase()}
          </DialogDescription>
        </DialogHeader>

        {/* Current Item Display */}
        {currentItem && (
          <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-primary">
                  {getCategoryIcon(category, 'h-6 w-6')}
                </div>
                <div>
                  <h4 className="font-medium">{currentItem.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {currentItem.valorGsInt} GS
                    </span>
                    <Badge className={`${getGradeColorClasses(currentItem.grade)} text-xs`}>
                      {currentItem.grade}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleUnequip}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Desequipar
              </Button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="flex gap-2">
          <Input
            placeholder="Buscar itens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
        </div>

        {/* Available Items List */}
        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          {sortedItems.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                {search
                  ? 'Nenhum item encontrado'
                  : 'Nenhum item disponível para este slot'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedItems.map((item) => {
                const isCurrentlyEquipped = currentItem?.id === item.id;

                return (
                  <div
                    key={item.id}
                    className={`
                      flex items-center justify-between
                      p-3
                      border rounded-lg
                      transition-all
                      ${isCurrentlyEquipped
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-muted/50 border-muted'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-muted-foreground">
                        {getCategoryIcon(category, 'h-5 w-5')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {item.valorGsInt} GS
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {item.valorDkp} DKP
                          </span>
                        </div>
                      </div>
                      <Badge
                        className={`${getGradeColorClasses(item.grade)} text-xs px-2 py-1`}
                      >
                        {item.grade}
                      </Badge>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleEquipItem(item)}
                      disabled={isCurrentlyEquipped}
                      className="ml-3 flex items-center gap-2"
                    >
                      {isCurrentlyEquipped ? (
                        <>
                          <Check className="h-4 w-4" />
                          Equipado
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Equipar
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

