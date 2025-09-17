import { useState } from 'react';
import { Package, Plus, Star, Sword, Shield, Crown, Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useUserGear } from '../hooks/gear.hooks';
import { Loader2 } from 'lucide-react';
import { GearSelectionModal } from './GearSelectionModal';
import { InventoryUrlTab } from './InventoryUrlTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

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

export const GearManager: React.FC = () => {
  const { data: gear, isLoading, error } = useUserGear();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando gear...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erro ao carregar gear</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : 'Erro desconhecido'}
        </p>
      </div>
    );
  }

  const groupedItems = gear?.ownedItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof gear.ownedItems>) || {};

  return (
    <div className="space-y-4">
      <Tabs defaultValue="gear" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gear" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Gear & Itens
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Inventário URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gear" className="space-y-4">
          {/* Gear Score Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-bold">{gear?.gearScore || 0}</span>
                <span className="text-sm text-muted-foreground">GS</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{gear?.ownedItems.length || 0}</span>
                <span className="text-sm text-muted-foreground">itens</span>
              </div>
            </div>
            <Button onClick={() => setIsModalOpen(true)} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Gerenciar
            </Button>
          </div>

          {/* Items by Category */}
          {gear?.ownedItems && gear.ownedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(groupedItems).map(([category, items]) => (
                <Card key={category} className="overflow-hidden">
                  <CardHeader className="pb-2 px-3 py-2 bg-muted/30">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      {getCategoryIcon(category)}
                      {getCategoryName(category)}
                      <Badge variant="secondary" className="text-xs h-4">{items.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1 p-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 p-2 bg-muted/20 rounded-md hover:bg-muted/40 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{item.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {item.valorGsInt}
                              </span>
                              <Badge className={`${getGradeColor(item.grade)} text-xs h-4 px-1`}>
                                {item.grade}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-semibold mb-2">Nenhum item equipado</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Comece a equipar itens para aumentar seu gear score
                </p>
                <Button onClick={() => setIsModalOpen(true)} size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Itens
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryUrlTab />
        </TabsContent>
      </Tabs>

      {/* Gear Selection Modal */}
      <GearSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentGear={gear}
      />
    </div>
  );
};
