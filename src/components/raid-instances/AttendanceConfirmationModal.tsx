import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useConfirmAttendance } from '@/hooks/raid-attendance.hooks';
import { Upload, X } from 'lucide-react';

interface AttendanceConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  raidInstanceId: string;
  participantId: string;
  participantName: string;
}

export function AttendanceConfirmationModal({
  open,
  onOpenChange,
  raidInstanceId,
  participantId,
  participantName,
}: AttendanceConfirmationModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const confirmAttendance = useConfirmAttendance();

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Tipo de arquivo inválido',
        description: 'Use JPG, PNG ou WebP',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'Tamanho máximo: 20MB',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: 'Nenhum arquivo selecionado',
        description: 'Selecione uma imagem para enviar',
        variant: 'destructive',
      });
      return;
    }

    try {
      await confirmAttendance.mutateAsync({
        raidInstanceId,
        participantId,
        file: selectedFile,
      });

      toast({
        title: 'Sucesso',
        description: 'Presença confirmada com sucesso!',
      });

      setSelectedFile(null);
      setPreview(null);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Falha ao confirmar presença',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Presença</DialogTitle>
          <DialogDescription>
            Envie uma imagem de prova para {participantName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              className="hidden"
            />

            {preview ? (
              <div className="space-y-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded"
                />
                <p className="text-sm text-gray-600">{selectedFile?.name}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                <p className="text-sm font-medium">Arraste uma imagem aqui</p>
                <p className="text-xs text-gray-500">ou clique para selecionar (JPG, PNG, WebP - max 20MB)</p>
              </div>
            )}
          </div>

          {/* Clear Button */}
          {preview && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedFile(null);
                setPreview(null);
              }}
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!selectedFile || confirmAttendance.isPending}
            className="w-full"
          >
            {confirmAttendance.isPending ? 'Enviando...' : 'Confirmar Presença'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

