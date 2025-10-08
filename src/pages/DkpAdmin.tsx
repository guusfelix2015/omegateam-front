/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Settings,
  Plus,
  Minus,
  Search,
  Loader2,
  AlertTriangle,
  CheckCircle,
  User,
  Trophy,
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
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useCreateDkpAdjustment } from '../hooks/dkp.hooks';
import { useUsers } from '../hooks/users.hooks';
import { Layout } from '../components/Layout';
import { useDebounce } from '../hooks/useDebounce';

const dkpAdjustmentSchema = z.object({
  userId: z.string().min(1, 'Selecione um usuário'),
  amount: z
    .number()
    .int()
    .min(-9999, 'Valor muito baixo')
    .max(9999, 'Valor muito alto'),
  reason: z
    .string()
    .min(5, 'Motivo deve ter pelo menos 5 caracteres')
    .max(500, 'Motivo muito longo'),
});

type DkpAdjustmentFormData = z.infer<typeof dkpAdjustmentSchema>;

export default function DkpAdmin() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'positive' | 'negative'>(
    'positive'
  );

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: usersData, isLoading: isLoadingUsers } = useUsers({
    search: debouncedSearch,
    limit: 20,
  });

  const createAdjustmentMutation = useCreateDkpAdjustment();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<DkpAdjustmentFormData>({
    resolver: zodResolver(dkpAdjustmentSchema),
    defaultValues: {
      amount: 0,
      reason: '',
    },
  });

  const watchedAmount = watch('amount');

  useEffect(() => {
    const currentAmount = Math.abs(watchedAmount || 0);
    if (currentAmount > 0) {
      if (adjustmentType === 'negative' && watchedAmount > 0) {
        setValue('amount', -currentAmount);
      } else if (adjustmentType === 'positive' && watchedAmount < 0) {
        setValue('amount', currentAmount);
      }
    }
  }, [adjustmentType, setValue, watchedAmount]);

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setValue('userId', user.id);
    setSearchTerm('');
  };

  const handleAdjustmentTypeChange = (type: 'positive' | 'negative') => {
    setAdjustmentType(type);
    const currentAmount = Math.abs(watchedAmount || 0);

    // Se for negativo, definir valor negativo; se for positivo, definir valor positivo
    if (type === 'negative') {
      setValue('amount', currentAmount > 0 ? -currentAmount : currentAmount);
    } else {
      setValue(
        'amount',
        currentAmount < 0 ? Math.abs(currentAmount) : currentAmount
      );
    }
  };

  const onSubmit = async (data: DkpAdjustmentFormData) => {
    try {
      await createAdjustmentMutation.mutateAsync(data);
      reset();
      setSelectedUser(null);
      setAdjustmentType('positive');
    } catch (error) {
      console.error('Error creating adjustment:', error);
      // Error is handled by the mutation hook
    }
  };

  const users = usersData?.data || [];
  const availableUsers = users.filter(
    (user) => !selectedUser || user.id !== selectedUser.id
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8 text-primary" />
              Administração DKP
            </h1>
            <p className="text-muted-foreground mt-1">
              Faça ajustes manuais nos pontos DKP dos jogadores
            </p>
          </div>
        </div>

        {/* Warning Alert */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Atenção:</strong> Ajustes manuais de DKP devem ser feitos
            com cuidado. Sempre forneça um motivo detalhado para auditoria.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Selecionar Jogador
              </CardTitle>
              <CardDescription>
                Busque e selecione o jogador para ajustar o DKP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selected User */}
              {selectedUser && (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedUser.avatar || undefined} />
                        <AvatarFallback>
                          {selectedUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{selectedUser.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedUser.nickname} • DKP:{' '}
                          {selectedUser.dkpPoints}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(null);
                        setValue('userId', '');
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar jogador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* User List */}
              {searchTerm && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {isLoadingUsers ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : availableUsers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhum jogador encontrado
                    </p>
                  ) : (
                    availableUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 hover:bg-muted rounded-lg cursor-pointer"
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.nickname} • Lvl {user.lvl} • DKP:{' '}
                              {user.dkpPoints}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Selecionar
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Adjustment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Ajuste de DKP
              </CardTitle>
              <CardDescription>
                Configure o ajuste de pontos DKP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Adjustment Type */}
                <div className="space-y-2">
                  <Label>Tipo de Ajuste</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={
                        adjustmentType === 'positive' ? 'default' : 'outline'
                      }
                      onClick={() => handleAdjustmentTypeChange('positive')}
                      className="flex-1"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar DKP
                    </Button>
                    <Button
                      type="button"
                      variant={
                        adjustmentType === 'negative' ? 'default' : 'outline'
                      }
                      onClick={() => handleAdjustmentTypeChange('negative')}
                      className="flex-1"
                    >
                      <Minus className="mr-2 h-4 w-4" />
                      Remover DKP
                    </Button>
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Quantidade</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Ex: 50"
                    {...register('amount', { valueAsNumber: true })}
                    className={errors.amount ? 'border-red-500' : ''}
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-500">
                      {errors.amount.message}
                    </p>
                  )}
                  {watchedAmount !== 0 && (
                    <p className="text-sm text-muted-foreground">
                      {watchedAmount > 0 ? 'Adicionará' : 'Removerá'}{' '}
                      {Math.abs(watchedAmount)} pontos DKP
                    </p>
                  )}
                </div>

                {/* Reason */}
                <div className="space-y-2">
                  <Label htmlFor="reason">Motivo (Obrigatório)</Label>
                  <Textarea
                    id="reason"
                    placeholder="Ex: Bônus por excelente performance no raid, correção de erro anterior, etc."
                    {...register('reason')}
                    className={errors.reason ? 'border-red-500' : ''}
                  />
                  {errors.reason && (
                    <p className="text-sm text-red-500">
                      {errors.reason.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Este motivo será registrado no histórico para auditoria
                  </p>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      reset();
                      setSelectedUser(null);
                      setAdjustmentType('positive');
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !selectedUser ||
                      createAdjustmentMutation.isPending
                    }
                    className="flex-1"
                  >
                    {(isSubmitting || createAdjustmentMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Aplicar Ajuste
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Success Message */}
        {createAdjustmentMutation.isSuccess && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Ajuste de DKP aplicado com sucesso! O histórico foi atualizado.
            </AlertDescription>
          </Alert>
        )}

        {/* Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Diretrizes para Ajustes DKP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">
                  ✅ Quando Adicionar DKP:
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Bônus por performance excepcional</li>
                  <li>• Correção de erros do sistema</li>
                  <li>• Compensação por problemas técnicos</li>
                  <li>• Eventos especiais ou premiações</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">
                  ❌ Quando Remover DKP:
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Correção de DKP concedido incorretamente</li>
                  <li>• Penalidades por comportamento inadequado</li>
                  <li>• Ajustes por mudanças nas regras</li>
                  <li>• Compras de itens (quando implementado)</li>
                </ul>
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Lembre-se:</strong> Todos os ajustes são registrados com
                timestamp, motivo e administrador responsável para auditoria
                completa.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
