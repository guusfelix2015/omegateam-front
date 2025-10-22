import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AttendanceConfirmationModal } from './AttendanceConfirmationModal';
import { Upload, CheckCircle2 } from 'lucide-react';

interface ConfirmAttendanceButtonProps {
  raidInstanceId: string;
  participantId: string;
  participantName: string;
  isConfirmed: boolean;
  isAudited: boolean;
}

export function ConfirmAttendanceButton({
  raidInstanceId,
  participantId,
  participantName,
  isConfirmed,
  isAudited,
}: ConfirmAttendanceButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (isAudited) {
    return (
      <Button disabled variant="outline" size="sm">
        <CheckCircle2 className="w-4 h-4 mr-2" />
        Auditado
      </Button>
    );
  }

  if (isConfirmed) {
    return (
      <Button disabled variant="default" size="sm">
        <CheckCircle2 className="w-4 h-4 mr-2" />
        Confirmado
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        variant="outline"
        size="sm"
      >
        <Upload className="w-4 h-4 mr-2" />
        Confirmar Presença
      </Button>

      <AttendanceConfirmationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        raidInstanceId={raidInstanceId}
        participantId={participantId}
        participantName={participantName}
      />
    </>
  );
}

