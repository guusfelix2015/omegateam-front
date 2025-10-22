import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download } from 'lucide-react';

interface AttendanceImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  participantName: string;
  participantNickname: string;
  uploadedAt?: string | null;
}

export function AttendanceImageModal({
  open,
  onOpenChange,
  imageUrl,
  participantName,
  participantNickname,
  uploadedAt,
}: AttendanceImageModalProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `attendance-${participantNickname}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Prova de Presença - {participantNickname}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {participantName}
            {uploadedAt && (
              <>
                {' '}
                • Enviado em{' '}
                {new Date(uploadedAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </>
            )}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image Container */}
          <div className="flex justify-center bg-muted rounded-lg p-4">
            <img
              src={imageUrl}
              alt={`Attendance proof for ${participantNickname}`}
              className="max-w-full max-h-96 rounded-lg object-contain"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir em Nova Aba
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

