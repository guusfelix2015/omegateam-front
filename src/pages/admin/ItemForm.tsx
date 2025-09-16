/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useItem, useCreateItem, useUpdateItem, useLookups } from '../../hooks/items.hooks';
import { Layout } from '../../components/Layout';
import { CreateItemSchema, type CreateItem, type ItemCategory } from '../../types/api';

const CATEGORY_LABELS: Record<ItemCategory, string> = {
  HELMET: 'Capacete',
  ARMOR: 'Armadura',
  PANTS: 'Calças',
  BOOTS: 'Botas',
  GLOVES: 'Luvas',
  NECKLACE: 'Colar',
  EARRING: 'Brinco',
  RING: 'Anel',
  SHIELD: 'Escudo',
  WEAPON: 'Arma',
};

export default function ItemForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { data: item, isLoading: isLoadingItem } = useItem(id || '');
  const { data: lookups } = useLookups();
  const createItemMutation = useCreateItem();
  const updateItemMutation = useUpdateItem();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateItem>({
    resolver: zodResolver(CreateItemSchema),
    defaultValues: {
      name: '',
      category: 'WEAPON',
      grade: 'D',
      valorGsInt: 0,
      valorDkp: 0,
    },
  });

  const watchedCategory = watch('category');
  const watchedGrade = watch('grade');

  useEffect(() => {
    if (item && isEditing) {
      setValue('name', item.name);
      setValue('category', item.category);
      setValue('grade', item.grade);
      setValue('valorGsInt', item.valorGsInt);
      setValue('valorDkp', item.valorDkp);
    }
  }, [item, isEditing, setValue]);

  const onSubmit = async (data: CreateItem) => {
    try {
      if (isEditing && id) {
        await updateItemMutation.mutateAsync({ id, data });
      } else {
        await createItemMutation.mutateAsync(data);
      }
      navigate('/admin/items');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (isEditing && isLoadingItem) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando item...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/admin/items')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? 'Editar Item' : 'Novo Item'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Edite as informações do item' : 'Crie um novo item no sistema'}
            </p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>{isEditing ? 'Editar Item' : 'Criar Novo Item'}</CardTitle>
            <CardDescription>
              Preencha as informações do item abaixo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Item</Label>
                <Input
                  id="name"
                  placeholder="Ex: Doom Crusher"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={watchedCategory}
                    onValueChange={(value) => setValue('category', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {lookups?.categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {CATEGORY_LABELS[cat as ItemCategory]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500">{errors.category.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Select
                    value={watchedGrade}
                    onValueChange={(value) => setValue('grade', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {lookups?.grades.map((gr) => (
                        <SelectItem key={gr} value={gr}>
                          Grade {gr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.grade && (
                    <p className="text-sm text-red-500">{errors.grade.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valorGsInt">Valor GS INT</Label>
                  <Input
                    id="valorGsInt"
                    type="number"
                    min="0"
                    placeholder="0"
                    {...register('valorGsInt', { valueAsNumber: true })}
                  />
                  {errors.valorGsInt && (
                    <p className="text-sm text-red-500">{errors.valorGsInt.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valorDkp">Valor DKP</Label>
                  <Input
                    id="valorDkp"
                    type="number"
                    min="0"
                    placeholder="0"
                    {...register('valorDkp', { valueAsNumber: true })}
                  />
                  {errors.valorDkp && (
                    <p className="text-sm text-red-500">{errors.valorDkp.message}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || createItemMutation.isPending || updateItemMutation.isPending}
                  className="flex-1"
                >
                  {(isSubmitting || createItemMutation.isPending || updateItemMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? 'Atualizar Item' : 'Criar Item'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/items')}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
