import { Sword, Shield, Crown, Package, Shirt, Footprints, Hand } from 'lucide-react';
import { Badge } from './ui/badge';
import type { Item } from '../types/api';
import type { EquipmentSlotType } from '../utils/equipment.utils';
import {
  getSlotLabel,
  getGradeColorClasses,
  getGradeGlowColor,
} from '../utils/equipment.utils';

interface EquipmentSlotProps {
  slotType: EquipmentSlotType;
  equippedItem?: Item;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Get icon component for equipment slot
 */
const getSlotIcon = (slotType: EquipmentSlotType, className: string = 'h-8 w-8') => {
  if (slotType === 'WEAPON') return <Sword className={className} />;
  if (slotType === 'SHIELD') return <Shield className={className} />;
  if (slotType.startsWith('RING_') || slotType.startsWith('EARRING_') || slotType === 'NECKLACE') {
    return <Crown className={className} />;
  }
  if (slotType === 'HELMET') return <Crown className={className} />;
  if (slotType === 'ARMOR') return <Shirt className={className} />;
  if (slotType === 'PANTS') return <Shirt className={className} />;
  if (slotType === 'BOOTS') return <Footprints className={className} />;
  if (slotType === 'GLOVES') return <Hand className={className} />;
  return <Package className={className} />;
};

/**
 * Equipment slot component - displays a single equipment slot
 */
export const EquipmentSlot: React.FC<EquipmentSlotProps> = ({
  slotType,
  equippedItem,
  onClick,
  size = 'medium',
}) => {
  const label = getSlotLabel(slotType);
  const isEmpty = !equippedItem;

  // Size classes
  const sizeClasses = {
    small: 'h-20 w-20',
    medium: 'h-24 w-24',
    large: 'h-32 w-32',
  };

  const iconSizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Slot Label */}
      <span className={`text-muted-foreground font-medium ${textSizeClasses[size]}`}>
        {label}
      </span>

      {/* Equipment Slot */}
      <button
        onClick={onClick}
        className={`
          ${sizeClasses[size]}
          relative
          flex
          flex-col
          items-center
          justify-center
          rounded-md
          border-2
          transition-all
          duration-300
          ${isEmpty
            ? 'border-muted-foreground/40 bg-gradient-to-br from-muted/30 to-muted/10 hover:border-primary/60 hover:bg-muted/50 hover:shadow-md'
            : `border-primary/70 bg-gradient-to-br from-primary/5 to-muted/30 hover:shadow-xl hover:shadow-primary/20 ${getGradeGlowColor(equippedItem.grade)} hover:border-primary`
          }
          hover:scale-105
          active:scale-95
          focus:outline-none
          focus:ring-2
          focus:ring-primary/50
          focus:ring-offset-2
          focus:ring-offset-background
          backdrop-blur-sm
        `}
      >
        {isEmpty ? (
          // Empty slot - show placeholder icon
          <div className="flex flex-col items-center gap-1 opacity-40">
            {getSlotIcon(slotType, iconSizeClasses[size])}
          </div>
        ) : (
          // Equipped item - show item details
          <div className="flex flex-col items-center justify-center gap-1 p-2">
            {/* Item Icon */}
            <div className="text-primary">
              {getSlotIcon(slotType, iconSizeClasses[size])}
            </div>

            {/* Item Grade Badge */}
            <Badge
              className={`
                ${getGradeColorClasses(equippedItem.grade)}
                text-xs
                px-1.5
                py-0
                h-4
                font-bold
                border
              `}
            >
              {equippedItem.grade}
            </Badge>

            {/* Item Name - truncated */}
            {size !== 'small' && (
              <span className="text-xs text-center line-clamp-1 max-w-full px-1 text-foreground/80">
                {equippedItem.name}
              </span>
            )}
          </div>
        )}

        {/* Equipped indicator glow effect */}
        {!isEmpty && (
          <div
            className={`
              absolute
              inset-0
              rounded-lg
              bg-gradient-to-br
              from-primary/10
              to-transparent
              pointer-events-none
            `}
          />
        )}
      </button>

      {/* Item GS Value (shown below slot for equipped items) */}
      {!isEmpty && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Package className="h-3 w-3" />
          <span className="font-medium">{equippedItem.valorGsInt}</span>
          <span className="text-yellow-500">GS</span>
        </div>
      )}
    </div>
  );
};

