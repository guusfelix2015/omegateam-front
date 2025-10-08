import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  User,
  Shield,
  Building2,
  Trash2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useUser, useUpdateUser, useDeleteUser } from '../hooks/users.hooks';
import {
  useCompanyParties,
  useAddPlayerToParty,
  useRemovePlayerFromParty,
} from '../hooks/company-parties.hooks';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import { Layout } from '../components/Layout';
import { MemberGearAndDkp } from '../components/MemberGearAndDkp';

export default function MemberDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin, user: currentUser } = useAuth();
  const { toast } = useToast();
  const { data: user, isLoading, error } = useUser(id!);
  const { data: companyParties } = useCompanyParties();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const addPlayerToPartyMutation = useAddPlayerToParty();
  const removePlayerFromPartyMutation = useRemovePlayerFromParty();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    nickname: '',
    email: '',
    lvl: 1,
    role: 'PLAYER' as 'ADMIN' | 'PLAYER' | 'CP_LEADER',
    isActive: true,
    companyPartyId: '',
  });

  React.useEffect(() => {
    if (user) {
      const currentCP = user.companyParties?.[0]?.companyPartyId || '';

      setEditData({
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        lvl: user.lvl,
        role: user.role,
        isActive: user.isActive,
        companyPartyId: currentCP,
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      // Update basic user information
      await updateUserMutation.mutateAsync({
        id: user.id,
        data: {
          name: editData.name,
          nickname: editData.nickname,
          email: editData.email,
          lvl: editData.lvl,
          role: editData.role,
          isActive: editData.isActive,
        },
      });

      // Handle Company Party changes
      const currentCP = user.companyParties?.[0]?.companyPartyId || '';
      const newCP = editData.companyPartyId;

      if (currentCP !== newCP) {
        // Remove from current CP if exists
        if (currentCP) {
          await removePlayerFromPartyMutation.mutateAsync({
            partyId: currentCP,
            playerId: user.id,
          });
        }

        // Add to new CP if selected
        if (newCP && newCP !== 'none') {
          await addPlayerToPartyMutation.mutateAsync({
            partyId: newCP,
            data: { userId: user.id },
          });
        }

        // Invalidate user query to refetch updated data with new CP
        await queryClient.invalidateQueries({ queryKey: ['users', user.id] });
      }

      toast({
        title: 'Usuário atualizado!',
        description: 'As alterações foram salvas com sucesso.',
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Erro ao atualizar usuário',
        description: 'Ocorreu um erro ao salvar as alterações.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    if (user) {
      const currentCP = user.companyParties?.[0]?.companyPartyId || '';

      setEditData({
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        lvl: user.lvl,
        role: user.role,
        isActive: user.isActive,
        companyPartyId: currentCP,
      });
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!user) return;

    // Prevent user from deleting themselves
    if (currentUser && currentUser.id === user.id) {
      toast({
        title: 'Ação não permitida',
        description: 'Você não pode deletar sua própria conta.',
        variant: 'destructive',
      });
      return;
    }

    const confirmMessage = `Tem certeza que deseja deletar o usuário "${user.name}"?\n\nEsta ação não pode ser desfeita.`;

    if (window.confirm(confirmMessage)) {
      try {
        await deleteUserMutation.mutateAsync(user.id);
        navigate('/members');
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando membro...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">Membro não encontrado</p>
            <Button variant="outline" onClick={() => navigate('/members')}>
              Voltar para Membros
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/members">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">Detalhes do membro</p>
            </div>
          </div>

          {isAdmin && (
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
                  </Button>
                </>
              ) : (
                <>
                  {/* Only show delete button if user is not viewing their own profile */}
                  {currentUser && currentUser.id !== user.id && (
                    <Button variant="destructive" onClick={handleDelete}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Deletar
                    </Button>
                  )}
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Informações Básicas
              </CardTitle>
              <CardDescription>
                Dados pessoais e de identificação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-sm">{user.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname">Nickname</Label>
                {isEditing ? (
                  <Input
                    id="nickname"
                    value={editData.nickname}
                    onChange={(e) =>
                      setEditData({ ...editData, nickname: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-sm">{user.nickname}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editData.email}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-sm">{user.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                {isEditing ? (
                  <Input
                    id="level"
                    type="number"
                    min="1"
                    max="85"
                    value={editData.lvl}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        lvl: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                ) : (
                  <p className="text-sm">Level {user.lvl}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Informações do Sistema
              </CardTitle>
              <CardDescription>
                Configurações de acesso e status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                {isEditing ? (
                  <Select
                    value={editData.role}
                    onValueChange={(value: 'ADMIN' | 'PLAYER' | 'CP_LEADER') =>
                      setEditData({ ...editData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PLAYER">Jogador</SelectItem>
                      <SelectItem value="CP_LEADER">Líder de CP</SelectItem>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge
                    variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                  >
                    {user.role === 'ADMIN'
                      ? 'Administrador'
                      : user.role === 'CP_LEADER'
                        ? 'Líder de CP'
                        : 'Jogador'}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="active">Status Ativo</Label>
                {isEditing ? (
                  <Switch
                    id="active"
                    checked={editData.isActive}
                    onCheckedChange={(checked) =>
                      setEditData({ ...editData, isActive: checked })
                    }
                  />
                ) : (
                  <Badge variant={user.isActive ? 'default' : 'secondary'}>
                    {user.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyParty">Company Party</Label>
                {isEditing ? (
                  <Select
                    value={editData.companyPartyId || 'none'}
                    onValueChange={(value) =>
                      setEditData({
                        ...editData,
                        companyPartyId: value === 'none' ? '' : value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma Company Party" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Nenhuma Company Party
                        </div>
                      </SelectItem>
                      {companyParties?.map((cp) => (
                        <SelectItem key={cp.id} value={cp.id}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {cp.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-sm">
                    {user.companyParties && user.companyParties.length > 0 ? (
                      <Badge variant="outline">
                        {user.companyParties[0].companyParty?.name || 'N/A'}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">
                        Nenhuma Company Party
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Criado em</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Última atualização</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.updatedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                Cps
              </CardTitle>
              <CardDescription>Cps que este membro participa</CardDescription>
            </CardHeader>
            <CardContent>
              {user.companyParties && user.companyParties.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {user.companyParties.map((userCP) => (
                    <Card key={userCP.id} className="border-dashed">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">
                              {userCP.companyParty?.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Entrou em{' '}
                              {new Date(userCP.joinedAt).toLocaleDateString(
                                'pt-BR'
                              )}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              to={`/company-parties/${userCP.companyPartyId}`}
                            >
                              Ver CP
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Este membro não participa de nenhuma Company Party
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gear and DKP Information */}
        <Card>
          <CardHeader>
            <CardTitle>Gear e DKP</CardTitle>
            <CardDescription>
              Informações detalhadas sobre equipamentos e pontos DKP de{' '}
              {user.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MemberGearAndDkp
              userId={user.id}
              userName={user.name}
              bagUrl={user.bagUrl}
              isReadOnly={!isAdmin}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
