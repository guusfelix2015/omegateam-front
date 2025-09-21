import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Swords,
  Users,
  Trophy,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Power,
  PowerOff,
  Clock,
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useRaid, useRaidInstances, useDeleteRaidInstance, useToggleRaidStatus } from '../hooks/raids.hooks';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/Layout';

export default function RaidDetail() {
  const { id } = useParams();
  const { isAdmin } = useAuth();

  const { data: raid, isLoading: isLoadingRaid, error: raidError } = useRaid(id || '');
  const { data: instancesData, isLoading: isLoadingInstances } = useRaidInstances({
    raidId: id,
    sortBy: 'completedAt',
    sortOrder: 'desc',
  });

  const deleteInstanceMutation = useDeleteRaidInstance();
  const toggleStatusMutation = useToggleRaidStatus();

  const handleDeleteInstance = async (instanceId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta instância de raid?')) {
      await deleteInstanceMutation.mutateAsync(instanceId);
    }
  };

  const handleToggleStatus = async () => {
    if (raid) {
      await toggleStatusMutation.mutateAsync({ id: raid.id, activate: !raid.isActive });
    }
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

  if (isLoadingRaid) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando raid...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (raidError || !raid) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-red-500">Erro ao carregar raid</p>
          <p className="text-sm text-muted-foreground mt-2">
            {raidError instanceof Error ? raidError.message : 'Raid não encontrado'}
          </p>
          <Button asChild className="mt-4">
            <Link to="/raids">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Raids
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const instances = instancesData?.data || [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/raids">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Swords className="h-8 w-8 text-primary" />
                  {raid.name}
                </h1>
                <Badge variant={raid.isActive ? 'default' : 'secondary'}>
                  {raid.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                Criado em {new Date(raid.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {isAdmin && (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to={`/raids/${raid.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={handleToggleStatus}
                disabled={toggleStatusMutation.isPending}
              >
                {raid.isActive ? (
                  <>
                    <PowerOff className="mr-2 h-4 w-4" />
                    Desativar
                  </>
                ) : (
                  <>
                    <Power className="mr-2 h-4 w-4" />
                    Ativar
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Raid Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${getBossLevelColor(raid.bossLevel)}`} />
                <div>
                  <p className="text-sm text-muted-foreground">Nível do Boss</p>
                  <p className="text-3xl font-bold">{raid.bossLevel}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Trophy className={`h-4 w-4 ${getBaseScoreColor(raid.baseScore)}`} />
                <div>
                  <p className="text-sm text-muted-foreground">Score Base DKP</p>
                  <p className={`text-3xl font-bold ${getBaseScoreColor(raid.baseScore)}`}>
                    {raid.baseScore}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Instâncias</p>
                  <p className="text-3xl font-bold">{instances.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="instances" className="space-y-6">
          <TabsList>
            <TabsTrigger value="instances">Instâncias</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="instances" className="space-y-6">
            {/* Create Instance Button */}
            {isAdmin && raid.isActive && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Nova Instância</h3>
                      <p className="text-sm text-muted-foreground">
                        Registre uma nova execução deste raid
                      </p>
                    </div>
                    <Button asChild>
                      <Link to={`/raids/${raid.id}/instances/new`}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Instância
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instances List */}
            {isLoadingInstances ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Carregando instâncias...</span>
                </div>
              </div>
            ) : instances.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma instância encontrada</h3>
                  <p className="text-muted-foreground mb-4">
                    Este raid ainda não foi executado
                  </p>
                  {isAdmin && raid.isActive && (
                    <Button asChild>
                      <Link to={`/raids/${raid.id}/instances/new`}>
                        <Plus className="mr-2 h-4 w-4" />
                        Primeira Instância
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {instances.map((instance) => (
                  <Card key={instance.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            Instância #{instance.id.slice(-8)}
                          </CardTitle>
                          <CardDescription>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(instance.completedAt).toLocaleDateString('pt-BR')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {instance.participants.length} participantes
                              </span>
                            </div>
                          </CardDescription>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/raid-instances/${instance.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteInstance(instance.id)}
                              disabled={deleteInstanceMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        {instance.notes && (
                          <p className="text-sm text-muted-foreground italic">
                            "{instance.notes}"
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">DKP Total Distribuído:</span>
                          <span className="font-semibold">
                            {instance.participants.reduce((sum, p) => sum + p.dkpAwarded, 0)}
                          </span>
                        </div>

                        <Button variant="outline" size="sm" asChild className="w-full">
                          <Link to={`/raid-instances/${instance.id}`}>
                            Ver Detalhes Completos
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas do Raid</CardTitle>
                <CardDescription>
                  Dados históricos e métricas de performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total de Execuções</p>
                    <p className="text-2xl font-bold">{instances.length}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total de Participantes</p>
                    <p className="text-2xl font-bold">
                      {instances.reduce((sum, instance) => sum + instance.participants.length, 0)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">DKP Total Distribuído</p>
                    <p className="text-2xl font-bold">
                      {instances.reduce((sum, instance) =>
                        sum + instance.participants.reduce((pSum, p) => pSum + p.dkpAwarded, 0), 0
                      )}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Média de Participantes</p>
                    <p className="text-2xl font-bold">
                      {instances.length > 0
                        ? Math.round(instances.reduce((sum, instance) => sum + instance.participants.length, 0) / instances.length)
                        : 0
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
