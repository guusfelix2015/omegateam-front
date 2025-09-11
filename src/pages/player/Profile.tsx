import { Loader2, User, Mail, Shield, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useMe } from '../../hooks/users.hooks';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/Layout';

export default function Profile() {
  const { user: authUser } = useAuth();
  const { data: user, isLoading, error } = useMe();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando perfil...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-red-500">Erro ao carregar perfil</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
        </div>
      </Layout>
    );
  }

  const profileUser = user || authUser;

  if (!profileUser) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Dados do usuário não encontrados</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Visualize suas informações pessoais
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Seus dados básicos no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{profileUser.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Nome</p>
                  <p className="text-sm text-muted-foreground">{profileUser.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Função</p>
                  <p className="text-sm text-muted-foreground">
                    {profileUser.role === 'ADMIN' ? 'Administrador' : 'Jogador'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Membro desde</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(profileUser.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status da Conta</CardTitle>
              <CardDescription>
                Informações sobre sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status</span>
                <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  Ativo
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Última atualização</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(profileUser.updatedAt).toLocaleDateString('pt-BR')}
                </span>
              </div>

              {profileUser.role === 'PLAYER' && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    Funcionalidades do Jogador
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Visualizar perfil pessoal</li>
                    <li>• Acessar informações da conta</li>
                    <li>• Mais funcionalidades em breve...</li>
                  </ul>
                </div>
              )}

              {profileUser.role === 'ADMIN' && (
                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-900 mb-2">
                    Funcionalidades do Administrador
                  </h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Gerenciar Company Parties</li>
                    <li>• Administrar usuários</li>
                    <li>• Controle total do sistema</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
