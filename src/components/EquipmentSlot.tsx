import { Badge } from './ui/badge';
import { Plus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { EnhancementBadge } from './EnhancementBadge';
import { RareItemCard } from './RareItemCard';
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
  readOnly?: boolean;
  enhancementLevel?: number;
  isRare?: boolean;
  onEnhancementClick?: () => void;
}

/**
 * Enhanced SVG icons for equipment slots - Clear and recognizable RPG/Medieval style
 */
const getSlotIcon = (slotType: EquipmentSlotType, className: string = 'h-8 w-8') => {
  const baseClasses = className;

  // Helmet - Clear medieval helmet with dome, visor, and side guards
  if (slotType === 'HELMET') {
    return (
      <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Helmet dome */}
        <path d="M12 3C8 3 5 5.5 5 8.5v4c0 1.5 0.5 2.5 1.5 3.5" strokeLinecap="round" />
        <path d="M12 3C16 3 19 5.5 19 8.5v4c0 1.5-0.5 2.5-1.5 3.5" strokeLinecap="round" />
        {/* Visor opening */}
        <rect x="8" y="10" width="8" height="3" rx="0.5" fill="currentColor" opacity="0.3" />
        {/* Neck guard */}
        <path d="M6.5 16C7 17 8 18 9 18.5h6c1-0.5 2-1.5 2.5-2.5" strokeLinecap="round" />
        {/* Side guards */}
        <path d="M5 12v2c0 1 0.5 2 1 2.5M19 12v2c0 1-0.5 2-1 2.5" strokeLinecap="round" />
        {/* Top crest */}
        <path d="M10 3l2-1 2 1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Armor - Clear breastplate with shoulder guards and chest details
  if (slotType === 'ARMOR') {
    return (
      <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Torso outline */}
        <path d="M12 3C9 3 7 4 6 5v10c0 3 2 5 6 6 4-1 6-3 6-6V5c-1-1-3-2-6-2z" strokeLinecap="round" />
        {/* Shoulder pauldrons */}
        <ellipse cx="7" cy="6" rx="2" ry="1.5" fill="currentColor" opacity="0.2" />
        <ellipse cx="17" cy="6" rx="2" ry="1.5" fill="currentColor" opacity="0.2" />
        {/* Chest plate details */}
        <path d="M12 5v14" strokeWidth="1" />
        <path d="M9 8h6M9 11h6M9 14h6" strokeWidth="1" opacity="0.5" />
        {/* Abs definition */}
        <path d="M10 9c0.5 0.5 1 0.5 2 0.5s1.5 0 2-0.5M10 12c0.5 0.5 1 0.5 2 0.5s1.5 0 2-0.5" strokeWidth="1" opacity="0.4" />
      </svg>
    );
  }

  // Gloves - Clear gauntlet with finger plates
  if (slotType === 'GLOVES') {
    return (
      <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Palm/wrist base */}
        <path d="M6 14c0 3 1 5 3 6h6c2-1 3-3 3-6v-3H6v3z" strokeLinecap="round" />
        {/* Fingers */}
        <path d="M8 11V7c0-1 0.5-2 1-2s1 1 1 2v4" strokeLinecap="round" />
        <path d="M11 11V5c0-1 0.5-2 1-2s1 1 1 2v6" strokeLinecap="round" />
        <path d="M14 11V6c0-1 0.5-2 1-2s1 1 1 2v5" strokeLinecap="round" />
        {/* Thumb */}
        <path d="M6 13c-0.5-1-0.5-2 0-3 0.5-1 1-1 1.5-1s1 0.5 1 1.5" strokeLinecap="round" />
        {/* Armor plates */}
        <path d="M7 15h10M7 17h10" strokeWidth="1" opacity="0.4" />
      </svg>
    );
  }

  // Boots - Redesigned for clarity: simple boot shape with clear foot
  if (slotType === 'BOOTS') {
    return (
      <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {/* Boot outline - clear L-shape */}
        <path d="M9 4v12h3v4h6v-4h-3V4H9z" strokeLinecap="round" strokeLinejoin="round" />
        {/* Foot/sole */}
        <path d="M12 16h6v4h-6v-4z" fill="currentColor" opacity="0.15" />
        {/* Boot shaft detail */}
        <path d="M10 7h4M10 10h4M10 13h4" strokeWidth="1.5" opacity="0.6" />
        {/* Ankle/cuff */}
        <path d="M9 15h6" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Pants - Redesigned for clarity: two distinct legs with clear separation
  if (slotType === 'PANTS') {
    return (
      <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {/* Waistband */}
        <path d="M7 5h10v2H7V5z" fill="currentColor" opacity="0.2" strokeLinecap="round" />
        {/* Left leg - clear tube shape */}
        <path d="M8 7v12c0 0.5 0.5 1 1 1h2c0.5 0 1-0.5 1-1V7" strokeLinecap="round" strokeLinejoin="round" />
        {/* Right leg - clear tube shape */}
        <path d="M13 7v12c0 0.5 0.5 1 1 1h2c0.5 0 1-0.5 1-1V7" strokeLinecap="round" strokeLinejoin="round" />
        {/* Separation line between legs */}
        <path d="M12 7v13" strokeWidth="1.5" opacity="0.4" />
        {/* Knee details */}
        <circle cx="9.5" cy="13" r="1.5" opacity="0.3" fill="currentColor" />
        <circle cx="14.5" cy="13" r="1.5" opacity="0.3" fill="currentColor" />
      </svg>
    );
  }

  // Shield - Keep the good shield design
  if (slotType === 'SHIELD') {
    return (
      <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L4 5v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V5l-8-3z" />
        <path d="M12 7v10M8 12h8" strokeLinecap="round" strokeWidth="2" />
        {/* Shield boss (center) */}
        <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.2" />
      </svg>
    );
  }

  // Weapon - Clear sword with blade, guard, and pommel
  if (slotType === 'WEAPON') {
    return (
      <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Blade */}
        <path d="M19 5L9 15" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M19 5L9 15" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        {/* Fuller (blood groove) */}
        <path d="M18 6L10 14" strokeWidth="0.5" opacity="0.3" />
        {/* Cross guard */}
        <path d="M6 12l6 6" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 18l-6-6" strokeWidth="2" strokeLinecap="round" />
        {/* Grip */}
        <rect x="7" y="16" width="1.5" height="4" rx="0.5" transform="rotate(-45 7 16)" fill="currentColor" opacity="0.6" />
        {/* Pommel */}
        <circle cx="5" cy="19" r="1.5" fill="currentColor" />
      </svg>
    );
  }

  // Ring - Clear ring with prominent gemstone
  if (slotType.startsWith('RING_')) {
    return (
      <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Ring band */}
        <ellipse cx="12" cy="14" rx="7" ry="3" strokeWidth="2" />
        <ellipse cx="12" cy="14" rx="5" ry="2" opacity="0.3" />
        {/* Gemstone setting */}
        <path d="M12 7l-3 4h6l-3-4z" fill="currentColor" opacity="0.6" stroke="currentColor" strokeWidth="1" />
        {/* Gemstone facets */}
        <path d="M12 7v4M9 11h6" strokeWidth="0.5" opacity="0.8" />
        {/* Sparkle */}
        <path d="M8 6l1 1M16 6l-1 1M12 4v1.5" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      </svg>
    );
  }

  // Earring - Clear earring with hook and dangling gem
  if (slotType.startsWith('EARRING_')) {
    return (
      <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Ear hook */}
        <path d="M12 4c2 0 3 1 3 2s-1 2-3 2" strokeWidth="2" strokeLinecap="round" />
        {/* Connection chain */}
        <path d="M12 8v6" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="10" r="0.5" fill="currentColor" />
        <circle cx="12" cy="12" r="0.5" fill="currentColor" />
        {/* Dangling gemstone */}
        <path d="M12 14l-2.5 4h5l-2.5-4z" fill="currentColor" opacity="0.6" stroke="currentColor" strokeWidth="1" />
        {/* Gem facets */}
        <path d="M12 14v4M9.5 18h5" strokeWidth="0.5" opacity="0.8" />
        {/* Sparkle */}
        <path d="M8 16l1 1M16 16l-1 1" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      </svg>
    );
  }

  // Necklace - Clear necklace chain with pendant
  if (slotType === 'NECKLACE') {
    return (
      <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Chain left side */}
        <path d="M4 8c1-1 2-2 3-2s2 1 3 2" strokeLinecap="round" />
        <circle cx="5" cy="7" r="0.8" fill="currentColor" />
        <circle cx="7" cy="8" r="0.8" fill="currentColor" />
        <circle cx="9" cy="9" r="0.8" fill="currentColor" />
        {/* Chain right side */}
        <path d="M20 8c-1-1-2-2-3-2s-2 1-3 2" strokeLinecap="round" />
        <circle cx="19" cy="7" r="0.8" fill="currentColor" />
        <circle cx="17" cy="8" r="0.8" fill="currentColor" />
        <circle cx="15" cy="9" r="0.8" fill="currentColor" />
        {/* Center connection */}
        <path d="M10 10c0.5 0.5 1 1 2 1s1.5-0.5 2-1" strokeLinecap="round" />
        {/* Pendant */}
        <path d="M12 11l-3 6h6l-3-6z" fill="currentColor" opacity="0.6" stroke="currentColor" strokeWidth="1.5" />
        {/* Pendant gem facets */}
        <path d="M12 11v6M9 17h6M10.5 14h3" strokeWidth="0.5" opacity="0.8" />
        {/* Sparkles */}
        <path d="M8 14l1 1M16 14l-1 1M12 9v1" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      </svg>
    );
  }

  // Default fallback
  return (
    <svg className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h6M9 15h6" strokeLinecap="round" />
    </svg>
  );
};

