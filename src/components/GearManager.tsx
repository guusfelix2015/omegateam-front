import { Package, Star, Image } from 'lucide-react';
import { useUserGear } from '../hooks/gear.hooks';
import { Loader2 } from 'lucide-react';
import { InventoryUrlTab } from './InventoryUrlTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { EquipmentGrid } from './EquipmentGrid';

export const GearManager: React.FC = () => {
  const { data: gear, isLoading, error } = useUserGear();

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
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">{gear?.gearScore || 0}</span>
                <span className="text-sm text-muted-foreground">GS</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                <span className="text-lg font-medium">
                  {gear?.userItems?.length || 0}
                </span>
                <span className="text-sm text-muted-foreground">itens equipados</span>
              </div>
            </div>
          </div>

          {/* Equipment Grid */}
          <EquipmentGrid gear={gear} />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryUrlTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
