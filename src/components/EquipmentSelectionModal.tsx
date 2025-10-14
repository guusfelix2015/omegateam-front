import { useState, useMemo } from 'react';
import {
  Star,
  X,
  Check,
  Package,
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
  pairedSlotItem?: Item; // Item equipped in the paired slot (for jewelry)
  availableItems: Item[];
  onEquip: (item: Item) => void;
  onUnequip: () => void;
}

/**
 * Get icon component for item category - matching enhanced EquipmentSlot icons
 */
const getCategoryIcon = (category: ItemCategory, className: string = 'h-5 w-5') => {
  const baseClasses = className;

  switch (category) {
    case 'HELMET':
      return (
        <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 3C8 3 5 5.5 5 8.5v4c0 1.5 0.5 2.5 1.5 3.5" strokeLinecap="round" />
          <path d="M12 3C16 3 19 5.5 19 8.5v4c0 1.5-0.5 2.5-1.5 3.5" strokeLinecap="round" />
          <rect x="8" y="10" width="8" height="3" rx="0.5" fill="currentColor" opacity="0.3" />
          <path d="M6.5 16C7 17 8 18 9 18.5h6c1-0.5 2-1.5 2.5-2.5" strokeLinecap="round" />
        </svg>
      );
    case 'ARMOR':
      return (
        <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 3C9 3 7 4 6 5v10c0 3 2 5 6 6 4-1 6-3 6-6V5c-1-1-3-2-6-2z" strokeLinecap="round" />
          <ellipse cx="7" cy="6" rx="2" ry="1.5" fill="currentColor" opacity="0.2" />
          <ellipse cx="17" cy="6" rx="2" ry="1.5" fill="currentColor" opacity="0.2" />
          <path d="M12 5v14" strokeWidth="1" />
        </svg>
      );
    case 'GLOVES':
      return (
        <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 14c0 3 1 5 3 6h6c2-1 3-3 3-6v-3H6v3z" strokeLinecap="round" />
          <path d="M8 11V7c0-1 0.5-2 1-2s1 1 1 2v4" strokeLinecap="round" />
          <path d="M11 11V5c0-1 0.5-2 1-2s1 1 1 2v6" strokeLinecap="round" />
          <path d="M14 11V6c0-1 0.5-2 1-2s1 1 1 2v5" strokeLinecap="round" />
        </svg>
      );
    case 'BOOTS':
      return (
        <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 4v12h3v4h6v-4h-3V4H9z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 16h6v4h-6v-4z" fill="currentColor" opacity="0.15" />
          <path d="M10 7h4M10 10h4M10 13h4" strokeWidth="1.5" opacity="0.6" />
          <path d="M9 15h6" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'PANTS':
      return (
        <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 5h10v2H7V5z" fill="currentColor" opacity="0.2" strokeLinecap="round" />
          <path d="M8 7v12c0 0.5 0.5 1 1 1h2c0.5 0 1-0.5 1-1V7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 7v12c0 0.5 0.5 1 1 1h2c0.5 0 1-0.5 1-1V7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 7v13" strokeWidth="1.5" opacity="0.4" />
          <circle cx="9.5" cy="13" r="1.5" opacity="0.3" fill="currentColor" />
          <circle cx="14.5" cy="13" r="1.5" opacity="0.3" fill="currentColor" />
        </svg>
      );
    case 'SHIELD':
      return (
        <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L4 5v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V5l-8-3z" />
          <path d="M12 7v10M8 12h8" strokeLinecap="round" strokeWidth="2" />
          <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.2" />
        </svg>
      );
    case 'WEAPON':
      return (
        <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 5L9 15" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M6 12l6 6" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 18l-6-6" strokeWidth="2" strokeLinecap="round" />
          <circle cx="5" cy="19" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'RING':
      return (
        <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <ellipse cx="12" cy="14" rx="7" ry="3" strokeWidth="2" />
          <path d="M12 7l-3 4h6l-3-4z" fill="currentColor" opacity="0.6" stroke="currentColor" strokeWidth="1" />
          <path d="M12 7v4M9 11h6" strokeWidth="0.5" opacity="0.8" />
        </svg>
      );
    case 'EARRING':
      return (
        <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 4c2 0 3 1 3 2s-1 2-3 2" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 8v6" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 14l-2.5 4h5l-2.5-4z" fill="currentColor" opacity="0.6" stroke="currentColor" strokeWidth="1" />
        </svg>
      );
    case 'NECKLACE':
      return (
        <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 8c1-1 2-2 3-2s2 1 3 2" strokeLinecap="round" />
          <path d="M20 8c-1-1-2-2-3-2s-2 1-3 2" strokeLinecap="round" />
          <path d="M12 11l-3 6h6l-3-6z" fill="currentColor" opacity="0.6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
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
  pairedSlotItem,
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
            <div className="space-y-4">
              {sortedItems.map((item) => {
                // Check if this item is equipped in the current slot
                const isCurrentlyEquipped = currentItem?.id === item.id;

                // Check if this item is equipped in the paired slot (for jewelry)
                const isEquippedInPairedSlot = pairedSlotItem?.id === item.id;

                // Item is disabled only if it's equipped in BOTH slots
                const isDisabled = isCurrentlyEquipped && isEquippedInPairedSlot;

                return (
                  <div
                    key={item.id}
                    className={`
                      flex items-center justify-between
                      p-5
                      border-2 rounded-xl
                      transition-all
                      min-h-[80px]
                      ${isCurrentlyEquipped
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-muted/50 border-muted hover:border-primary/50'
                      }
                      ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="flex items-center gap-5 flex-1 min-w-0">
                      <div className="text-muted-foreground flex-shrink-0">
                        {getCategoryIcon(category, 'h-12 w-12')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-lg truncate mb-2">{item.name}</h4>
                        <div className="flex items-center gap-5 text-base text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                            <span className="font-medium">{item.valorGsInt} GS</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            <span className="font-medium">{item.valorDkp} DKP</span>
                          </span>
                        </div>
                      </div>
                      <Badge
                        className={`${getGradeColorClasses(item.grade)} text-base px-3 py-1.5 flex-shrink-0`}
                      >
                        {item.grade}
                      </Badge>
                    </div>

                    <Button
                      size="lg"
                      onClick={() => handleEquipItem(item)}
                      disabled={isDisabled}
                      className="ml-5 flex items-center gap-2 px-6"
                    >
                      {isCurrentlyEquipped ? (
                        <>
                          <Check className="h-5 w-5" />
                          Equipado
                        </>
                      ) : isEquippedInPairedSlot ? (
                        <>
                          <Check className="h-5 w-5" />
                          Equipar (2º)
                        </>
                      ) : (
                        <>
                          <Check className="h-5 w-5" />
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