/**
 * Equipment slot component - displays a single equipment slot
 */
export const EquipmentSlot: React.FC<EquipmentSlotProps> = ({
  slotType,
  equippedItem,
  onClick,
  size = 'medium',
  readOnly = false,
  enhancementLevel = 0,
  isRare = false,
  onEnhancementClick,
}) => {

  const label = getSlotLabel(slotType);
  const isEmpty = !equippedItem;

  // Size classes - tamanhos aumentados para melhor visibilidade
  const sizeClasses = {
    small: 'h-20 w-20',
    medium: 'h-24 w-24',
    large: 'h-28 w-28',
  };

  const iconSizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-10 w-10',
    large: 'h-12 w-12',
  };

  const slotButton = (
    <button
      onClick={readOnly ? undefined : onClick}
      disabled={readOnly}
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
          group
          ${isEmpty
          ? 'border-border bg-muted/50 hover:border-primary/60 hover:bg-muted hover:shadow-md'
          : `border-primary/60 bg-gradient-to-br from-primary/10 to-primary/5 hover:shadow-lg ${getGradeGlowColor(equippedItem.grade)} hover:border-primary`
        }
          ${readOnly ? 'cursor-default' : 'hover:scale-105 active:scale-95 cursor-pointer'}
          focus:outline-none
          focus:ring-2
          focus:ring-primary/50
          focus:ring-offset-2
          focus:ring-offset-background
        `}
    >
      {isEmpty ? (
        // Empty slot - show placeholder icon
        <div className="flex flex-col items-center gap-1 opacity-40">
          {getSlotIcon(slotType, iconSizeClasses[size])}
        </div>
      ) : (
        // Equipped item - show only icon and grade badge
        <div className="flex flex-col items-center justify-center gap-2">
          {/* Item Icon */}
          <div className="text-primary">
            {getSlotIcon(slotType, iconSizeClasses[size])}
          </div>

          {/* Item Grade Badge - only info shown */}
          <Badge
            className={`
                ${getGradeColorClasses(equippedItem.grade)}
                text-sm
                px-2.5
                py-0.5
                font-bold
                border-2
              `}
          >
            {equippedItem.grade}
          </Badge>
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

      {/* Enhancement Badge - Top Right */}
      {!isEmpty && enhancementLevel > 0 && (
        <div className="absolute -top-1 -right-1 z-10">
          <EnhancementBadge level={enhancementLevel} size="sm" />
        </div>
      )}

      {/* Enhancement Button - Bottom Right */}
      {!isEmpty && !readOnly && onEnhancementClick && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEnhancementClick();
          }}
          className="absolute -bottom-1 -right-1 z-10 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all hover:scale-110 active:scale-95 shadow-md"
          title="Definir encantamento"
        >
          <Plus className="h-3 w-3" />
        </button>
      )}
    </button>
  );

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Slot Label - Always visible */}
      <span className="text-muted-foreground font-medium text-[10px] uppercase tracking-wide">
        {label}
      </span>

      {/* Equipment Slot with Tooltip for equipped items */}
      {!isEmpty ? (
        <RareItemCard isRare={isRare}>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                {slotButton}
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="font-semibold">
                  {equippedItem.name}
                  {isRare && <span className="ml-2 text-amber-400">✨</span>}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Grade {equippedItem.grade} • {equippedItem.valorGsInt} GS
                  {isRare && <span className="text-amber-400"> • Item Raro</span>}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </RareItemCard>
      ) : (
        slotButton
      )}
    </div>
  );
};

