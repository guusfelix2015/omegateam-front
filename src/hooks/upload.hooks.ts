import { useMutation } from '@tanstack/react-query';
import { uploadService } from '../services/upload.service';
import { toast } from 'sonner';

/**
 * Hook to upload user inventory image
 */
export function useUploadInventoryImage() {
  return useMutation({
    mutationFn: (file: File) => uploadService.uploadUserInventoryImage(file),
    onSuccess: () => {
      toast.success('Imagem enviada com sucesso!');
    },
    onError: (error: Error) => {
      console.error('Upload error:', error);
      toast.error('Erro ao enviar imagem. Tente novamente.');
    },
  });
}

