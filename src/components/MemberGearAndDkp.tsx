import React from 'react';
import {
  Star,
  Package,
  Coins,
  TrendingUp,
  Award,
  History,
  Image,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useUserGearById } from '../hooks/gear.hooks';
import { useUserDkpSummary, useUserDkpHistory } from '../hooks/dkp.hooks';
import { EquipmentGridReadOnly } from './EquipmentGridReadOnly';

interface MemberGearAndDkpProps {
  userId: string;
  userName: string;
  bagUrl?: string | null;
  isReadOnly?: boolean;
}

export const MemberGearAndDkp: React.FC<MemberGearAndDkpProps> = ({
  userId,
  userName,
  bagUrl,
  isReadOnly = false,
}) => {
  const {
    data: gear,
    isLoading: gearLoading,
    error: gearError,
  } = useUserGearById(userId);
  const {
    data: dkpSummary,
    isLoading: dkpLoading,
    error: dkpError,
  } = useUserDkpSummary(userId);
  const { data: dkpHistory, isLoading: historyLoading } = useUserDkpHistory(
    userId,
    { limit: 5 }
  );

  if (gearLoading || dkpLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  if (gearError || dkpError) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar dados</h3>
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar as informações de gear e DKP
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {isReadOnly && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-700">
            Visualização somente leitura - Apenas administradores podem editar
            informações
          </span>
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumo</TabsTrigger>
          <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
          <TabsTrigger value="dkp">DKP</TabsTrigger>
          <TabsTrigger value="inventory">Inventário</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Gear Score</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {gear?.gearScore || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Coins className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">DKP Atual</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {dkpSummary?.currentDkpPoints || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Itens</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {gear?.ownedItems.length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Award className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Raids</p>
                    <p className="text-2xl font-bold text-green-600">
                      {dkpSummary?.raidParticipations || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent DKP Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Atividade DKP Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="text-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Carregando histórico...
                  </p>
                </div>
              ) : dkpHistory?.data && dkpHistory.data.length > 0 ? (
                <div className="space-y-3">
                  {dkpHistory.data.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{transaction.reason}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString(
                            'pt-BR'
                          )}
                        </p>
                      </div>
                      <Badge
                        variant={
                          transaction.amount > 0 ? 'default' : 'destructive'
                        }
                      >
                        {transaction.amount > 0 ? '+' : ''}
                        {transaction.amount} DKP
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Nenhuma atividade DKP encontrada
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          {/* Equipment Grid Visualization */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">{gear?.gearScore || 0}</span>
                <span className="text-sm text-muted-foreground">GS</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                <span className="text-lg font-medium">
                  {gear?.ownedItems.length || 0}
                </span>
                <span className="text-sm text-muted-foreground">itens equipados</span>
              </div>
            </div>
          </div>

          <EquipmentGridReadOnly gear={gear} />
        </TabsContent>

        <TabsContent value="dkp" className="space-y-4">
          {/* DKP Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Coins className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">DKP Atual</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {dkpSummary?.currentDkpPoints || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Ganho</p>
                    <p className="text-2xl font-bold text-green-600">
                      {dkpSummary?.totalEarned || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Award className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      DKP de Raids
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {dkpSummary?.totalRaidRewards || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <History className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Participações
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {dkpSummary?.raidParticipations || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          {bagUrl ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Inventário de {userName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <img
                    src={bagUrl}
                    alt={`Inventário de ${userName}`}
                    className="max-w-full h-auto rounded-lg border shadow-sm mx-auto"
                    style={{ maxHeight: '600px' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden text-center py-8">
                    <Image className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      Erro ao carregar a imagem
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Verifique se a URL está correta
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhuma imagem configurada
                </h3>
                <p className="text-sm text-muted-foreground">
                  Este membro ainda não configurou uma URL de inventário
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
