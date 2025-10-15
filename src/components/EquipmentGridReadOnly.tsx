import { useMemo } from 'react';
import { EquipmentSlot } from './EquipmentSlot';
import type { UserGearResponse } from '../types/api';
import type { EquippedGear } from '../utils/equipment.utils';
import {
  EQUIPMENT_SLOTS,
  mapUserItemsToSlots,
} from '../utils/equipment.utils';

interface EquipmentGridReadOnlyProps {
  gear?: UserGearResponse;
}

/**
 * Read-only equipment grid component for viewing other players' equipment
 * Displays all equipment slots in a 3-column grid layout without edit functionality
 */
export const EquipmentGridReadOnly: React.FC<EquipmentGridReadOnlyProps> = ({
  gear,
}) => {
  // Map current gear to equipment slots
  const equippedGear: EquippedGear = useMemo(() => {
    if (!gear?.userItems) return {};
    return mapUserItemsToSlots(gear.userItems);
  }, [gear?.userItems]);

  // Group slots by row for rendering
  const slotsByRow = useMemo(() => {
    return EQUIPMENT_SLOTS.reduce(
      (acc, slot) => {
        if (!acc[slot.row]) {
          acc[slot.row] = [];
        }
        acc[slot.row].push(slot);
        return acc;
      },
      {} as Record<number, typeof EQUIPMENT_SLOTS>
    );
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-3">
        {/* Rows 1-3: Standard equipment (Helmet, Gloves/Armor/Boots, Pants) */}
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
                    onClick={() => { }} // No-op for read-only
                    size={size}
                    readOnly={true}
                  />
                );
              })}
            </div>
          );
        })}

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
                    onClick={() => { }} // No-op for read-only
                    size={size}
                    readOnly={true}
                  />
                );
              })}
            </div>
          );
        })()}

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
                      className="w-20 h-20"
                    />
                  );
                }

                return (
                  <EquipmentSlot
                    key={slot.type}
                    slotType={slot.type}
                    equippedItem={equippedGear[slot.type]}
                    onClick={() => { }} // No-op for read-only
                    size="small"
                    readOnly={true}
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
                  // Empty space in the middle (col 2) for pyramid effect
                  return (
                    <div
                      key={`empty-${rowNum}-${colNum}`}
                      className="w-20 h-20"
                    />
                  );
                }

                return (
                  <EquipmentSlot
                    key={slot.type}
                    slotType={slot.type}
                    equippedItem={equippedGear[slot.type]}
                    onClick={() => { }} // No-op for read-only
                    size="small"
                    readOnly={true}
                  />
                );
              })}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

