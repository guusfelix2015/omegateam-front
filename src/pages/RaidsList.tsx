/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Swords,
  Edit,
  Trash2,
  Loader2,
  Power,
  PowerOff,
  Users,
  Trophy,
  Search,
  Filter,
  BarChart3
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
import { useRaids, useDeleteRaid, useToggleRaidStatus } from '../hooks/raids.hooks';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/Layout';
import { useDebounce } from '../hooks/useDebounce';

export default function RaidsList() {
  const [search, setSearch] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'name' | 'bossLevel' | 'baseScore' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const debouncedSearch = useDebounce(search, 300);
  const { isAdmin } = useAuth();

  const { data: raidsData, isLoading, error } = useRaids({
    search: debouncedSearch,
    isActive: isActiveFilter,
    sortBy,
    sortOrder,
  });

  const deleteRaidMutation = useDeleteRaid();
  const toggleStatusMutation = useToggleRaidStatus();

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o raid "${name}"?`)) {
      await deleteRaidMutation.mutateAsync(id);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await toggleStatusMutation.mutateAsync({ id, activate: !currentStatus });
  };

  const getBossLevelColor = (level: number) => {
    if (level >= 80) return 'bg-red-500';
    if (level >= 60) return 'bg-orange-500';
    if (level >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getBaseScoreColor = (score: number) => {
    if (score >= 800) return 'text-red-600';
    if (score >= 500) return 'text-orange-600';
    if (score >= 300) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando raids...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-red-500">Erro ao carregar raids</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
        </div>
      </Layout>
    );
  }

  const raids = raidsData?.data || [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Swords className="h-8 w-8 text-primary" />
              Raids
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie raids e instâncias de combate
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/raids/dashboard">
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            {isAdmin && (
              <Button asChild>
                <Link to="/raids/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Raid
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar raids..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={isActiveFilter?.toString() || 'all'} onValueChange={(value) =>
                setIsActiveFilter(value === 'all' ? undefined : value === 'true')
              }>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Ativos</SelectItem>
                  <SelectItem value="false">Inativos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Data</SelectItem>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="bossLevel">Nível</SelectItem>
                  <SelectItem value="baseScore">Score</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Raids Grid */}
        {raids.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Swords className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum raid encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {search ? 'Tente ajustar os filtros de busca' : 'Comece criando seu primeiro raid'}
              </p>
              {isAdmin && !search && (
                <Button asChild>
                  <Link to="/raids/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Raid
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {raids.map((raid) => (
              <Card key={raid.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{raid.name}</CardTitle>
                        <Badge variant={raid.isActive ? 'default' : 'secondary'}>
                          {raid.isActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <CardDescription>
                        Criado em {new Date(raid.createdAt).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </div>
                    {isAdmin && (
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/raids/${raid.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(raid.id, raid.isActive)}
                          disabled={toggleStatusMutation.isPending}
                        >
                          {raid.isActive ? (
                            <PowerOff className="h-4 w-4" />
                          ) : (
                            <Power className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(raid.id, raid.name)}
                          disabled={deleteRaidMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getBossLevelColor(raid.bossLevel)}`} />
                        <span className="text-sm text-muted-foreground">Nível</span>
                      </div>
                      <p className="text-2xl font-bold">{raid.bossLevel}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Score Base</span>
                      </div>
                      <p className={`text-2xl font-bold ${getBaseScoreColor(raid.baseScore)}`}>
                        {raid.baseScore}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link to={`/raids/${raid.id}`}>
                        <Users className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </Link>
                    </Button>
                    {isAdmin && (
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/raids/${raid.id}/instances/new`}>
                          <Plus className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {raidsData?.pagination && raidsData.pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              disabled={!raidsData.pagination.hasPrev}
              onClick={() => {
                // Implement pagination logic
              }}
            >
              Anterior
            </Button>
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              Página {raidsData.pagination.page} de {raidsData.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={!raidsData.pagination.hasNext}
              onClick={() => {
                // Implement pagination logic
              }}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
