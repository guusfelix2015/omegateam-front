import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Swords, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useRaid, useCreateRaid, useUpdateRaid } from '../hooks/raids.hooks';
import { Layout } from '../components/Layout';

const raidFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  bossLevel: z.number().min(1, 'Nível deve ser pelo menos 1').max(100, 'Nível máximo é 100'),
  baseScore: z.number().min(1, 'Score base deve ser pelo menos 1').max(10000, 'Score base muito alto'),
});

type RaidFormData = z.infer<typeof raidFormSchema>;

export default function RaidForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { data: raid, isLoading: isLoadingRaid } = useRaid(id || '');
  const createRaidMutation = useCreateRaid();
  const updateRaidMutation = useUpdateRaid();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<RaidFormData>({
    resolver: zodResolver(raidFormSchema),
    defaultValues: {
      name: '',
      bossLevel: 1,
      baseScore: 100,
    },
  });

  useEffect(() => {
    if (raid && isEditing) {
      reset({
        name: raid.name,
        bossLevel: raid.bossLevel,
        baseScore: raid.baseScore,
      });
    }
  }, [raid, isEditing, reset]);

  const onSubmit = async (data: RaidFormData) => {
    try {
      if (isEditing && id) {
        await updateRaidMutation.mutateAsync({ id, data });
      } else {
        await createRaidMutation.mutateAsync(data);
      }
      navigate('/raids');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const getBossLevelDescription = (level: number) => {
    if (level >= 85) return 'Raid Épico - Extremamente Difícil';
    if (level >= 80) return 'Raid de Alto Nível - Muito Difícil';
    if (level >= 70) return 'Raid Avançado - Difícil';
    if (level >= 60) return 'Raid Intermediário - Moderado';
    if (level >= 40) return 'Raid Básico - Fácil';
    return 'Raid Iniciante - Muito Fácil';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 1000) return 'Recompensa Lendária';
    if (score >= 800) return 'Recompensa Épica';
    if (score >= 500) return 'Recompensa Rara';
    if (score >= 300) return 'Recompensa Comum';
    return 'Recompensa Básica';
  };

  if (isEditing && isLoadingRaid) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando raid...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/raids')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Swords className="h-8 w-8 text-primary" />
              {isEditing ? 'Editar Raid' : 'Novo Raid'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing ? 'Atualize as informações do raid' : 'Configure um novo raid para o sistema'}
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Raid</CardTitle>
            <CardDescription>
              Configure os detalhes do raid. O nível do boss e score base afetam o cálculo de DKP.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Raid *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Antharas, Valakas, Baium..."
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Nível do Boss */}
              <div className="space-y-2">
                <Label htmlFor="bossLevel">Nível do Boss *</Label>
                <Input
                  id="bossLevel"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="85"
                  {...register('bossLevel', { valueAsNumber: true })}
                  className={errors.bossLevel ? 'border-red-500' : ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setValue('bossLevel', value);
                  }}
                />
                {errors.bossLevel && (
                  <p className="text-sm text-red-500">{errors.bossLevel.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {getBossLevelDescription(watch('bossLevel') || 1)}
                </p>
              </div>

              {/* Score Base */}
              <div className="space-y-2">
                <Label htmlFor="baseScore">Score Base para DKP *</Label>
                <Input
                  id="baseScore"
                  type="number"
                  min="1"
                  max="10000"
                  placeholder="500"
                  {...register('baseScore', { valueAsNumber: true })}
                  className={errors.baseScore ? 'border-red-500' : ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 100;
                    setValue('baseScore', value);
                  }}
                />
                {errors.baseScore && (
                  <p className="text-sm text-red-500">{errors.baseScore.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {getScoreDescription(watch('baseScore') || 100)}
                </p>
              </div>

              {/* Info Card */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-900">💡 Como funciona o DKP?</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• O DKP é calculado baseado no <strong>gear score</strong> dos participantes</p>
                      <p>• Participantes com gear score maior recebem mais DKP</p>
                      <p>• O score base define a quantidade mínima de DKP distribuída</p>
                      <p>• Raids de nível mais alto tendem a ter scores base maiores</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/raids')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || createRaidMutation.isPending || updateRaidMutation.isPending}
                  className="flex-1"
                >
                  {(isSubmitting || createRaidMutation.isPending || updateRaidMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? 'Atualizar Raid' : 'Criar Raid'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
