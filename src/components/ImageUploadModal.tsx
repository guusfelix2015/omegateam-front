/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper, { type Area } from 'react-easy-crop';
import {
  Upload,
  Image as ImageIcon,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Loader2,
  Trash2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { toast } from 'sonner';
import {
  createCroppedImage,
  getImageDimensions,
  formatFileSize,
} from '../lib/cropImage';
import { Slider } from './ui/slider';

interface ImageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File) => Promise<void>;
  onRemove?: () => Promise<void>;
  currentImageUrl?: string | null;
  isUploading?: boolean;
}

type UploadStep = 'select' | 'crop' | 'preview' | 'uploading';

type AspectRatio = {
  label: string;
  value: number | null;
};

const ASPECT_RATIOS: AspectRatio[] = [
  { label: 'Livre', value: null },
  { label: 'Quadrado (1:1)', value: 1 },
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
];

export const ImageUploadModal = ({
  open,
  onOpenChange,
  onUpload,
  onRemove,
  currentImageUrl,
  isUploading = false,
}: ImageUploadModalProps) => {
  const [step, setStep] = useState<UploadStep>('select');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      if (croppedImageUrl) URL.revokeObjectURL(croppedImageUrl);
    };
  }, [imageSrc, croppedImageUrl]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep('select');
        setSelectedFile(null);
        if (imageSrc) URL.revokeObjectURL(imageSrc);
        if (croppedImageUrl) URL.revokeObjectURL(croppedImageUrl);
        setImageSrc(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setCroppedAreaPixels(null);
        setCroppedImage(null);
        setCroppedImageUrl(null);
        setAspectRatio(null);
        setImageDimensions(null);
      }, 200);
    }
  }, [open]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Formato inválido. Use JPG, PNG ou WebP.');
      return;
    }

    // Validate file size (20MB)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande. Máximo: 20MB.');
      return;
    }

    setSelectedFile(file);

    // Get image dimensions
    try {
      const dimensions = await getImageDimensions(file);
      setImageDimensions(dimensions);
    } catch (error) {
      console.error('Error getting image dimensions:', error);
    }

    // Create preview URL
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageSrc(reader.result as string);
      setStep('crop');
    });
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedBlob = await createCroppedImage(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      setCroppedImage(croppedBlob);

      // Create preview URL for cropped image
      const croppedUrl = URL.createObjectURL(croppedBlob);
      setCroppedImageUrl(croppedUrl);

      setStep('preview');
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Erro ao processar a imagem');
    }
  };

  const handleUpload = async () => {
    if (!croppedImage || !selectedFile) return;

    try {
      setStep('uploading');
      // Create a new File from the cropped blob
      const croppedFile = new File([croppedImage], selectedFile.name, {
        type: selectedFile.type,
      });
      await onUpload(croppedFile);
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setStep('preview');
    }
  };

  const handleRemove = async () => {
    if (!onRemove) return;

    try {
      await onRemove();
      onOpenChange(false);
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const handleBack = () => {
    if (step === 'crop') {
      setStep('select');
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      setImageSrc(null);
      setSelectedFile(null);
    } else if (step === 'preview') {
      setStep('crop');
      if (croppedImageUrl) URL.revokeObjectURL(croppedImageUrl);
      setCroppedImageUrl(null);
      setCroppedImage(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'select' && 'Selecionar Imagem'}
            {step === 'crop' && 'Ajustar Imagem'}
            {step === 'preview' && 'Pré-visualização'}
            {step === 'uploading' && 'Enviando...'}
          </DialogTitle>
          <DialogDescription>
            {step === 'select' &&
              'Arraste uma imagem ou clique para selecionar'}
            {step === 'crop' && 'Ajuste o enquadramento da sua imagem'}
            {step === 'preview' && 'Confirme a imagem antes de enviar'}
            {step === 'uploading' && 'Aguarde enquanto enviamos sua imagem'}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: File Selection */}
        {step === 'select' && (
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
                transition-all duration-200 ease-in-out
                ${isDragActive
                  ? 'border-primary bg-primary/5 scale-105'
                  : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50'
                }
              `}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-lg font-medium">Solte a imagem aqui...</p>
              ) : (
                <>
                  <p className="text-lg font-medium mb-2">
                    Arraste uma imagem aqui
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    ou clique para selecionar
                  </p>
                  <Button type="button" variant="outline" size="sm">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Escolher Arquivo
                  </Button>
                </>
              )}
            </div>

            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>Formatos aceitos: JPG, PNG, WebP</p>
              <p>Tamanho máximo: 20MB</p>
            </div>

            {currentImageUrl && onRemove && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Imagem Atual
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <img
                      src={currentImageUrl}
                      alt="Imagem atual"
                      className="max-w-full h-auto rounded-lg mx-auto"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemove}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover Imagem
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 2: Crop */}
        {step === 'crop' && imageSrc && (
          <div className="space-y-4">
            {/* Image info */}
            {selectedFile && imageDimensions && (
              <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span className="font-medium">{selectedFile.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>
                    {imageDimensions.width} × {imageDimensions.height}
                  </span>
                  <span>{formatFileSize(selectedFile.size)}</span>
                </div>
              </div>
            )}

            {/* Cropper */}
            <div className="relative h-[400px] bg-muted rounded-lg overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspectRatio || undefined}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
              />
            </div>

            {/* Aspect Ratio Selection */}
            <div className="space-y-2">
              <Label>Proporção</Label>
              <div className="flex flex-wrap gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <Button
                    key={ratio.label}
                    type="button"
                    variant={aspectRatio === ratio.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAspectRatio(ratio.value)}
                  >
                    {ratio.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Zoom Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Zoom</Label>
                <span className="text-sm text-muted-foreground">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ZoomOut className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0])}
                  min={1}
                  max={3}
                  step={0.1}
                  className="flex-1"
                />
                <ZoomIn className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Rotation Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Rotação</Label>
                <span className="text-sm text-muted-foreground">
                  {rotation}°
                </span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCw className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[rotation]}
                  onValueChange={(value) => setRotation(value[0])}
                  min={0}
                  max={360}
                  step={1}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 'preview' && croppedImageUrl && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-muted/50">
              <img
                src={croppedImageUrl}
                alt="Preview"
                className="max-w-full h-auto rounded-lg mx-auto"
                style={{ maxHeight: '400px' }}
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Confirme se a imagem está como desejado antes de enviar
            </p>
          </div>
        )}

        {/* Step 4: Uploading */}
        {step === 'uploading' && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Enviando imagem...</p>
            <p className="text-sm text-muted-foreground">
              Por favor, aguarde
            </p>
          </div>
        )}

        <DialogFooter>
          {step === 'select' && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
          )}

          {(step === 'crop' || step === 'preview') && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isUploading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>

              {step === 'crop' && (
                <Button type="button" onClick={handleCropConfirm}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Continuar
                </Button>
              )}

              {step === 'preview' && (
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Enviar e Salvar
                    </>
                  )}
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

