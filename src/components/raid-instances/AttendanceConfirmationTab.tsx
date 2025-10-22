import { useState } from 'react';
import { useAttendanceConfirmations, useRemoveAttendanceConfirmation } from '@/hooks/raid-attendance.hooks';
import { AttendanceStatusBadge } from './AttendanceStatusBadge';
import { AttendanceConfirmationModal } from './AttendanceConfirmationModal';
import { AttendanceImageModal } from './AttendanceImageModal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AttendanceConfirmationTabProps {
  raidInstanceId: string;
  isAudited: boolean;
}

export function AttendanceConfirmationTab({
  raidInstanceId,
  isAudited,
}: AttendanceConfirmationTabProps) {
  const { user } = useAuth();
  const { data: attendanceData, isLoading } = useAttendanceConfirmations(raidInstanceId);
  const removeConfirmation = useRemoveAttendanceConfirmation();
  const { toast } = useToast();
  const [selectedParticipant, setSelectedParticipant] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    participantName: string;
    participantNickname: string;
    uploadedAt?: string | null;
  } | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const handleRemoveConfirmation = async (participantId: string) => {
    try {
      await removeConfirmation.mutateAsync({
        raidInstanceId,
        participantId,
      });

      toast({
        title: 'Sucesso',
        description: 'Confirmação removida com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Falha ao remover confirmação',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando dados de presença...</div>;
  }

  const confirmations = attendanceData?.data || [];
  const confirmedCount = confirmations.filter((c) => c.status === 'confirmed').length;
  const totalCount = confirmations.length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900">
          Status de presença: {confirmedCount} de {totalCount} confirmados ({Math.round((confirmedCount / totalCount) * 100)}%)
        </p>
      </div>

      {/* Audit History */}
      {confirmations.some((c) => c.status === 'confirmed') && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium mb-3 text-gray-900">Histórico de Uploads</p>
          <div className="space-y-2">
            {confirmations
              .filter((c) => c.status === 'confirmed')
              .map((confirmation) => (
                <div key={confirmation.participantId} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>
                    <span className="font-medium text-gray-900">{confirmation.userNickname}</span>
                    {' '}enviou confirmação de presença em{' '}
                    <span className="font-medium text-gray-900">
                      {confirmation.uploadedAt
                        ? new Date(confirmation.uploadedAt).toLocaleString('pt-BR')
                        : 'data desconhecida'}
                    </span>
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Attendance List */}
      <div className="space-y-2">
        {confirmations.map((confirmation) => (
          <div
            key={confirmation.participantId}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex-1">
              <p className="font-medium text-sm">{confirmation.userNickname}</p>
              <p className="text-xs text-gray-500">{confirmation.userName}</p>
            </div>

            <div className="flex items-center gap-3">
              <AttendanceStatusBadge
                status={confirmation.status}
                uploadedAt={confirmation.uploadedAt}
              />

              {confirmation.status === 'confirmed' && confirmation.imageUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedImage({
                      url: confirmation.imageUrl!,
                      participantName: confirmation.userName,
                      participantNickname: confirmation.userNickname,
                      uploadedAt: confirmation.uploadedAt,
                    });
                    setImageModalOpen(true);
                  }}
                >
                  Ver Imagem
                </Button>
              )}

              {/* Upload button - visible for admins or the participant themselves */}
              {!isAudited && confirmation.status === 'pending' && (
                (user?.role === 'ADMIN' || user?.id === confirmation.userId) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedParticipant({
                        id: confirmation.participantId,
                        name: confirmation.userNickname,
                      });
                      setModalOpen(true);
                    }}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                )
              )}

              {/* Delete button - only for admins */}
              {user?.role === 'ADMIN' && !isAudited && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveConfirmation(confirmation.participantId)}
                  disabled={removeConfirmation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {selectedParticipant && (
        <AttendanceConfirmationModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          raidInstanceId={raidInstanceId}
          participantId={selectedParticipant.id}
          participantName={selectedParticipant.name}
        />
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <AttendanceImageModal
          open={imageModalOpen}
          onOpenChange={setImageModalOpen}
          imageUrl={selectedImage.url}
          participantName={selectedImage.participantName}
          participantNickname={selectedImage.participantNickname}
          uploadedAt={selectedImage.uploadedAt}
        />
      )}
    </div>
  );
}

