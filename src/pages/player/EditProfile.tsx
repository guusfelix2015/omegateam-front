import React, { useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  Shield,
  Calendar,
  Save,
  X,
  UserCircle,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';
import { ClassBadge } from '../../components/ClassBadge';
import { useMe, useUpdateProfile } from '../../hooks/users.hooks';
import { useClasses } from '../../hooks/classes.hooks';
import { Layout } from '../../components/Layout';

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  nickname: z
    .string()
    .min(1, 'Nickname é obrigatório')
    .max(50, 'Nickname muito longo'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .optional()
    .or(z.literal('')),
  lvl: z.number().min(1, 'Level mínimo é 1').max(85, 'Level máximo é 85'),
  classeId: z.string().optional(),
});

type UpdateProfileForm = z.infer<typeof updateProfileSchema>;

export const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useMe();
  const { data: classes } = useClasses();
  const updateProfileMutation = useUpdateProfile();

  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');

  const profileUser = user;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: profileUser?.name || '',
      nickname: profileUser?.nickname || '',
      password: '',
      lvl: profileUser?.lvl || 1,
      classeId: profileUser?.classeId || '',
    },
  });

  const watchedClasseId = useWatch({ control, name: 'classeId' });

  const onSubmit = async (data: UpdateProfileForm) => {
    try {
      const updateData = { ...data };
      if (!updateData.password || updateData.password === '') {
        delete updateData.password;
      }
      await updateProfileMutation.mutateAsync(updateData);
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error || !profileUser) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-red-500">Erro ao carregar dados do usuário</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Editar Dados Pessoais</h1>
              <p className="text-muted-foreground">
                Atualize suas informações pessoais e configurações
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileUser.avatar || undefined} />
                <AvatarFallback className="text-lg">
                  {profileUser.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">{profileUser.name}</h2>
                <p className="text-muted-foreground">@{profileUser.nickname}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    {profileUser.role === 'ADMIN' ? 'Administrador' : 'Jogador'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Level {profileUser.lvl || 1}
                  </span>
                  {profileUser.classe?.name && (
                    <ClassBadge
                      classeName={profileUser.classe.name}
                      size="sm"
                    />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'general'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UserCircle className="h-4 w-4" />
            Informações Gerais
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'security'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Lock className="h-4 w-4" />
            Segurança
          </button>
        </div>

        {activeTab === 'general' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Informações Gerais
              </CardTitle>
              <CardDescription>Edite suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Seu nome completo"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input
                      id="nickname"
                      {...register('nickname')}
                      placeholder="Seu nickname"
                    />
                    {errors.nickname && (
                      <p className="text-sm text-red-500">
                        {errors.nickname.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lvl">Level</Label>
                    <Input
                      id="lvl"
                      type="number"
                      min="1"
                      max="85"
                      {...register('lvl', { valueAsNumber: true })}
                      placeholder="Seu level atual"
                    />
                    {errors.lvl && (
                      <p className="text-sm text-red-500">
                        {errors.lvl.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="classe">Classe</Label>

                    {profileUser && classes ? (
                      <Controller
                        name="classeId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value || ''}
                            onValueChange={(value) => {
                              field.onChange(value === 'none' ? '' : value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma classe" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">
                                Nenhuma classe
                              </SelectItem>
                              {classes.map((classe) => (
                                <SelectItem key={classe.id} value={classe.id}>
                                  {classe.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Carregando classes...
                      </div>
                    )}
                    {watchedClasseId && watchedClasseId !== '' && (
                      <div className="mt-2">
                        <Label className="text-xs text-muted-foreground">
                          Prévia:
                        </Label>
                        <div className="mt-1">
                          <ClassBadge
                            classeName={
                              classes?.find((c) => c.id === watchedClasseId)
                                ?.name || ''
                            }
                            size="md"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Segurança
              </CardTitle>
              <CardDescription>Altere sua senha de acesso</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nova Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="Digite uma nova senha (deixe em branco para manter a atual)"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};
