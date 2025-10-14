import type { Item, ItemCategory } from '../types/api';

/**
 * Equipment slot types matching the visual grid layout
 */
export type EquipmentSlotType =
  | 'HELMET'
  | 'NECKLACE'
  | 'ARMOR'
  | 'PANTS'
  | 'BOOTS'
  | 'EARRING_1'
  | 'EARRING_2'
  | 'RING_1'
  | 'RING_2'
  | 'WEAPON'
  | 'SHIELD'
  | 'GLOVES';

/**
 * Equipment slot configuration with row/column positioning
 */
export interface EquipmentSlot {
  type: EquipmentSlotType;
  category: ItemCategory;
  label: string;
  row: number; // Row number in the grid (1-6)
  col: number; // Column position: 1=left, 2=center, 3=right
}

/**
 * Equipped items mapped to slots
 */
export interface EquippedGear {
  HELMET?: Item;
  NECKLACE?: Item;
  ARMOR?: Item;
  PANTS?: Item;
  BOOTS?: Item;
  EARRING_1?: Item;
  EARRING_2?: Item;
  RING_1?: Item;
  RING_2?: Item;
  WEAPON?: Item;
  SHIELD?: Item;
  GLOVES?: Item;
}

/**
 * Equipment slot definitions matching Lineage 2 character screen layout
 * Organized in rows to form character silhouette:
 * Row 1: Helmet (center only)
 * Row 2: Gloves (left) + Armor (center, large) + Boots (right)
 * Row 3: Pants (center only)
 * Row 4: Weapon (left) + Shield (right)
 * Row 5: Accessories top row - Earring 1 (left) + Necklace (center) + Earring 2 (right)
 * Row 6: Accessories bottom row - Ring 1 (left) + Ring 2 (right) - staggered/pyramid layout
 */
export const EQUIPMENT_SLOTS: EquipmentSlot[] = [
  // Row 1: Helmet (center only)
  { type: 'HELMET', category: 'HELMET', label: 'Elmo', row: 1, col: 2 },

  // Row 2: Gloves + Armor + Boots
  { type: 'GLOVES', category: 'GLOVES', label: 'Luvas', row: 2, col: 1 },
  { type: 'ARMOR', category: 'ARMOR', label: 'Armadura', row: 2, col: 2 },
  { type: 'BOOTS', category: 'BOOTS', label: 'Botas', row: 2, col: 3 },

  // Row 3: Pants (center only)
  { type: 'PANTS', category: 'PANTS', label: 'Calças', row: 3, col: 2 },

  // Row 4: Weapons
  { type: 'WEAPON', category: 'WEAPON', label: 'Arma', row: 4, col: 1 },
  { type: 'SHIELD', category: 'SHIELD', label: 'Escudo', row: 4, col: 3 },

  // Row 5: Accessories top row - Earrings + Necklace (3 items)
  { type: 'EARRING_1', category: 'EARRING', label: 'Brinco', row: 5, col: 1 },
  { type: 'NECKLACE', category: 'NECKLACE', label: 'Colar', row: 5, col: 2 },
  { type: 'EARRING_2', category: 'EARRING', label: 'Brinco', row: 5, col: 3 },

  // Row 6: Accessories bottom row - Rings (2 items, staggered)
  { type: 'RING_1', category: 'RING', label: 'Anel', row: 6, col: 1 },
  { type: 'RING_2', category: 'RING', label: 'Anel', row: 6, col: 3 },
];

/**
 * Map items from backend format to equipment slots
 * @param itemIds - Array of item IDs (can contain duplicates for jewelry)
 * @param items - Array of unique item objects
 */
