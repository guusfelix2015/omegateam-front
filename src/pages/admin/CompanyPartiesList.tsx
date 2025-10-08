import { Link } from 'react-router-dom';
import { Plus, Users, Edit, Trash2, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  useCompanyParties,
  useDeleteCompanyParty,
} from '../../hooks/company-parties.hooks';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/Layout';

export default function CompanyPartiesList() {
  const { data: companyParties, isLoading, error } = useCompanyParties();
  const deletePartyMutation = useDeleteCompanyParty();
  const { isAdmin } = useAuth();

  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir a Company Party "${name}"?`
      )
    ) {
      await deletePartyMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando clãs...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-red-500">Erro ao carregar cps</p>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Constant partys</h1>
          </div>
          {isAdmin && (
            <Button asChild>
              <Link to="/company-parties/new">
                <Plus className="mr-2 h-4 w-4" />
                Nova Company Party
              </Link>
            </Button>
          )}
        </div>

        {!companyParties || companyParties.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum Cp encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                Comece criando sua primeira Company Party
              </p>
              {isAdmin && (
                <Button asChild>
                  <Link to="/company-parties/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar CP
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companyParties.map((party) => (
              <Card
                key={party.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{party.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {party.description || 'Sem descrição'}
                      </CardDescription>
                    </div>
                    {isAdmin && (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/company-parties/${party.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(party.id, party.name)}
                          disabled={deletePartyMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Membros:</span>
                        <span className="font-medium text-lg">
                          {party.playerCount || party.currentMembers || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Level Médio:
                        </span>
                        <span className="font-medium text-lg text-blue-600">
                          {party.averageLevel || 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex-1"
                      >
                        <Link to={`/company-parties/${party.id}`}>
                          <Users className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
