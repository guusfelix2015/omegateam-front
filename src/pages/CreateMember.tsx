import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Layout } from '../components/Layout';
import { useToast } from '../hooks/use-toast';

const createMemberSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  nickname: z.string().min(1, 'Nickname é obrigatório').max(50, 'Nickname muito longo'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  lvl: z.number().min(1, 'Level mínimo é 1').max(85, 'Level máximo é 85'),
  role: z.enum(['ADMIN', 'PLAYER']),
  isActive: z.boolean(),
});

type CreateMemberForm = z.infer<typeof createMemberSchema>;

export default function CreateMember() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
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
    },
  });

  const watchedRole = watch('role');
  const watchedIsActive = watch('isActive');

  const onSubmit = async (data: CreateMemberForm) => {
    try {
      // TODO: Implement API call to create member
      console.log('Creating member:', data);
      
      toast({
        title: "Membro criado com sucesso!",
        description: `${data.name} foi adicionado ao sistema.`,
      });
      
      navigate('/members');
    } catch (error) {
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
        {/* Header */}
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
            {/* Basic Information */}
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

            {/* System Configuration */}
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
                    onValueChange={(value: 'ADMIN' | 'PLAYER') => setValue('role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PLAYER">Jogador</SelectItem>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-destructive">{errors.role.message}</p>
                  )}
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

                {/* Role Description */}
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">
                    {watchedRole === 'ADMIN' ? 'Administrador' : 'Jogador'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {watchedRole === 'ADMIN' 
                      ? 'Acesso completo ao sistema, pode gerenciar membros, Company Parties e configurações.'
                      : 'Acesso limitado ao sistema, pode visualizar informações e participar de Company Parties.'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link to="/members">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
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
