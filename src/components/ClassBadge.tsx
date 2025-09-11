import { cn } from "@/lib/utils";

interface ClassBadgeProps {
  className?: string;
  classeName: string;
  size?: "sm" | "md" | "lg";
}

// Mapeamento de cores baseado nos tipos de classe do Lineage 2
const getClassColor = (className: string): string => {
  const classLower = className.toLowerCase();

  // Fighters (Guerreiros) - Tons de vermelho/laranja
  if (classLower.includes('gladiador') || classLower.includes('warlord') || classLower.includes('paladin') ||
    classLower.includes('dark avenger') || classLower.includes('destroyer') || classLower.includes('tyrant')) {
    return 'bg-red-500 hover:bg-red-600 text-white';
  }

  // Knights (Cavaleiros) - Tons de azul
  if (classLower.includes('temple knight') || classLower.includes('shillien knight')) {
    return 'bg-blue-600 hover:bg-blue-700 text-white';
  }

  // Archers (Arqueiros) - Tons de verde
  if (classLower.includes('hawkeye') || classLower.includes('silver ranger') ||
    classLower.includes('phantom ranger') || classLower.includes('abyss walker')) {
    return 'bg-green-600 hover:bg-green-700 text-white';
  }

  // Rogues (Ladinos) - Tons de roxo/violeta
  if (classLower.includes('treasure hunter') || classLower.includes('plainswalker') ||
    classLower.includes('abyss walker') || classLower.includes('spoiler')) {
    return 'bg-purple-600 hover:bg-purple-700 text-white';
  }

  // Mages (Magos) - Tons de azul claro/ciano
  if (classLower.includes('sorcerer') || classLower.includes('necromancer') ||
    classLower.includes('warlock') || classLower.includes('elemental summoner') ||
    classLower.includes('phantom summoner')) {
    return 'bg-cyan-600 hover:bg-cyan-700 text-white';
  }

  // Healers/Support (Curandeiros) - Tons de amarelo/dourado
  if (classLower.includes('bishop') || classLower.includes('prophet') ||
    classLower.includes('elven elder') || classLower.includes('shillien elder')) {
    return 'bg-yellow-500 hover:bg-yellow-600 text-white';
  }

  // Enchanters/Buffers - Tons de rosa/magenta
  if (classLower.includes('spell singer') || classLower.includes('sword singer') ||
    classLower.includes('bladedancer') || classLower.includes('spell howler') ||
    classLower.includes('warcryer') || classLower.includes('overlord')) {
    return 'bg-pink-600 hover:bg-pink-700 text-white';
  }

  // Crafters/Special - Tons de cinza
  if (classLower.includes('crafter')) {
    return 'bg-gray-600 hover:bg-gray-700 text-white';
  }

  // Default - Tons neutros
  return 'bg-slate-600 hover:bg-slate-700 text-white';
};

const getSizeClasses = (size: "sm" | "md" | "lg"): string => {
  switch (size) {
    case "sm":
      return "text-xs px-2 py-1";
    case "lg":
      return "text-sm px-3 py-1.5";
    case "md":
    default:
      return "text-xs px-2.5 py-1";
  }
};

export function ClassBadge({ className, classeName, size = "md" }: ClassBadgeProps) {
  const colorClasses = getClassColor(classeName);
  const sizeClasses = getSizeClasses(size);

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "font-medium tracking-tight",
        "rounded border-0",
        "transition-colors duration-200",
        "shadow-sm",
        colorClasses,
        sizeClasses,
        className
      )}
    >
      {classeName}
    </span>
  );
}
