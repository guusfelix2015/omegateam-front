import { useState } from 'react';
import { Image, Upload, Trash2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';
import { useUpdateProfile } from '../hooks/users.hooks';
import { useUploadInventoryImage } from '../hooks/upload.hooks';
import { ImageUploadModal } from './ImageUploadModal';
import { toast } from 'sonner';

export const InventoryUrlTab = () => {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const uploadMutation = useUploadInventoryImage();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      const imageUrl = await uploadMutation.mutateAsync(file);
      await updateProfileMutation.mutateAsync({ bagUrl: imageUrl });
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao enviar imagem');
      throw error;
    }
  };

  const handleRemove = async () => {
    try {
      await updateProfileMutation.mutateAsync({ bagUrl: null });
      toast.success('Imagem removida com sucesso!');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Erro ao remover imagem');
      throw error;
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Inventário URL</h3>
          </div>
          <div className="flex gap-2">
            {user?.bagUrl && (
              <Button
                onClick={() => setIsModalOpen(true)}
                size="sm"
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Alterar Imagem
              </Button>
            )}

          </div>
        </div>

        {/* Image Display */}
        {user?.bagUrl ? (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative group">
                {/* Fixed size container for consistent layout */}
                <div className="w-full max-w-2xl mx-auto h-[500px] bg-muted flex items-center justify-center overflow-hidden">
                  <img
                    src={user.bagUrl}
                    alt="Inventário do usuário"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const errorDiv = target.nextElementSibling as HTMLElement;
                      if (errorDiv) {
                        errorDiv.classList.remove('hidden');
                      }
                    }}
                  />
                  <div className="hidden absolute inset-0 bg-muted flex-col items-center justify-center text-center py-12">
                    <Image className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-muted-foreground mb-2">
                      Erro ao carregar a imagem
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Verifique se a URL está correta
                    </p>
                  </div>
                </div>

                {/* Hover overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    size="sm"
                    variant="secondary"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Alterar
                  </Button>
                  <Button
                    onClick={handleRemove}
                    size="sm"
                    variant="destructive"
                    disabled={updateProfileMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-2">
            <CardContent className="text-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-muted p-6">
                  <Image className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    Nenhuma imagem configurada
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Adicione uma imagem do seu inventário para compartilhar com
                    outros jogadores
                  </p>
                </div>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  size="lg"
                  className="mt-4"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Fazer Upload
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upload Modal */}
      <ImageUploadModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onUpload={handleUpload}
        onRemove={user?.bagUrl ? handleRemove : undefined}
        currentImageUrl={user?.bagUrl}
        isUploading={uploadMutation.isPending || updateProfileMutation.isPending}
      />
    </>
  );
};
