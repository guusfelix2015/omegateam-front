/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from 'react';
import {
  Check,
  Star,
  Package,
  Sword,
  Shield,
  Crown,
  Loader2,
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
import { Checkbox } from './ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useItems } from '../hooks/items.hooks';
import { useUpdateUserGear } from '../hooks/gear.hooks';
import type { UserGearResponse } from '../types/api';

interface GearSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGear?: UserGearResponse;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'WEAPON':
      return <Sword className="h-4 w-4" />;
    case 'ARMOR':
    case 'HELMET':
    case 'PANTS':
    case 'BOOTS':
    case 'GLOVES':
      return <Shield className="h-4 w-4" />;
    case 'RING':
    case 'NECKLACE':
    case 'EARRING':
      return <Crown className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'D':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'C':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'B':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'A':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'S':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getCategoryName = (category: string) => {
  const names: Record<string, string> = {
    HELMET: 'Capacete',
    ARMOR: 'Armadura',
    PANTS: 'Calças',
    BOOTS: 'Botas',
    GLOVES: 'Luvas',
    NECKLACE: 'Colar',
    EARRING: 'Brinco',
    RING: 'Anel',
    SHIELD: 'Escudo',
    WEAPON: 'Arma',
  };
  return names[category] || category;
};

export const GearSelectionModal: React.FC<GearSelectionModalProps> = ({
  isOpen,
  onClose,
  currentGear,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  // Track quantities per item: Map<itemId, quantity>
  const [itemQuantities, setItemQuantities] = useState<Map<string, number>>(
    new Map()
  );

  const { data: itemsData, isLoading } = useItems({
    search: search || undefined,
    category: categoryFilter !== 'all' ? (categoryFilter as any) : undefined,
    grade: gradeFilter !== 'all' ? (gradeFilter as any) : undefined,
    limit: 100, // Get more items for selection
  });

  const updateGearMutation = useUpdateUserGear();

  const items = useMemo(() => itemsData?.data || [], [itemsData?.data]);

  // Initialize quantities from currentGear
  useEffect(() => {
    if (currentGear?.userItems) {
      const quantities = new Map<string, number>();
      currentGear.userItems.forEach((userItem) => {
        const itemId = userItem.itemId;
        quantities.set(itemId, (quantities.get(itemId) || 0) + 1);
      });
      setItemQuantities(quantities);
    }
  }, [currentGear]);

  const totalGearScore = useMemo(() => {
    let total = 0;
    itemQuantities.forEach((quantity, itemId) => {
      const item = items.find((i) => i.id === itemId);
      if (item) {
        total += item.valorGsInt * quantity;
      }
    });
    return total;
  }, [items, itemQuantities]);

  const totalItemCount = useMemo(() => {
    let count = 0;
    itemQuantities.forEach((quantity) => {
      count += quantity;
    });
    return count;
  }, [itemQuantities]);

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setItemQuantities((prev) => {
      const newMap = new Map(prev);
      if (quantity === 0) {
        newMap.delete(itemId);
      } else {
        newMap.set(itemId, quantity);
      }
      return newMap;
    });
  };

  const handleToggle = (itemId: string) => {
    setItemQuantities((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(itemId) || 0;
      if (current > 0) {
        newMap.delete(itemId);
      } else {
        newMap.set(itemId, 1);
      }
      return newMap;
    });
  };

  const handleSave = async () => {
    // Convert Map<itemId, quantity> to items array with enhancement levels
    const items: { itemId: string; enhancementLevel: number }[] = [];
    itemQuantities.forEach((quantity, itemId) => {
      for (let i = 0; i < quantity; i++) {
        items.push({
          itemId,
          enhancementLevel: 0, // Default to 0, user can change later
        });
      }
    });

    try {
      await updateGearMutation.mutateAsync({ items });
      onClose();
    } catch (error) {
      console.error('Error updating gear:', error);
    }
  };

  const handleClose = () => {
    // Reset to current gear
    if (currentGear?.userItems) {
      const quantities = new Map<string, number>();
      currentGear.userItems.forEach((userItem) => {
        const itemId = userItem.itemId;
        quantities.set(itemId, (quantities.get(itemId) || 0) + 1);
      });
      setItemQuantities(quantities);
    } else {
      setItemQuantities(new Map());
    }
    setSearch('');
    setCategoryFilter('all');
    setGradeFilter('all');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Gerenciar Itens
          </DialogTitle>
          <DialogDescription>
            Selecione os itens que você possui para calcular seu gear score
          </DialogDescription>
        </DialogHeader>

        {/* Gear Score Preview */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              <span className="text-lg font-bold text-yellow-800">
                {totalGearScore}
              </span>
              <span className="text-xs text-yellow-600">GS</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">
                {totalItemCount}
              </span>
              <span className="text-xs text-blue-600">itens</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateGearMutation.isPending}
              size="sm"
              className="flex items-center gap-2"
            >
              {updateGearMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Salvar
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar itens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              <SelectItem value="WEAPON">Arma</SelectItem>
              <SelectItem value="ARMOR">Armadura</SelectItem>
              <SelectItem value="HELMET">Capacete</SelectItem>
              <SelectItem value="PANTS">Calças</SelectItem>
              <SelectItem value="BOOTS">Botas</SelectItem>
              <SelectItem value="GLOVES">Luvas</SelectItem>
              <SelectItem value="SHIELD">Escudo</SelectItem>
              <SelectItem value="NECKLACE">Colar</SelectItem>
              <SelectItem value="EARRING">Brinco</SelectItem>
              <SelectItem value="RING">Anel</SelectItem>
            </SelectContent>
          </Select>
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="D">Grade D</SelectItem>
              <SelectItem value="C">Grade C</SelectItem>
              <SelectItem value="B">Grade B</SelectItem>
              <SelectItem value="A">Grade A</SelectItem>
              <SelectItem value="S">Grade S</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Carregando itens...</span>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum item encontrado</p>
            </div>
          ) : (
            <div className="space-y-1">
              {items.map((item) => {
                const currentQuantity = itemQuantities.get(item.id) || 0;
                const isJewelry =
                  item.category === 'RING' || item.category === 'EARRING';

                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-2 border rounded-md transition-colors ${currentQuantity > 0
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted/30'
                      }`}
                  >
                    {/* Item control - Checkbox or Quantity Selector */}
                    {isJewelry ? (
                      <Select
                        value={currentQuantity.toString()}
                        onValueChange={(value) =>
                          handleQuantityChange(item.id, parseInt(value))
                        }
                      >
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0x</SelectItem>
                          <SelectItem value="1">1x</SelectItem>
                          <SelectItem value="2">2x</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div
                        onClick={() => handleToggle(item.id)}
                        className="cursor-pointer"
                      >
                        <Checkbox
                          checked={currentQuantity > 0}
                          onChange={() => handleToggle(item.id)}
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="text-muted-foreground">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs h-4 px-1">
                            {getCategoryName(item.category)}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {item.valorGsInt}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {item.valorDkp}
                          </span>
                        </div>
                      </div>
                      <Badge
                        className={`${getGradeColor(item.grade)} text-xs h-5 px-2`}
                      >
                        {item.grade}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
