import { Loader2, Users, Package, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Raid, User, CreateRaidInstanceDroppedItem } from '@/types/api';

// Temporary type for DKP Preview
interface DkpPreview {
  totalDkpToAward: number;
  averageDkpPerParticipant: number;
  participants: Array<{
    userId: string;
    name: string;
    gearScore: number;
    dkpAwarded: number;
  }>;
}

interface SummaryStepProps {
  raid: Raid;
  selectedParticipants: User[];
  droppedItems: CreateRaidInstanceDroppedItem[];
  notes?: string;
  dkpPreview?: DkpPreview;
  onSubmit: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
}

const CATEGORY_LABELS = {
  WEAPON: 'Arma',
  ARMOR: 'Armadura',
  ACCESSORY: 'Acessório',
  CONSUMABLE: 'Consumível',
  MISC: 'Diversos',
};

const GRADE_LABELS = {
  NO_GRADE: 'Sem Grade',
  D: 'Grade D',
  C: 'Grade C',
  B: 'Grade B',
  A: 'Grade A',
  S: 'Grade S',
};

const GRADE_COLORS = {
  NO_GRADE: 'bg-gray-100 text-gray-800',
  D: 'bg-amber-100 text-amber-800',
  C: 'bg-green-100 text-green-800',
  B: 'bg-blue-100 text-blue-800',
  A: 'bg-purple-100 text-purple-800',
  S: 'bg-red-100 text-red-800',
};

export function SummaryStep({
  raid,
  selectedParticipants,
  droppedItems,
  notes,
  dkpPreview,
  onSubmit,
  onPrevious,
  isSubmitting,
}: SummaryStepProps) {
  const totalDkpToAward = dkpPreview?.totalDkpToAward || 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Resumo da Criação</h2>
        <p className="text-muted-foreground mt-2">
          Revise todas as informações antes de criar a instância de raid
        </p>
      </div>

      <div className="grid gap-6">
        {/* Informações do Raid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Informações do Raid
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nome
                </p>
                <p className="font-medium">{raid.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nível do Boss
                </p>
                <Badge variant="secondary">{raid.bossLevel}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Score Base
                </p>
                <p className="font-medium">{raid.baseScore}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge variant={raid.isActive ? 'default' : 'secondary'}>
                  {raid.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Participantes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participantes ({selectedParticipants.length})
            </CardTitle>
            <CardDescription>
              Total de DKP a ser distribuído:{' '}
              <span className="font-medium">{totalDkpToAward}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {selectedParticipants.map((participant) => {
                const participantDkp = dkpPreview?.participants.find(
                  (p) => p.userId === participant.id
                );
                return (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar || undefined} />
                        <AvatarFallback>
                          {participant.nickname.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{participant.nickname}</p>
                        <p className="text-sm text-muted-foreground">
                          GS: {participant.gearScore} • Lvl: {participant.lvl}
                        </p>
                      </div>
                    </div>
                    {participantDkp && (
                      <Badge variant="outline">
                        +{participantDkp.dkpAwarded} DKP
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Itens Dropados */}
        {droppedItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Itens Dropados ({droppedItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {droppedItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{item.name}</p>
                          <Badge
                            className={
                              GRADE_COLORS[
                                item.grade as keyof typeof GRADE_COLORS
                              ]
                            }
                          >
                            {
                              GRADE_LABELS[
                                item.grade as keyof typeof GRADE_LABELS
                              ]
                            }
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>
                            {
                              CATEGORY_LABELS[
                                item.category as keyof typeof CATEGORY_LABELS
                              ]
                            }
                          </span>
                          {item.notes && (
                            <>
                              <span>•</span>
                              <span>{item.notes}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">Min: {item.minDkpBid} DKP</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notas */}
        {notes && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="border-t" />

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex-1"
        >
          Voltar
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting} className="flex-1">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Criar Instância de Raid
        </Button>
      </div>
    </div>
  );
}
