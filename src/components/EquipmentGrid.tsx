import { useState, useMemo } from 'react';
import { EquipmentSlot } from './EquipmentSlot';
import { EquipmentSelectionModal } from './EquipmentSelectionModal';
import type { Item, UserGearResponse } from '../types/api';
import type { EquipmentSlotType, EquippedGear } from '../utils/equipment.utils';
import {
  EQUIPMENT_SLOTS,
  mapItemsToSlots,
  mapSlotsToItemIds,
  getSlotCategory,
  getPairedSlot,
} from '../utils/equipment.utils';
import { useUpdateUserGear } from '../hooks/gear.hooks';
import { useItems } from '../hooks/items.hooks';

interface EquipmentGridProps {
  gear?: UserGearResponse;
}

/**
 * Equipment grid component - displays all equipment slots in a 3-column grid layout
 */
export const EquipmentGrid: React.FC<EquipmentGridProps> = ({ gear }) => {
  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlotType | null>(null);
  const updateGearMutation = useUpdateUserGear();

  // Fetch all available items for selection
  const { data: itemsData } = useItems({
    limit: 1000, // Get all items
  });

  const allItems = useMemo(() => itemsData?.data || [], [itemsData?.data]);

  // Map current gear to equipment slots
  const equippedGear: EquippedGear = useMemo(() => {
    if (!gear?.ownedItems || !gear?.ownedItemIds) return {};
    return mapItemsToSlots(gear.ownedItemIds, gear.ownedItems);
  }, [gear?.ownedItems, gear?.ownedItemIds]);

  // Get available items for the selected slot
  const availableItemsForSlot = useMemo(() => {
    if (!selectedSlot) return [];
    const category = getSlotCategory(selectedSlot);
    return allItems.filter((item) => item.category === category);
  }, [selectedSlot, allItems]);

  // Handle equipping an item
  const handleEquipItem = async (item: Item) => {
    if (!selectedSlot) return;

    const newEquippedGear = { ...equippedGear };
    newEquippedGear[selectedSlot] = item;

    // Convert back to item IDs array
    const ownedItemIds = mapSlotsToItemIds(newEquippedGear);

    try {
      await updateGearMutation.mutateAsync({ ownedItemIds });
      setSelectedSlot(null);
    } catch (error) {
      console.error('Error equipping item:', error);
    }
  };

  // Handle unequipping an item
  const handleUnequipItem = async () => {
    if (!selectedSlot) return;

    const newEquippedGear = { ...equippedGear };
    delete newEquippedGear[selectedSlot];

    // Convert back to item IDs array
    const ownedItemIds = mapSlotsToItemIds(newEquippedGear);

    try {
      await updateGearMutation.mutateAsync({ ownedItemIds });
      setSelectedSlot(null);
    } catch (error) {
      console.error('Error unequipping item:', error);
    }
  };

  // Group slots by row
  const slotsByRow = EQUIPMENT_SLOTS.reduce((acc, slot) => {
    if (!acc[slot.row]) {
      acc[slot.row] = [];
    }
    acc[slot.row].push(slot);
    return acc;
  }, {} as Record<number, typeof EQUIPMENT_SLOTS>);

  // Sort slots within each row by column
  Object.keys(slotsByRow).forEach((row) => {
    slotsByRow[Number(row)].sort((a, b) => a.col - b.col);
  });

  return (
    <div className="w-full flex justify-center">
      {/* Equipment Grid - Character Silhouette Layout */}
      <div className="inline-flex flex-col gap-2 p-6 bg-muted/30 rounded-xl border-2 border-border shadow-lg">
        {/* Armor Section Title */}
        <div className="text-center mb-1">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Equipamentos
          </h3>
        </div>

        {/* Render each row */}
        {[1, 2, 3].map((rowNum) => {
          const rowSlots = slotsByRow[rowNum] || [];

          return (
            <div key={rowNum} className="flex justify-center items-center gap-3">
              {/* Render 3 columns, with empty spaces where needed */}
              {[1, 2, 3].map((colNum) => {
                const slot = rowSlots.find((s) => s.col === colNum);

                if (!slot) {
                  // Empty slot for spacing - matches medium size (h-24 w-24)
                  return (
                    <div
                      key={`empty-${rowNum}-${colNum}`}
                      className="w-24 h-24"
                    />
                  );
                }

                // Determine size based on slot type
                let size: 'small' | 'medium' | 'large' = 'medium';
                if (slot.type === 'ARMOR') size = 'large';
                if (slot.type === 'WEAPON') size = 'large';

                return (
                  <EquipmentSlot
                    key={slot.type}
                    slotType={slot.type}
                    equippedItem={equippedGear[slot.type]}
                    onClick={() => setSelectedSlot(slot.type)}
                    size={size}
                  />
                );
              })}
            </div>
          );
        })}

        {/* Weapons Section Divider */}
        <div className="border-t border-border my-2" />
        <div className="text-center mb-1">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Armas
          </h3>
        </div>

        {/* Row 4: Weapons */}
        {(() => {
          const rowNum = 4;
          const rowSlots = slotsByRow[rowNum] || [];

          return (
            <div key={rowNum} className="flex justify-center items-center gap-3">
              {[1, 2, 3].map((colNum) => {
                const slot = rowSlots.find((s) => s.col === colNum);

                if (!slot) {
                  return (
                    <div
                      key={`empty-${rowNum}-${colNum}`}
                      className="w-24 h-24"
                    />
                  );
                }

                const size = slot.type === 'WEAPON' ? 'large' : 'medium';

                return (
                  <EquipmentSlot
                    key={slot.type}
                    slotType={slot.type}
                    equippedItem={equippedGear[slot.type]}
                    onClick={() => setSelectedSlot(slot.type)}
                    size={size}
                  />
                );
              })}
            </div>
          );
        })()}

        {/* Accessories Section Divider */}
        <div className="border-t border-border my-2" />
        <div className="text-center mb-1">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Acessórios
          </h3>
        </div>

        {/* Row 5: Accessories top row - Earrings + Necklace (3 items) */}
        {(() => {
          const rowNum = 5;
          const rowSlots = slotsByRow[rowNum] || [];

          return (
            <div key={rowNum} className="flex justify-center items-center gap-3">
              {[1, 2, 3].map((colNum) => {
                const slot = rowSlots.find((s) => s.col === colNum);

                if (!slot) {
                  return (
                    <div
                      key={`empty-${rowNum}-${colNum}`}
                      className="w-24 h-24"
                    />
                  );
                }

                return (
                  <EquipmentSlot
                    key={slot.type}
                    slotType={slot.type}
                    equippedItem={equippedGear[slot.type]}
                    onClick={() => setSelectedSlot(slot.type)}
                    size="medium"
                  />
                );
              })}
            </div>
          );
        })()}

        {/* Row 6: Accessories bottom row - Rings (2 items, staggered) */}
        {(() => {
          const rowNum = 6;
          const rowSlots = slotsByRow[rowNum] || [];

          return (
            <div key={rowNum} className="flex justify-center items-center gap-3">
              {[1, 2, 3].map((colNum) => {
                const slot = rowSlots.find((s) => s.col === colNum);

                if (!slot) {
                  return (
                    <div
                      key={`empty-${rowNum}-${colNum}`}
                      className="w-16 h-16"
                    />
                  );
                }

                return (
                  <EquipmentSlot
                    key={slot.type}
                    slotType={slot.type}
                    equippedItem={equippedGear[slot.type]}
                    onClick={() => setSelectedSlot(slot.type)}
                    size="medium"
                  />
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* Equipment Selection Modal */}
      {selectedSlot && (
        <EquipmentSelectionModal
          isOpen={!!selectedSlot}
          onClose={() => setSelectedSlot(null)}
          slotType={selectedSlot}
          category={getSlotCategory(selectedSlot)}
          currentItem={equippedGear[selectedSlot]}
          pairedSlotItem={
            getPairedSlot(selectedSlot)
              ? equippedGear[getPairedSlot(selectedSlot)!]
              : undefined
          }
          availableItems={availableItemsForSlot}
          onEquip={handleEquipItem}
          onUnequip={handleUnequipItem}
        />
      )}
    </div>
  );
};

