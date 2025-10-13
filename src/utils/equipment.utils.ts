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
 * Equipment slot configuration
 */
export interface EquipmentSlot {
  type: EquipmentSlotType;
  category: ItemCategory;
  label: string;
  position: 'left' | 'center' | 'right';
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
 * Equipment slot definitions with their positions in the grid
 */
export const EQUIPMENT_SLOTS: EquipmentSlot[] = [
  // Left column - Accessories
  { type: 'EARRING_1', category: 'EARRING', label: 'Brinco 1', position: 'left' },
  { type: 'RING_1', category: 'RING', label: 'Anel 1', position: 'left' },
  { type: 'RING_2', category: 'RING', label: 'Anel 2', position: 'left' },

  // Center column - Main Equipment
  { type: 'HELMET', category: 'HELMET', label: 'Capacete', position: 'center' },
  { type: 'NECKLACE', category: 'NECKLACE', label: 'Colar', position: 'center' },
  { type: 'ARMOR', category: 'ARMOR', label: 'Armadura', position: 'center' },
  { type: 'PANTS', category: 'PANTS', label: 'Calças', position: 'center' },
  { type: 'BOOTS', category: 'BOOTS', label: 'Botas', position: 'center' },

  // Right column - Combat Equipment & Accessories
  { type: 'EARRING_2', category: 'EARRING', label: 'Brinco 2', position: 'right' },
  { type: 'WEAPON', category: 'WEAPON', label: 'Arma', position: 'right' },
  { type: 'SHIELD', category: 'SHIELD', label: 'Escudo', position: 'right' },
  { type: 'GLOVES', category: 'GLOVES', label: 'Luvas', position: 'right' },
];

/**
 * Map items from backend format (array of item IDs) to equipment slots
 */
export function mapItemsToSlots(items: Item[]): EquippedGear {
  const equipped: EquippedGear = {};

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  // Map single-slot items
  const helmet = itemsByCategory['HELMET'];
  if (helmet && helmet.length > 0) equipped.HELMET = helmet[0];

  const necklace = itemsByCategory['NECKLACE'];
  if (necklace && necklace.length > 0) equipped.NECKLACE = necklace[0];

  const armor = itemsByCategory['ARMOR'];
  if (armor && armor.length > 0) equipped.ARMOR = armor[0];

  const pants = itemsByCategory['PANTS'];
  if (pants && pants.length > 0) equipped.PANTS = pants[0];

  const boots = itemsByCategory['BOOTS'];
  if (boots && boots.length > 0) equipped.BOOTS = boots[0];

  const weapon = itemsByCategory['WEAPON'];
  if (weapon && weapon.length > 0) equipped.WEAPON = weapon[0];

  const shield = itemsByCategory['SHIELD'];
  if (shield && shield.length > 0) equipped.SHIELD = shield[0];

  const gloves = itemsByCategory['GLOVES'];
  if (gloves && gloves.length > 0) equipped.GLOVES = gloves[0];

  // Map jewelry items (2 slots each)
  const earrings = itemsByCategory['EARRING'] || [];
  if (earrings.length > 0) equipped.EARRING_1 = earrings[0];
  if (earrings.length > 1) equipped.EARRING_2 = earrings[1];

  const rings = itemsByCategory['RING'] || [];
  if (rings.length > 0) equipped.RING_1 = rings[0];
  if (rings.length > 1) equipped.RING_2 = rings[1];

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
 * Get grade color classes for styling (dark theme optimized)
 */
export function getGradeColorClasses(grade: string): string {
  switch (grade) {
    case 'D':
      return 'bg-blue-500/30 text-blue-200 border-blue-400/60 shadow-blue-500/20';
    case 'C':
      return 'bg-green-500/30 text-green-200 border-green-400/60 shadow-green-500/20';
    case 'B':
      return 'bg-red-500/30 text-red-200 border-red-400/60 shadow-red-500/20';
    case 'A':
      return 'bg-purple-500/30 text-purple-200 border-purple-400/60 shadow-purple-500/20';
    case 'S':
      return 'bg-orange-500/30 text-orange-200 border-orange-400/60 shadow-orange-500/20';
    default:
      return 'bg-gray-500/30 text-gray-200 border-gray-400/60 shadow-gray-500/20';
  }
}

/**
 * Get grade glow color for visual effects (enhanced for dark theme)
 */
export function getGradeGlowColor(grade: string): string {
  switch (grade) {
    case 'D':
      return 'shadow-lg shadow-blue-500/40 hover:shadow-blue-400/60';
    case 'C':
      return 'shadow-lg shadow-green-500/40 hover:shadow-green-400/60';
    case 'B':
      return 'shadow-lg shadow-red-500/40 hover:shadow-red-400/60';
    case 'A':
      return 'shadow-lg shadow-purple-500/40 hover:shadow-purple-400/60';
    case 'S':
      return 'shadow-lg shadow-orange-500/40 hover:shadow-orange-400/60';
    default:
      return 'shadow-lg shadow-gray-500/40 hover:shadow-gray-400/60';
  }
}

