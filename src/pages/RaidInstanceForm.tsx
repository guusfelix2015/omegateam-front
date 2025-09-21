import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  Swords,
  Users,
  Loader2,
  Plus,
  X,
  Search,
  Calculator
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useRaid, useCreateRaidInstance, useDkpPreview } from '../hooks/raids.hooks';
import { useUsers } from '../hooks/users.hooks';
import { Layout } from '../components/Layout';
import { useDebounce } from '../hooks/useDebounce';

const raidInstanceFormSchema = z.object({
  notes: z.string().max(500, 'Notas muito longas').optional(),
});

type RaidInstanceFormData = z.infer<typeof raidInstanceFormSchema>;

export default function RaidInstanceForm() {
  const navigate = useNavigate();
  const { raidId } = useParams();

  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: raid, isLoading: isLoadingRaid } = useRaid(raidId || '');
  const { data: usersData, isLoading: isLoadingUsers } = useUsers({
    search: debouncedSearch,
    limit: 20,
  });

  const createInstanceMutation = useCreateRaidInstance();
  const dkpPreviewMutation = useDkpPreview();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RaidInstanceFormData>({
    resolver: zodResolver(raidInstanceFormSchema),
  });

  // Auto-preview DKP when participants change
  useEffect(() => {
    if (raidId && selectedParticipants.length > 0) {
      dkpPreviewMutation.mutate({
        raidId,
        participantIds: selectedParticipants,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raidId, selectedParticipants]);

  const onSubmit = async (data: RaidInstanceFormData) => {
    if (!raidId || selectedParticipants.length === 0) return;

    try {
      await createInstanceMutation.mutateAsync({
        raidId,
        participantIds: selectedParticipants,
        notes: data.notes,
      });
      navigate(`/raids/${raidId}`);
    } catch (error) {
      console.error('Error creating raid instance:', error);
    }
  };

  const toggleParticipant = (userId: string) => {
    setSelectedParticipants(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const removeParticipant = (userId: string) => {
    setSelectedParticipants(prev => prev.filter(id => id !== userId));
  };

  if (isLoadingRaid) {
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

  if (!raid) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-red-500">Raid não encontrado</p>
          <Button asChild className="mt-4">
            <Link to="/raids">Voltar para Raids</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const users = usersData?.data || [];
  const selectedUsers = users.filter(user => selectedParticipants.includes(user.id));
  const availableUsers = users.filter(user => !selectedParticipants.includes(user.id));

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(`/raids/${raidId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Swords className="h-8 w-8 text-primary" />
              Nova Instância: {raid.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Registre uma nova execução do raid e distribua DKP
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Raid Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações do Raid</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nível do Boss:</span>
                  <span className="font-semibold">{raid.bossLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Score Base DKP:</span>
                  <span className="font-semibold">{raid.baseScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={raid.isActive ? 'default' : 'secondary'}>
                    {raid.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Instância</CardTitle>
                <CardDescription>
                  Adicione informações sobre esta execução do raid
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas (Opcional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Ex: Raid executado sem problemas, boss morreu em 15 minutos..."
                      {...register('notes')}
                      className={errors.notes ? 'border-red-500' : ''}
                    />
                    {errors.notes && (
                      <p className="text-sm text-red-500">{errors.notes.message}</p>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/raids/${raidId}`)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || selectedParticipants.length === 0 || createInstanceMutation.isPending}
                      className="flex-1"
                    >
                      {(isSubmitting || createInstanceMutation.isPending) && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Criar Instância
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Participants */}
          <div className="space-y-6">
            {/* Selected Participants */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Participantes Selecionados ({selectedParticipants.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedUsers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum participante selecionado
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Lvl {user.lvl} • GS: {user.gearScore}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeParticipant(user.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* DKP Preview */}
            {dkpPreviewMutation.data && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Preview DKP
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">DKP Total:</span>
                    <span className="font-bold text-lg">
                      {dkpPreviewMutation.data.totalDkpToAward}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Média por Participante:</span>
                    <span className="font-semibold">
                      {Math.round(dkpPreviewMutation.data.averageDkpPerParticipant)}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      💡 DKP calculado baseado no gear score dos participantes
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add Participants */}
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Participantes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar jogadores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {isLoadingUsers ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {availableUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-2 hover:bg-muted rounded-lg cursor-pointer"
                        onClick={() => toggleParticipant(user.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.nickname} • Lvl {user.lvl} • GS: {user.gearScore}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {availableUsers.length === 0 && searchTerm && (
                      <p className="text-muted-foreground text-center py-4">
                        Nenhum jogador encontrado
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
