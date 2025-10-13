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
    if (!gear?.ownedItems) return {};
    return mapItemsToSlots(gear.ownedItems);
  }, [gear?.ownedItems]);

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

  // Group slots by position
  const leftSlots = EQUIPMENT_SLOTS.filter((slot) => slot.position === 'left');
  const centerSlots = EQUIPMENT_SLOTS.filter((slot) => slot.position === 'center');
  const rightSlots = EQUIPMENT_SLOTS.filter((slot) => slot.position === 'right');

  return (
    <div className="w-full">
      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 rounded-xl border-2 border-slate-700/50 shadow-2xl backdrop-blur-sm">
        {/* Left Column - Accessories */}
        <div className="flex flex-col items-center gap-6">
          <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest border-b-2 border-primary/30 pb-2 px-4">
            Acessórios
          </h3>
          <div className="flex flex-col gap-6">
            {leftSlots.map((slot) => (
              <EquipmentSlot
                key={slot.type}
                slotType={slot.type}
                equippedItem={equippedGear[slot.type]}
                onClick={() => setSelectedSlot(slot.type)}
                size="medium"
              />
            ))}
          </div>
        </div>

        {/* Center Column - Main Equipment */}
        <div className="flex flex-col items-center gap-6">
          <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest border-b-2 border-primary/30 pb-2 px-4">
            Equipamento Principal
          </h3>
          <div className="flex flex-col gap-6">
            {centerSlots.map((slot) => {
              // Make armor slot larger
              const size = slot.type === 'ARMOR' ? 'large' : 'medium';
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
        </div>

        {/* Right Column - Combat Equipment & Accessories */}
        <div className="flex flex-col items-center gap-6">
          <h3 className="text-sm font-bold text-primary/80 uppercase tracking-widest border-b-2 border-primary/30 pb-2 px-4">
            Combate
          </h3>
          <div className="flex flex-col gap-6">
            {rightSlots.map((slot) => {
              // Make weapon slot larger
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
        </div>
      </div>

      {/* Equipment Selection Modal */}
      {selectedSlot && (
        <EquipmentSelectionModal
          isOpen={!!selectedSlot}
          onClose={() => setSelectedSlot(null)}
          slotType={selectedSlot}
          category={getSlotCategory(selectedSlot)}
          currentItem={equippedGear[selectedSlot]}
          availableItems={availableItemsForSlot}
          onEquip={handleEquipItem}
          onUnequip={handleUnequipItem}
        />
      )}
    </div>
  );
};

