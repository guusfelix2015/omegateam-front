/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CreateRaidInstanceDroppedItemSchema, type CreateRaidInstanceDroppedItem } from '@/types/api';

const droppedItemsStepSchema = z.object({
  droppedItems: z.array(CreateRaidInstanceDroppedItemSchema),
});

type DroppedItemsStepData = z.infer<typeof droppedItemsStepSchema>;

interface DroppedItemsStepProps {
  droppedItems: CreateRaidInstanceDroppedItem[];
  onUpdate: (droppedItems: CreateRaidInstanceDroppedItem[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CATEGORY_LABELS = {
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

const GRADE_LABELS = {
  D: 'Grade D',
  C: 'Grade C',
  B: 'Grade B',
  A: 'Grade A',
  S: 'Grade S',
};

const GRADE_COLORS = {
  D: 'bg-amber-100 text-amber-800',
  C: 'bg-green-100 text-green-800',
  B: 'bg-blue-100 text-blue-800',
  A: 'bg-purple-100 text-purple-800',
  S: 'bg-red-100 text-red-800',
};

export function DroppedItemsStep({ droppedItems, onUpdate, onNext, onPrevious }: DroppedItemsStepProps) {

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DroppedItemsStepData>({
    resolver: zodResolver(droppedItemsStepSchema),
    defaultValues: {
      droppedItems: droppedItems.length > 0 ? droppedItems : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'droppedItems',
  });

  const watchedItems = watch('droppedItems');

  const onSubmit = (data: DroppedItemsStepData) => {
    onUpdate(data.droppedItems);
    onNext();
  };

  const addItem = () => {
    append({
      name: '',
      category: 'WEAPON',
      grade: 'D',
      minDkpBid: 0,
      notes: '',
    });
  };

  const availableCategories = Object.keys(CATEGORY_LABELS);
  const availableGrades = Object.keys(GRADE_LABELS);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Itens Dropados</h2>
        <p className="text-muted-foreground mt-2">
          Adicione os itens que foram dropados durante o raid (opcional)
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Itens</CardTitle>
                <CardDescription>
                  {fields.length === 0
                    ? 'Nenhum item adicionado ainda'
                    : `${fields.length} item(s) adicionado(s)`
                  }
                </CardDescription>
              </div>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum item dropado foi adicionado.</p>
                <p className="text-sm mt-1">Clique em "Adicionar Item" para começar.</p>
              </div>
            ) : (
              fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Item {index + 1}</Badge>
                      {watchedItems[index]?.grade && (
                        <Badge className={GRADE_COLORS[watchedItems[index].grade as keyof typeof GRADE_COLORS]}>
                          {GRADE_LABELS[watchedItems[index].grade as keyof typeof GRADE_LABELS]}
                        </Badge>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`droppedItems.${index}.name`}>Nome do Item *</Label>
                      <Input
                        id={`droppedItems.${index}.name`}
                        placeholder="Ex: Sword of Flames"
                        {...register(`droppedItems.${index}.name`)}
                        className={errors.droppedItems?.[index]?.name ? 'border-red-500' : ''}
                      />
                      {errors.droppedItems?.[index]?.name && (
                        <p className="text-sm text-red-500">
                          {errors.droppedItems[index]?.name?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`droppedItems.${index}.category`}>Categoria *</Label>
                      <Select
                        value={watchedItems[index]?.category || ''}
                        onValueChange={(value) => setValue(`droppedItems.${index}.category`, value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCategories.map((category: string) => (
                            <SelectItem key={category} value={category}>
                              {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`droppedItems.${index}.grade`}>Grade *</Label>
                      <Select
                        value={watchedItems[index]?.grade || ''}
                        onValueChange={(value) => setValue(`droppedItems.${index}.grade`, value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableGrades.map((grade: string) => (
                            <SelectItem key={grade} value={grade}>
                              {GRADE_LABELS[grade as keyof typeof GRADE_LABELS]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`droppedItems.${index}.minDkpBid`}>Lance Mínimo DKP *</Label>
                      <Input
                        id={`droppedItems.${index}.minDkpBid`}
                        type="number"
                        min="0"
                        placeholder="0"
                        {...register(`droppedItems.${index}.minDkpBid`, { valueAsNumber: true })}
                        className={errors.droppedItems?.[index]?.minDkpBid ? 'border-red-500' : ''}
                      />
                      {errors.droppedItems?.[index]?.minDkpBid && (
                        <p className="text-sm text-red-500">
                          {errors.droppedItems[index]?.minDkpBid?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`droppedItems.${index}.notes`}>Notas (Opcional)</Label>
                      <Textarea
                        id={`droppedItems.${index}.notes`}
                        placeholder="Informações adicionais sobre o item..."
                        {...register(`droppedItems.${index}.notes`)}
                        rows={2}
                      />
                    </div>
                  </div>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onPrevious} className="flex-1">
            Voltar
          </Button>
          <Button type="submit" className="flex-1">
            Continuar
          </Button>
        </div>
      </form>
    </div>
  );
}
