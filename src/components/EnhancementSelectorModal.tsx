import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { EnhancementBadge } from './EnhancementBadge';
import {
  calculateEnhancementBonus,
  getRareItemBonus,
} from '../utils/enhancement.utils';

interface EnhancementSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (level: number, isRare: boolean) => void;
  currentLevel: number;
  currentIsRare?: boolean;
  itemName: string;
  baseGS: number;
}

export const EnhancementSelectorModal: React.FC<
  EnhancementSelectorModalProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  currentLevel,
  currentIsRare = false,
  itemName,
  baseGS,
}) => {
  const [selectedLevel, setSelectedLevel] = useState(currentLevel);
  const [isRare, setIsRare] = useState(currentIsRare);

  const handleConfirm = () => {
    onConfirm(selectedLevel, isRare);
    onClose();
  };

  const enhancementBonus = calculateEnhancementBonus(selectedLevel);
  const rareBonus = getRareItemBonus(isRare);
  const totalGS = baseGS + enhancementBonus + rareBonus;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Selecionar Nível de Encantamento</DialogTitle>
          <DialogDescription>{itemName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Enhancement Level Display */}
          <div className="flex items-center justify-center gap-4">
            <EnhancementBadge level={selectedLevel} size="lg" />
            <span className="text-3xl font-bold">
              {selectedLevel === 0 ? 'Sem Encantamento' : `+${selectedLevel}`}
            </span>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="12"
              step="1"
              value={selectedLevel}
              onChange={e => setSelectedLevel(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>+6</span>
              <span>+12</span>
            </div>
          </div>

          {/* Level Buttons */}
          <div className="grid grid-cols-7 gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(level => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`
                  px-2 py-1 text-xs rounded
                  ${
                    selectedLevel === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                `}
              >
                {level === 0 ? '0' : `+${level}`}
              </button>
            ))}
          </div>

          {/* Rare Item Toggle */}
          <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3">
              <div className="text-2xl">✨</div>
              <div>
                <Label htmlFor="rare-toggle" className="text-sm font-semibold">
                  Item Raro
                </Label>
                <p className="text-xs text-muted-foreground">
                  +10 GS adicional
                </p>
              </div>
            </div>
            <Switch
              id="rare-toggle"
              checked={isRare}
              onCheckedChange={setIsRare}
            />
          </div>

          {/* GS Preview */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GS Base:</span>
              <span className="font-medium">{baseGS}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Bônus de Encantamento:
              </span>
              <span className="font-medium text-blue-600">
                +{enhancementBonus}
              </span>
            </div>
            {isRare && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bônus Item Raro:</span>
                <span className="font-medium text-amber-600">
                  +{rareBonus}
                </span>
              </div>
            )}
            <div className="h-px bg-border" />
            <div className="flex justify-between">
              <span className="font-semibold">GS Total:</span>
              <span className="font-bold text-lg text-primary">{totalGS}</span>
            </div>
          </div>

          {/* Enhancement Info */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• +1 a +3: +1 GS por nível</p>
            <p>• +4 a +12: +3 GS por nível</p>
            <p>• Item Raro: +10 GS</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

