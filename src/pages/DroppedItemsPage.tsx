/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Coins,
  Search,
  Filter,
  Calendar,
  Swords,
  TrendingUp,
  Package,
  Loader2,
  ExternalLink,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Layout } from '../components/Layout';
import { useRaidDroppedItems, useRaidDroppedItemStats } from '../hooks/raid-dropped-items.hooks';
import type { ItemCategory, ItemGrade } from '../types/api';

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

const GRADE_COLORS: Record<string, string> = {
  D: 'bg-gray-500',
  C: 'bg-green-500',
  B: 'bg-blue-500',
  A: 'bg-purple-500',
  S: 'bg-orange-500',
};

export default function DroppedItemsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'droppedAt' | 'name' | 'minDkpBid'>('droppedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: droppedItemsData, isLoading, error } = useRaidDroppedItems({
    page: currentPage,
    limit: 20,
    category: selectedCategory !== 'ALL' ? (selectedCategory as ItemCategory) : undefined,
    grade: selectedGrade !== 'ALL' ? (selectedGrade as ItemGrade) : undefined,
    sortBy,
    sortOrder,
  });

  const { data: stats, isLoading: statsLoading } = useRaidDroppedItemStats();

  const handleItemClick = (item: any) => {
    navigate(`/raid-instances/${item.raidInstanceId}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSelectedGrade('ALL');
    setSortBy('droppedAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const filteredItems = droppedItemsData?.data?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando itens dropados...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-destructive">Erro ao carregar itens dropados</p>
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
            <Coins className="h-8 w-8 text-primary" />
            Itens Dropados
          </h1>
          <p className="text-muted-foreground mt-1">
            Todos os itens dropados em raids da CP
          </p>
        </div>

        {/* Stats Cards */}
        {stats && !statsLoading && (
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Itens</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Coins className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Lance Médio</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {Math.round(stats.averageMinDkpBid)} DKP
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
                    <p className="text-sm text-muted-foreground">Categoria Mais Comum</p>
                    <p className="text-lg font-bold text-green-600">
                      {Object.entries(stats.totalByCategory).length > 0
                        ? CATEGORY_LABELS[Object.entries(stats.totalByCategory).reduce((a, b) =>
                          stats.totalByCategory[a[0]] > stats.totalByCategory[b[0]] ? a : b
                        )[0]] || 'N/A'
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Swords className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Grade Mais Comum</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Object.entries(stats.totalByGrade).length > 0
                        ? Object.entries(stats.totalByGrade).reduce((a, b) =>
                          stats.totalByGrade[a[0]] > stats.totalByGrade[b[0]] ? a : b
                        )[0] || 'N/A'
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nome do item..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todas</SelectItem>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Grade</label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todas</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="S">S</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ordenar por</label>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="droppedAt">Data do Drop</SelectItem>
                    <SelectItem value="name">Nome</SelectItem>
                    <SelectItem value="minDkpBid">Lance Mínimo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ordem</label>
                <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Decrescente</SelectItem>
                    <SelectItem value="asc">Crescente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Itens Encontrados ({filteredItems.length})
            </CardTitle>
            <CardDescription>
              Clique em um item para ver a raid instance onde foi dropado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredItems.length === 0 ? (
              <div className="text-center py-8">
                <Coins className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum item encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou termo de busca.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{item.name}</h4>
                          <Badge variant="outline" className={`text-white ${GRADE_COLORS[item.grade]}`}>
                            {item.grade}
                          </Badge>
                          <Badge variant="secondary">
                            {CATEGORY_LABELS[item.category] || item.category}
                          </Badge>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Coins className="h-4 w-4" />
                            <span className="font-medium">{item.minDkpBid} DKP</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(item.droppedAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Swords className="h-4 w-4" />
                            <span>{item.raidInstance?.raid?.name || 'Raid desconhecida'}</span>
                          </div>
                        </div>

                        {item.notes && (
                          <p className="text-sm text-muted-foreground italic">
                            "{item.notes}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {droppedItemsData?.pagination && droppedItemsData.pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!droppedItemsData.pagination.hasPrev}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {droppedItemsData.pagination.page} de {droppedItemsData.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!droppedItemsData.pagination.hasNext}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
