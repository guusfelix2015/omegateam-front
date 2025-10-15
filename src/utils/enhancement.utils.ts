/**
 * Calculate enhancement bonus GS
 *
 * @param level - Enhancement level (0-12)
 * @returns Bonus GS from enhancement
 */
export function calculateEnhancementBonus(level: number): number {
  if (level < 0 || level > 12) {
    console.warn('Enhancement level out of range:', level);
    return 0;
  }

  if (level === 0) return 0;
  if (level <= 3) return level;

  return 3 + (level - 3) * 3;
}

/**
 * Calculate total item GS including enhancement
 *
 * @param baseGS - Base GS of item
 * @param enhancementLevel - Enhancement level (0-12)
 * @returns Total GS
 */
export function calculateTotalItemGS(
  baseGS: number,
  enhancementLevel: number
): number {
  return baseGS + calculateEnhancementBonus(enhancementLevel);
}

/**
 * Get enhancement badge gradient classes based on level
 *
 * @param level - Enhancement level (0-12)
 * @returns Tailwind CSS classes for gradient
 */
export function getEnhancementGradient(level: number): string {
  const gradients: Record<number, string> = {
    0: '',
    1: 'from-blue-100 to-blue-200',
    2: 'from-blue-200 to-blue-300',
    3: 'from-blue-300 to-blue-400',
    4: 'from-blue-400 to-blue-500',
    5: 'from-blue-500 to-blue-600',
    6: 'from-blue-600 to-blue-700',
    7: 'from-blue-700 to-blue-800',
    8: 'from-blue-800 to-blue-900',
    9: 'from-blue-900 to-blue-950',
    10: 'from-blue-950 to-slate-900',
    11: 'from-slate-900 to-slate-950',
    12: 'from-slate-950 to-black',
  };

  return gradients[level] || '';
}

/**
 * Format enhancement level for display
 *
 * @param level - Enhancement level
 * @returns Formatted string (e.g., "+3")
 */
export function formatEnhancementLevel(level: number): string {
  return level > 0 ? `+${level}` : '';
}

