import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useCreateRaidDroppedItem } from '../../hooks/raid-dropped-items.hooks';
import { useLookups } from '../../hooks/items.hooks';
import type { ItemCategory, ItemGrade } from '../../types/api';

const addDroppedItemSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  grade: z.string().min(1, 'Grade é obrigatória'),
  minDkpBid: z.number().min(0, 'Lance mínimo deve ser não-negativo'),
  notes: z.string().max(500, 'Notas muito longas').optional(),
});

type AddDroppedItemFormData = z.infer<typeof addDroppedItemSchema>;

interface AddDroppedItemDialogProps {
  raidInstanceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  HELMET: 'Capacete',
  ARMOR: 'Armadura',
  PANTS: 'Calças',
  BOOTS: 'Botas',
  GLOVES: 'Luvas',
  NECKLACE: 'Colar',
  EARRING: 'Brinco',
  RING: 'Anel',
  SHIELD: 'Escudo',
  WEAPON: 'Arma',
  COMUM: 'Comum',
};

const GRADE_OPTIONS = [
  { value: 'D', label: 'D' },
  { value: 'C', label: 'C' },
  { value: 'B', label: 'B' },
  { value: 'A', label: 'A' },
  { value: 'S', label: 'S' },
];

export function AddDroppedItemDialog({ raidInstanceId, open, onOpenChange }: AddDroppedItemDialogProps) {
  const { data: lookups } = useLookups();
  const createItemMutation = useCreateRaidDroppedItem();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddDroppedItemFormData>({
    resolver: zodResolver(addDroppedItemSchema),
    defaultValues: {
      minDkpBid: 0,
    },
  });

  const watchedCategory = watch('category');
  const watchedGrade = watch('grade');

  const onSubmit = async (data: AddDroppedItemFormData) => {
    try {
      await createItemMutation.mutateAsync({
        raidInstanceId,
        data: {
          name: data.name,
          category: data.category as ItemCategory,
          grade: data.grade as ItemGrade,
          minDkpBid: data.minDkpBid,
          notes: data.notes,
        },
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating dropped item:', error);
      // Error is handled by the mutation hook
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    onOpenChange(newOpen);
  };

  // Get available categories from lookups or use default list
  const availableCategories = lookups?.categories || Object.keys(CATEGORY_LABELS);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Item Dropado
          </DialogTitle>
          <DialogDescription>
            Registre um novo item que foi dropado nesta raid instance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Item</Label>
            <Input
              id="name"
              placeholder="Ex: Espada Dracônica +10"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={watchedCategory}
                onValueChange={(value) => setValue('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {CATEGORY_LABELS[category] || category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select
                value={watchedGrade}
                onValueChange={(value) => setValue('grade', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_OPTIONS.map((grade) => (
                    <SelectItem key={grade.value} value={grade.value}>
                      {grade.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.grade && (
                <p className="text-sm text-destructive">{errors.grade.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minDkpBid">Lance Mínimo (DKP)</Label>
            <Input
              id="minDkpBid"
              type="number"
              min="0"
              placeholder="0"
              {...register('minDkpBid', { valueAsNumber: true })}
            />
            {errors.minDkpBid && (
              <p className="text-sm text-destructive">{errors.minDkpBid.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (Opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Informações adicionais sobre o item..."
              rows={3}
              {...register('notes')}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Adicionar Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
