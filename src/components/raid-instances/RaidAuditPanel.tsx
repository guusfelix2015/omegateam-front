import { useState } from 'react';
import { useAuditStatus, useAuditRaidInstance } from '@/hooks/raid-attendance.hooks';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface RaidAuditPanelProps {
  raidInstanceId: string;
}

export function RaidAuditPanel({ raidInstanceId }: RaidAuditPanelProps) {
  const { isAdmin } = useAuth();
  const { data: auditStatus, isLoading } = useAuditStatus(raidInstanceId);
  const auditRaid = useAuditRaidInstance();
  const { toast } = useToast();
  const [notes, setNotes] = useState('');

  const handleAudit = async () => {
    try {
      await auditRaid.mutateAsync({
        raidInstanceId,
        notes: notes || undefined,
      });

      toast({
        title: 'Sucesso',
        description: 'Raid auditado com sucesso e DKP distribuído',
      });

      setNotes('');
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Falha ao auditar raid',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando status de auditoria...</div>;
  }

  if (!auditStatus) {
    return <div className="text-center py-8">Não foi possível carregar o status de auditoria</div>;
  }

  if (!isAdmin) {
    return (
      <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-medium text-sm text-yellow-900">Acesso Restrito</p>
            <p className="text-xs text-yellow-700 mt-1">
              Apenas administradores podem auditar raids e distribuir DKP.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const canAudit = !auditStatus.isAudited && auditStatus.confirmedParticipants > 0;

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <div className={`border rounded-lg p-4 ${auditStatus.isAudited
        ? 'bg-green-50 border-green-200'
        : 'bg-yellow-50 border-yellow-200'
        }`}>
        <div className="flex items-start gap-3">
          {auditStatus.isAudited ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          )}

          <div className="flex-1">
            <p className="font-medium text-sm">
              {auditStatus.isAudited ? 'Raid Auditado' : 'Auditoria Pendente'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {auditStatus.confirmedParticipants} de {auditStatus.totalParticipants} participantes confirmados ({auditStatus.confirmationPercentage}%)
            </p>

            {auditStatus.isAudited && auditStatus.auditedAt && (
              <p className="text-xs text-gray-500 mt-1">
                Auditado em {new Date(auditStatus.auditedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Audit Controls */}
      {!auditStatus.isAudited && (
        <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
          <div>
            <label className="text-sm font-medium">Notas de Auditoria (Opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione quaisquer notas sobre esta auditoria..."
              className="w-full mt-2 p-2 border rounded text-sm"
              rows={3}
            />
          </div>

          <Button
            onClick={handleAudit}
            disabled={!canAudit || auditRaid.isPending}
            className="w-full"
          >
            {auditRaid.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Auditoria...
              </>
            ) : (
              'Auditar Raid & Distribuir DKP'
            )}
          </Button>

          {!canAudit && (
            <p className="text-xs text-red-600">
              Pelo menos um participante deve confirmar presença antes de auditar
            </p>
          )}
        </div>
      )}

      {/* Audited Info */}
      {auditStatus.isAudited && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="text-sm font-medium mb-2">Informações de Auditoria</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>Auditado por: {auditStatus.auditedByName || auditStatus.auditedBy || 'Desconhecido'}</p>
            <p>Auditado em: {new Date(auditStatus.auditedAt!).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

