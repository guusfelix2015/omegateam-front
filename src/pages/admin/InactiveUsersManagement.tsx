import { useState, useMemo } from 'react';
import {
  AlertCircle,
  Clock,
  Users,
  TrendingDown,
  RefreshCw,
  Search,
  ChevronDown,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  useInactivityStats,
  useInactiveUsersList,
  useReactivateUser,
} from '@/hooks/useUserInactivity';
import {
  UserLastLoginDisplay,
} from '@/components/UserInactivityStatus';
import { Layout } from '@/components/Layout';

export default function InactiveUsersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [inactiveDays, setInactiveDays] = useState(7);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useInactivityStats();
  const { data: inactiveUsers, isLoading: usersLoading, refetch: refetchUsers } = useInactiveUsersList(inactiveDays);
  const reactivateMutation = useReactivateUser();

  const filteredUsers = useMemo(() => {
    if (!inactiveUsers?.users) return [];
    return inactiveUsers.users.filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inactiveUsers?.users, searchTerm]);

  const handleReactivate = async (userId: string) => {
    try {
      await reactivateMutation.mutateAsync(userId);
      refetchUsers();
      refetchStats();
    } catch (error) {
      console.error('Erro ao reativar usuário:', error);
    }
  };

  const handleRefresh = () => {
    refetchStats();
    refetchUsers();
  };

  const isLoading = statsLoading || usersLoading;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Usuários Inativos</h1>
            <p className="text-muted-foreground mt-1">
              Monitore e gerencie usuários que não fazem login há mais de {inactiveDays} dias
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
            size="lg"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Total de Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-green-600" />
                  Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.activeUsers}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingDown className="h-4 w-4 mr-2 text-red-600" />
                  Inativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats.inactiveUsers}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                  Potencialmente Inativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.potentiallyInactiveUsers}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-600" />
                  Nunca Fizeram Login
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">
                  {stats.usersNeverLoggedIn}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Dias de Inatividade</label>
                <select
                  value={inactiveDays}
                  onChange={(e) => setInactiveDays(Number(e.target.value))}
                  className="w-full mt-2 px-3 py-2 border rounded-md bg-background"
                >
                  <option value={7}>7 dias</option>
                  <option value={14}>14 dias</option>
                  <option value={30}>30 dias</option>
                  <option value={60}>60 dias</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Buscar Usuário</label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Email ou nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Usuários Inativos</CardTitle>
            <CardDescription>
              {filteredUsers.length} usuário(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Carregando usuários...</p>
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Nenhum usuário inativo encontrado</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="border rounded-lg p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          {user.lastLoginAt ? (
                            <span className="text-muted-foreground">
                              {Math.ceil(
                                (new Date().getTime() - new Date(user.lastLoginAt).getTime()) /
                                (1000 * 60 * 60 * 24)
                              )}{' '}
                              dias
                            </span>
                          ) : (
                            <span className="text-gray-500">Nunca fez login</span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setExpandedUserId(
                              expandedUserId === user.id ? null : user.id
                            )
                          }
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${expandedUserId === user.id ? 'rotate-180' : ''
                              }`}
                          />
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedUserId === user.id && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Último Login</p>
                            <UserLastLoginDisplay lastLoginAt={user.lastLoginAt} />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant="destructive">
                              Inativo
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => handleReactivate(user.id)}
                            disabled={reactivateMutation.isPending}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {reactivateMutation.isPending ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Reativando...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reativar Usuário
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