export function mapItemsToSlots(itemIds: string[], items: Item[]): EquippedGear {
  const equipped: EquippedGear = {};

  // Create a map of item ID to item object for quick lookup
  const itemMap = new Map<string, Item>();
  items.forEach(item => {
    itemMap.set(item.id, item);
  });

  // Group item IDs by category (preserving duplicates)
  const idsByCategory: Record<string, string[]> = {};
  itemIds.forEach(id => {
    const item = itemMap.get(id);
    if (item) {
      if (!idsByCategory[item.category]) {
        idsByCategory[item.category] = [];
      }
      idsByCategory[item.category].push(id);
    }
  });

  // Map single-slot items
  const helmetIds = idsByCategory['HELMET'] || [];
  if (helmetIds.length > 0) {
    equipped.HELMET = itemMap.get(helmetIds[0]);
  }

  const necklaceIds = idsByCategory['NECKLACE'] || [];
  if (necklaceIds.length > 0) {
    equipped.NECKLACE = itemMap.get(necklaceIds[0]);
  }

  const armorIds = idsByCategory['ARMOR'] || [];
  if (armorIds.length > 0) {
    equipped.ARMOR = itemMap.get(armorIds[0]);
  }

  const pantsIds = idsByCategory['PANTS'] || [];
  if (pantsIds.length > 0) {
    equipped.PANTS = itemMap.get(pantsIds[0]);
  }

  const bootsIds = idsByCategory['BOOTS'] || [];
  if (bootsIds.length > 0) {
    equipped.BOOTS = itemMap.get(bootsIds[0]);
  }

  const weaponIds = idsByCategory['WEAPON'] || [];
  if (weaponIds.length > 0) {
    equipped.WEAPON = itemMap.get(weaponIds[0]);
  }

  const shieldIds = idsByCategory['SHIELD'] || [];
  if (shieldIds.length > 0) {
    equipped.SHIELD = itemMap.get(shieldIds[0]);
  }

  const glovesIds = idsByCategory['GLOVES'] || [];
  if (glovesIds.length > 0) {
    equipped.GLOVES = itemMap.get(glovesIds[0]);
  }

  // Map jewelry items (2 slots each) - SUPPORTS DUPLICATES
  const earringIds = idsByCategory['EARRING'] || [];
  if (earringIds.length > 0) {
    equipped.EARRING_1 = itemMap.get(earringIds[0]);
  }
  if (earringIds.length > 1) {
    equipped.EARRING_2 = itemMap.get(earringIds[1]);
  }

  const ringIds = idsByCategory['RING'] || [];
  if (ringIds.length > 0) {
    equipped.RING_1 = itemMap.get(ringIds[0]);
  }
  if (ringIds.length > 1) {
    equipped.RING_2 = itemMap.get(ringIds[1]);
  }

  return equipped;
}

/**
 * Convert equipped gear back to backend format (array of item IDs)
 */
export function mapSlotsToItemIds(equipped: EquippedGear): string[] {
  const itemIds: string[] = [];

  // Add all equipped items
  Object.values(equipped).forEach((item) => {
    if (item) {
      itemIds.push(item.id);
    }
  });

  return itemIds;
}

/**
 * Get the category for a slot type
 */
export function getSlotCategory(slotType: EquipmentSlotType): ItemCategory {
  const slot = EQUIPMENT_SLOTS.find((s) => s.type === slotType);
  return slot?.category || 'HELMET';
}

/**
 * Get the label for a slot type
 */
export function getSlotLabel(slotType: EquipmentSlotType): string {
  const slot = EQUIPMENT_SLOTS.find((s) => s.type === slotType);
  return slot?.label || slotType;
}

/**
 * Check if a slot is a jewelry slot (can have 2 items)
 */
export function isJewelrySlot(slotType: EquipmentSlotType): boolean {
  return slotType.startsWith('RING_') || slotType.startsWith('EARRING_');
}

/**
 * Get the paired slot for jewelry (e.g., RING_1 -> RING_2)
 */
export function getPairedSlot(
  slotType: EquipmentSlotType
): EquipmentSlotType | null {
  if (slotType === 'RING_1') return 'RING_2';
  if (slotType === 'RING_2') return 'RING_1';
  if (slotType === 'EARRING_1') return 'EARRING_2';
  if (slotType === 'EARRING_2') return 'EARRING_1';
  return null;
}

/**
 * Get grade color classes for styling (works in both light and dark themes)
 */
export function getGradeColorClasses(grade: string): string {
  switch (grade) {
    case 'D':
      return 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/40';
    case 'C':
      return 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/40';
    case 'B':
      return 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/40';
    case 'A':
      return 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/40';
    case 'S':
      return 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/40';
    default:
      return 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/40';
  }
}

/**
 * Get grade glow color for visual effects (works in both themes)
 */
export function getGradeGlowColor(grade: string): string {
  switch (grade) {
    case 'D':
      return 'shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40';
    case 'C':
      return 'shadow-md shadow-green-500/30 hover:shadow-lg hover:shadow-green-500/40';
    case 'B':
      return 'shadow-md shadow-red-500/30 hover:shadow-lg hover:shadow-red-500/40';
    case 'A':
      return 'shadow-md shadow-purple-500/30 hover:shadow-lg hover:shadow-purple-500/40';
    case 'S':
      return 'shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40';
    default:
      return 'shadow-md shadow-gray-500/30 hover:shadow-lg hover:shadow-gray-500/40';
  }
}

