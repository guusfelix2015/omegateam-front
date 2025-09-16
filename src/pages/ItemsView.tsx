import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Loader2, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useItems, useLookups } from '../hooks/items.hooks';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/Layout';
import { useDebounce } from '../hooks/useDebounce';
import type { ItemCategory, ItemGrade } from '../types/api';

const CATEGORY_LABELS: Record<ItemCategory, string> = {
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

const GRADE_COLORS: Record<ItemGrade, string> = {
  D: 'bg-gray-500',
  C: 'bg-green-500',
  B: 'bg-blue-500',
  A: 'bg-purple-500',
  S: 'bg-red-500',
};

export default function ItemsView() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  const { data: itemsData, isLoading, error } = useItems({
    page,
    limit: 12,
    search: debouncedSearch,
    category: category || undefined,
    grade: grade || undefined,
  });

  const { data: lookups } = useLookups();
  const { isAdmin } = useAuth();

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setGrade('');
    setPage(1);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando itens...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-red-500">Erro ao carregar itens</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
        </div>
      </Layout>
    );
  }

  const items = itemsData?.data || [];
  const pagination = itemsData?.pagination;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Itens</h1>
            <p className="text-muted-foreground">
              Visualize os itens disponíveis no sistema
            </p>
          </div>
          {isAdmin && (
            <Button asChild variant="outline">
              <Link to="/admin/items">
                <Settings className="mr-2 h-4 w-4" />
                Administrar Itens
              </Link>
            </Button>
          )}
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {lookups?.categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORY_LABELS[cat as ItemCategory]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as grades</SelectItem>
                  {lookups?.grades.map((gr) => (
                    <SelectItem key={gr} value={gr}>
                      Grade {gr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Itens */}
        {items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Nenhum item encontrado</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>
                        {CATEGORY_LABELS[item.category]}
                      </CardDescription>
                    </div>
                    <Badge
                      className={`${GRADE_COLORS[item.grade]} text-white`}
                    >
                      {item.grade}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GS INT:</span>
                      <span className="font-medium">{item.valorGsInt.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">DKP:</span>
                      <span className="font-medium">{item.valorDkp.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Paginação */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={!pagination.hasPrev}
            >
              Anterior
            </Button>
            <span className="flex items-center px-4">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={!pagination.hasNext}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
