import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Swords,
  Users,
  Trophy,
  Clock,
  Loader2,
  Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useRaidInstance } from '../hooks/raids.hooks';
import { Layout } from '../components/Layout';

export default function RaidInstanceDetail() {
  const { id } = useParams();

  const { data: instance, isLoading, error } = useRaidInstance(id || '');

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando instância...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !instance) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-red-500">Erro ao carregar instância</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : 'Instância não encontrada'}
          </p>
          <Button asChild className="mt-4">
            <Link to="/raids">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Raids
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const totalDkp = instance.participants.reduce((sum, p) => sum + p.dkpAwarded, 0);
  const averageDkp = instance.participants.length > 0 ? totalDkp / instance.participants.length : 0;
  const topParticipant = instance.participants.reduce((top, current) =>
    current.dkpAwarded > top.dkpAwarded ? current : top, instance.participants[0]
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to={`/raids/${instance.raidId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Raid
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Swords className="h-8 w-8 text-primary" />
              {instance.raid.name} - Instância #{instance.id.slice(-8)}
            </h1>
            <p className="text-muted-foreground mt-1">
              Executado em {new Date(instance.completedAt).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Participantes</p>
                  <p className="text-2xl font-bold">{instance.participants.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">DKP Total</p>
                  <p className="text-2xl font-bold text-yellow-600">{totalDkp}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">DKP Médio</p>
                  <p className="text-2xl font-bold text-blue-600">{Math.round(averageDkp)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Boss Level</p>
                  <p className="text-2xl font-bold">{instance.raid.bossLevel}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instance Details */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Raid Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Raid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nome:</span>
                <span className="font-semibold">{instance.raid.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nível do Boss:</span>
                <span className="font-semibold">{instance.raid.bossLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Score Base:</span>
                <span className="font-semibold">{instance.raid.baseScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={instance.raid.isActive ? 'default' : 'secondary'}>
                  {instance.raid.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Instance Info */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Execução</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data/Hora:</span>
                <span className="font-semibold">
                  {new Date(instance.completedAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Criado em:</span>
                <span className="font-semibold">
                  {new Date(instance.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              {instance.notes && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Notas:</p>
                  <p className="text-sm italic">"{instance.notes}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Performer */}
          {topParticipant && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Maior DKP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={topParticipant.user?.avatar || undefined} />
                    <AvatarFallback>
                      {topParticipant.user?.name.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{topParticipant.user?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {topParticipant.user?.nickname}
                    </p>
                    <p className="text-lg font-bold text-yellow-600">
                      {topParticipant.dkpAwarded} DKP
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Participants List */}
        <Card>
          <CardHeader>
            <CardTitle>Participantes ({instance.participants.length})</CardTitle>
            <CardDescription>
              Lista completa de jogadores que participaram desta execução
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {instance.participants
                .sort((a, b) => b.dkpAwarded - a.dkpAwarded)
                .map((participant, index) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                        {index + 1}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={participant.user?.avatar || undefined} />
                        <AvatarFallback>
                          {participant.user?.name.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{participant.user?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {participant.user?.nickname}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Gear Score</p>
                        <p className="font-semibold">{participant.gearScoreAtTime}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">DKP Recebido</p>
                        <p className="text-lg font-bold text-yellow-600">
                          {participant.dkpAwarded}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
