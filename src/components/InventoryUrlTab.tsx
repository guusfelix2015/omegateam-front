import { useState, useEffect } from 'react';
import { Image, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../hooks/useAuth';
import { useUpdateProfile } from '../hooks/users.hooks';

export const InventoryUrlTab = () => {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const [bagUrl, setBagUrl] = useState(user?.bagUrl || '');
  const [isEditing, setIsEditing] = useState(false);

  // Sync local state when user data changes
  useEffect(() => {
    setBagUrl(user?.bagUrl || '');
  }, [user?.bagUrl]);

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync({ bagUrl: bagUrl || null });
      setIsEditing(false);
    } catch (error) {
      // Error handling is done in the hook
      console.error('Error updating bag URL:', error);
    }
  };

  const handleCancel = () => {
    setBagUrl(user?.bagUrl || '');
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Inventário URL</h3>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            size="sm"
            variant="outline"
          >
            Editar URL
          </Button>
        )}
      </div>

      {/* URL Input */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              URL da Imagem do Inventário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bagUrl">URL da Imagem</Label>
              <Input
                id="bagUrl"
                type="url"
                placeholder="https://exemplo.com/meu-inventario.png"
                value={bagUrl}
                onChange={(e) => setBagUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Cole aqui a URL de uma imagem do seu inventário (ex: screenshot
                do jogo)
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
                size="sm"
                className="flex items-center gap-2"
              >
                {updateProfileMutation.isPending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Salvar
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Display */}
      {bagUrl && !isEditing && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="text-center">
                <img
                  src={bagUrl}
                  alt="Inventário do usuário"
                  className="max-w-full h-auto rounded-lg border shadow-sm mx-auto"
                  style={{ maxHeight: '600px' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden text-center py-8">
                  <Image className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    Erro ao carregar a imagem
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Verifique se a URL está correta
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!bagUrl && !isEditing && (
        <Card>
          <CardContent className="text-center py-8">
            <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nenhuma imagem configurada
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Adicione uma URL de imagem para mostrar seu inventário
            </p>
            <Button
              onClick={() => setIsEditing(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Image className="h-4 w-4" />
              Adicionar URL
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
