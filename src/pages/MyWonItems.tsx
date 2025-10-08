/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Award, Loader2, Trophy, Calendar, Coins } from 'lucide-react';
import { useMyWonItems } from '../hooks/auction.hooks';
import { WonItemsFilters } from '../components/auction/WonItemsFilters';
import { Layout } from '../components/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const GRADE_COLORS: Record<string, string> = {
  D: 'bg-gray-500',
  C: 'bg-green-500',
  B: 'bg-blue-500',
  A: 'bg-purple-500',
  S: 'bg-orange-500',
};

const CATEGORY_LABELS: Record<string, string> = {
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
  COMUM: 'Comum',
};

export default function MyWonItems() {
  const [filters, setFilters] = useState<any>({});
  const { data: wonItems, isLoading, error } = useMyWonItems(filters);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando seus itens ganhos...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-destructive">Erro ao carregar itens ganhos</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Award className="h-8 w-8 text-primary" />
            Meus Itens Ganhos
          </h1>
          <p className="text-muted-foreground mt-1">
            Itens que você ganhou em leilões
          </p>
        </div>

        {/* Filters */}
        <WonItemsFilters onFilterChange={setFilters} />

        {/* Items List */}
        {!wonItems || wonItems.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Nenhum item ganho ainda
                </h3>
                <p className="text-muted-foreground">
                  Você ainda não ganhou nenhum item em leilões.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Itens Ganhos ({wonItems.length})</CardTitle>
                <CardDescription>
                  Total de DKP gasto:{' '}
                  {wonItems.reduce((sum, item) => sum + item.amountPaid, 0)} DKP
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wonItems.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{item.itemName}</h4>
                            <Badge
                              variant="outline"
                              className={`text-white ${GRADE_COLORS[item.grade]}`}
                            >
                              {item.grade}
                            </Badge>
                            <Badge variant="secondary">
                              {CATEGORY_LABELS[item.category] || item.category}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Trophy className="h-4 w-4" />
                              <span>{item.raidName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Coins className="h-4 w-4 text-green-600" />
                              <span className="font-semibold text-green-600">
                                {item.amountPaid} DKP
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(item.wonAt).toLocaleDateString(
                                  'pt-BR'
                                )}{' '}
                                às{' '}
                                {new Date(item.wonAt).toLocaleTimeString(
                                  'pt-BR',
                                  {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
