import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, User, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Layout } from '../components/Layout';
import { useToast } from '../hooks/use-toast';
import { useCreateUser } from '../hooks/users.hooks';
import { useCompanyParties, useAddPlayerToParty } from '../hooks/company-parties.hooks';
import { useClasses } from '../hooks/classes.hooks';

const createMemberSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  nickname: z.string().min(1, 'Nickname é obrigatório').max(50, 'Nickname muito longo'),
  email: z.email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  lvl: z.number().min(1, 'Level mínimo é 1').max(85, 'Level máximo é 85'),
  role: z.enum(['ADMIN', 'PLAYER', 'CP_LEADER']),
  isActive: z.boolean(),
  companyPartyId: z.string().optional(),
  classeId: z.string().optional(),
});

type CreateMemberForm = z.infer<typeof createMemberSchema>;

export default function CreateMember() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createUserMutation = useCreateUser();
  const addPlayerToPartyMutation = useAddPlayerToParty();
  const { data: companyParties, isLoading: loadingCPs, error: cpError } = useCompanyParties();
  const { data: classes, isLoading: loadingClasses } = useClasses();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateMemberForm>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: {
      name: '',
      nickname: '',
      email: '',
      password: '',
      lvl: 1,
      role: 'PLAYER',
      isActive: true,
      companyPartyId: '',
      classeId: '',
    },
  });

  const watchedRole = watch('role');
  const watchedIsActive = watch('isActive');

  const onSubmit = async (data: CreateMemberForm) => {
    try {
      const newUser = await createUserMutation.mutateAsync(data);

      if (data.companyPartyId && data.companyPartyId !== '') {
        try {
          await addPlayerToPartyMutation.mutateAsync({
            partyId: data.companyPartyId,
            data: { userId: newUser.id }
          });
        } catch (cpError) {
          console.warn('Failed to add user to Company Party:', cpError);
        }
      }

      toast({
        title: "Membro criado com sucesso!",
        description: data.companyPartyId
          ? `${data.name} foi adicionado ao sistema e à Cp.`
          : `${data.name} foi adicionado ao sistema.`,
      });

      navigate('/members');
    } catch (error) {
      console.error('Error creating member:', error);
      toast({
        title: "Erro ao criar membro",
        description: "Ocorreu um erro ao criar o membro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/members">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Criar Novo Membro</h1>
            <p className="text-muted-foreground">Adicione um novo membro ao sistema</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Nome completo"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname">Nickname *</Label>
                  <Input
                    id="nickname"
                    {...register('nickname')}
                    placeholder="Nome no jogo"
                  />
                  {errors.nickname && (
                    <p className="text-sm text-destructive">{errors.nickname.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="email@exemplo.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="Mínimo 6 caracteres"
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Input
                    id="level"
                    type="number"
                    min="1"
                    max="85"
                    {...register('lvl', { valueAsNumber: true })}
                    placeholder="1-85"
                  />
                  {errors.lvl && (
                    <p className="text-sm text-destructive">{errors.lvl.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Permissões e status no sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Função</Label>
                  <Select
                    value={watchedRole}
                    onValueChange={(value: 'ADMIN' | 'PLAYER' | 'CP_LEADER') => setValue('role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PLAYER">Jogador</SelectItem>
                      <SelectItem value="CP_LEADER">Líder de CP</SelectItem>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-destructive">{errors.role.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyPartyId">Company Party (opcional)</Label>
                  <Select
                    value={watch('companyPartyId') || ''}
                    onValueChange={(value) => setValue('companyPartyId', value === 'none' ? '' : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        loadingCPs ? "Carregando..." :
                          cpError ? "Erro ao carregar CPs" :
                            "Selecione uma Company Party"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Nenhuma Company Party
                        </div>
                      </SelectItem>
                      {companyParties && companyParties.length > 0 ? (
                        companyParties.map((cp) => (
                          <SelectItem key={cp.id} value={cp.id}>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {cp.name} ({cp.playerCount || cp.currentMembers || 0} membros)
                            </div>
                          </SelectItem>
                        ))
                      ) : !loadingCPs && (
                        <SelectItem value="empty" disabled>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            Nenhuma Company Party encontrada
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    O membro será automaticamente adicionado à Company Party selecionada
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classe">Classe (Opcional)</Label>
                  <Select
                    value={watch('classeId') || ''}
                    onValueChange={(value) => setValue('classeId', value === 'none' ? '' : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma classe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Nenhuma classe
                        </div>
                      </SelectItem>
                      {loadingClasses ? (
                        <SelectItem value="loading" disabled>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            Carregando classes...
                          </div>
                        </SelectItem>
                      ) : classes && classes.length > 0 ? (
                        classes.map((classe) => (
                          <SelectItem key={classe.id} value={classe.id}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {classe.name}
                            </div>
                          </SelectItem>
                        ))
                      ) : !loadingClasses && (
                        <SelectItem value="empty" disabled>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            Nenhuma classe encontrada
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    O membro pode escolher ou alterar sua classe posteriormente
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="active">Status Ativo</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que o membro acesse o sistema
                    </p>
                  </div>
                  <Switch
                    id="active"
                    checked={watchedIsActive}
                    onCheckedChange={(checked) => setValue('isActive', checked)}
                  />
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">
                    {watchedRole === 'ADMIN'
                      ? 'Administrador'
                      : watchedRole === 'CP_LEADER'
                        ? 'Líder de CP'
                        : 'Jogador'
                    }
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {watchedRole === 'ADMIN'
                      ? 'Acesso completo ao sistema, pode gerenciar membro CP e configurações.'
                      : watchedRole === 'CP_LEADER'
                        ? 'Pode liderar Cps, gerenciar membros da sua CP e visualizar informações do sistema.'
                        : 'Acesso limitado ao sistema, pode visualizar informações e participar de Cps.'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link to="/members">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={createUserMutation.isPending}>
              {createUserMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Criar Membro
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
