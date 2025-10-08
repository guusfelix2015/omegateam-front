import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Edit, Loader2 } from 'lucide-react';
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
import { useUpdateRaidDroppedItem } from '../../hooks/raid-dropped-items.hooks';
import { useLookups } from '../../hooks/items.hooks';
import type { RaidDroppedItem, ItemCategory, ItemGrade } from '../../types/api';

const editDroppedItemSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  grade: z.string().min(1, 'Grade é obrigatória'),
  minDkpBid: z.number().min(0, 'Lance mínimo deve ser não-negativo'),
  notes: z.string().max(500, 'Notas muito longas').optional(),
});

type EditDroppedItemFormData = z.infer<typeof editDroppedItemSchema>;

interface EditDroppedItemDialogProps {
  item: RaidDroppedItem;
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

export function EditDroppedItemDialog({
  item,
  open,
  onOpenChange,
}: EditDroppedItemDialogProps) {
  const { data: lookups } = useLookups();
  const updateItemMutation = useUpdateRaidDroppedItem();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditDroppedItemFormData>({
    resolver: zodResolver(editDroppedItemSchema),
  });

  const watchedCategory = watch('category');
  const watchedGrade = watch('grade');

  // Reset form when item changes
  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        category: item.category,
        grade: item.grade,
        minDkpBid: item.minDkpBid,
        notes: item.notes || '',
      });
    }
  }, [item, reset]);

  const onSubmit = async (data: EditDroppedItemFormData) => {
    try {
      await updateItemMutation.mutateAsync({
        id: item.id,
        data: {
          name: data.name,
          category: data.category as ItemCategory,
          grade: data.grade as ItemGrade,
          minDkpBid: data.minDkpBid,
          notes: data.notes,
        },
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating dropped item:', error);
    }
  };

  // Get available categories from lookups or use default list
  const availableCategories =
    lookups?.categories || Object.keys(CATEGORY_LABELS);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Item Dropado
          </DialogTitle>
          <DialogDescription>
            Atualize as informações do item dropado.
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
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
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
                <p className="text-sm text-destructive">
                  {errors.grade.message}
                </p>
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
              <p className="text-sm text-destructive">
                {errors.minDkpBid.message}
              </p>
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
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
