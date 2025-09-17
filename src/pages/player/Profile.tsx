import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  Shield,
  Calendar,
  Edit3,
  Package,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { ClassBadge } from '../../components/ClassBadge';
import { GearManager } from '../../components/GearManager';
import { useMe } from '../../hooks/users.hooks';
import { Layout } from '../../components/Layout';

export default function Profile() {
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useMe();

  const [activeTab, setActiveTab] = useState<'items' | 'generic'>('items');

  const handleEdit = () => {
    navigate('/profile/edit');
  };



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

  if (!user || isLoading) {
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
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meu Perfil</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais e configurações
            </p>
          </div>
          <Button onClick={handleEdit} className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Editar dados pessoais
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar || undefined} />
                <AvatarFallback className="text-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">{user?.name}</h2>
                <p className="text-muted-foreground">@{user?.nickname}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    {user?.role === 'ADMIN' ? 'Administrador' : 'Jogador'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Level {user?.lvl || 1}
                  </span>
                  {user?.classe?.name && (
                    <ClassBadge classeName={user.classe.name} size="sm" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">Não pode ser alterado</p>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                  <p className="text-sm">{user?.name}</p>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Nickname</Label>
                  <p className="text-sm">@{user?.nickname}</p>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Level</Label>
                  <p className="text-sm">{user?.lvl || 1}</p>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Função</Label>
                  <p className="text-sm">{user?.role === 'ADMIN' ? 'Administrador' : 'Jogador'}</p>
                  <p className="text-xs text-muted-foreground">Não pode ser alterado</p>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Membro desde</Label>
                  <p className="text-sm">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}</p>
                </div>

                <div className="space-y-1 space-x-2">
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${user?.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                    {user?.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                  <p className="text-xs text-muted-foreground">Não pode ser alterado</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('items')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'items'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Package className="h-4 w-4" />
            Items
          </button>
          <button
            onClick={() => setActiveTab('generic')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'generic'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Settings className="h-4 w-4" />
            Genérica
          </button>
        </div>

        {activeTab === 'items' && (
          <Card>
            <CardContent>
              <GearManager />
            </CardContent>
          </Card>
        )}

        {activeTab === 'generic' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Genérica
              </CardTitle>
              <CardDescription>
                Funcionalidades gerais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Em desenvolvimento</h3>
                <p className="text-muted-foreground">
                  Esta seção estará disponível em breve.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};
