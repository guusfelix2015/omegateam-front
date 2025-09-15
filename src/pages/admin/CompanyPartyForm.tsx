import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  useCreateCompanyParty,
  useUpdateCompanyParty,
  useCompanyParty
} from '../../hooks/company-parties.hooks';
import { CreateCompanyPartySchema, type CreateCompanyParty } from '../../types/api';
import { Layout } from '../../components/Layout';

export default function CompanyPartyForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { data: existingParty, isLoading: isLoadingParty } = useCompanyParty(id || '');
  const createMutation = useCreateCompanyParty();
  const updateMutation = useUpdateCompanyParty();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCompanyParty>({
    resolver: zodResolver(CreateCompanyPartySchema),
    defaultValues: {
      name: '',
      description: '',
      maxMembers: 50,
    },
  });

  // Reset form when existing party data loads
  React.useEffect(() => {
    if (existingParty) {
      reset({
        name: existingParty.name,
        description: existingParty.description || '',
        maxMembers: existingParty.maxMembers,
      });
    }
  }, [existingParty, reset]);

  const onSubmit = async (data: CreateCompanyParty) => {
    try {
      if (isEditing && id) {
        await updateMutation.mutateAsync({ id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      navigate('/admin/company-parties');
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const isLoading = isLoadingParty || createMutation.isPending || updateMutation.isPending;

  if (isEditing && isLoadingParty) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando dados da Company Party...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="mb-8">
          <Button variant="outline" onClick={() => navigate('/admin/company-parties')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Editar Company Party' : 'Nova Company Party'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? 'Atualize as informações da Company Party'
              : 'Preencha os dados para criar uma nova Company Party'
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Company Party</CardTitle>
            <CardDescription>
              Configure os detalhes básicos da Company Party
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nome *
                </label>
                <Input
                  id="name"
                  placeholder="Digite o nome da Company Party"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Descrição
                </label>
                <Input
                  id="description"
                  placeholder="Descrição opcional da Company Party"
                  {...register('description')}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="maxMembers" className="text-sm font-medium">
                  Máximo de Membros *
                </label>
                <Input
                  id="maxMembers"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="50"
                  {...register('maxMembers', { valueAsNumber: true })}
                  className={errors.maxMembers ? 'border-red-500' : ''}
                />
                {errors.maxMembers && (
                  <p className="text-sm text-red-500">{errors.maxMembers.message}</p>
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/company-parties')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? 'Atualizando...' : 'Criando...'}
                    </>
                  ) : (
                    isEditing ? 'Atualizar' : 'Criar'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
