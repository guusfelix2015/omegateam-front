import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Trash2,
  UserMinus,
  Edit,
  AlertTriangle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  useCompanyParty,
  useDeleteCompanyParty,
  useRemovePlayerFromParty,
} from '../hooks/company-parties.hooks';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

export default function CompanyPartyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const {
    data: companyParty,
    isLoading: loadingParty,
    error: partyError,
  } = useCompanyParty(id || '');
  const deletePartyMutation = useDeleteCompanyParty();
  const removePlayerMutation = useRemovePlayerFromParty();

  // Extract members from company party data (now flattened)
  const members = companyParty?.users || [];

  const handleDeleteParty = async () => {
    if (!companyParty) return;

    const confirmMessage =
      members && members.length > 0
        ? `Tem certeza que deseja excluir a Company Party "${companyParty.name}"?\n\nIsto removerá todos os ${members.length} membros da CP.`
        : `Tem certeza que deseja excluir a Company Party "${companyParty.name}"?`;

    if (window.confirm(confirmMessage)) {
      try {
        await deletePartyMutation.mutateAsync(id!);
        navigate('/company-parties');
      } catch (error) {
        console.error('Error deleting company party:', error);
      }
    }
  };

  const handleRemovePlayer = async (playerId: string, playerName: string) => {
    if (
      window.confirm(
        `Tem certeza que deseja remover ${playerName} da Company Party?`
      )
    ) {
      try {
        await removePlayerMutation.mutateAsync({ partyId: id!, playerId });
      } catch (error) {
        console.error('Error removing player:', error);
      }
    }
  };

  if (loadingParty) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Carregando Company Party...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (partyError) {
    console.error('🚨 Company Party Error:', partyError);
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">
              Erro ao carregar Company Party:{' '}
              {partyError.message || 'Erro desconhecido'}
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/company-parties')}
            >
              Voltar para Cps
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!companyParty) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">
              Company Party não encontrada
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/company-parties')}
            >
              Voltar para Cps
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/company-parties">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{companyParty.name}</h1>
              <p className="text-muted-foreground">
                {companyParty.description || 'Sem descrição'}
              </p>
            </div>
          </div>

          {isAdmin && (
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link to={`/company-parties/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Link>
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteParty}
                disabled={deletePartyMutation.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir CP
              </Button>
            </div>
          )}
        </div>

        {/* Company Party Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Informações da Company Party
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total de Membros
                </p>
                <p className="text-2xl font-bold">{members?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level Médio</p>
                <p className="text-2xl font-bold text-blue-600">
                  {members && members.length > 0
                    ? Math.round(
                        members.reduce((sum, member) => sum + member.lvl, 0) /
                          members.length
                      )
                    : 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Máximo de Membros
                </p>
                <p className="text-2xl font-bold">
                  {companyParty.maxMembers || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Criada em</p>
                <p className="text-lg font-medium">
                  {new Date(companyParty.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Membros ({members?.length || 0})
              </div>
              {members && members.length > 0 && isAdmin && (
                <Badge
                  variant="outline"
                  className="text-orange-600 border-orange-600"
                >
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Excluir CP remove todos os membros
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Lista de todos os jogadores desta Company Party
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingParty ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2">Carregando membros...</span>
              </div>
            ) : partyError ? (
              <div className="text-center py-8">
                <p className="text-destructive">Erro ao carregar membros</p>
              </div>
            ) : !members || members.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Esta Company Party não possui membros
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => (
                  <Card
                    key={member.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={member.avatar || undefined} />
                          <AvatarFallback>
                            {member.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{member.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            @{member.nickname}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Level {member.lvl}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex-1"
                        >
                          <Link to={`/members/${member.id}`}>Ver Perfil</Link>
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleRemovePlayer(member.id, member.name)
                            }
                            disabled={removePlayerMutation.isPending}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
