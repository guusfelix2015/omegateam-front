import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface WonItemsFiltersProps {
  onFilterChange: (filters: WonItemsFilterValues) => void;
}

export interface WonItemsFilterValues {
  dateFrom?: string;
  dateTo?: string;
  itemCategory?: string;
  itemGrade?: string;
}

const CATEGORIES = [
  { value: 'HELMET', label: 'Capacete' },
  { value: 'ARMOR', label: 'Armadura' },
  { value: 'PANTS', label: 'Calças' },
  { value: 'BOOTS', label: 'Botas' },
  { value: 'GLOVES', label: 'Luvas' },
  { value: 'NECKLACE', label: 'Colar' },
  { value: 'EARRING', label: 'Brinco' },
  { value: 'RING', label: 'Anel' },
  { value: 'SHIELD', label: 'Escudo' },
  { value: 'WEAPON', label: 'Arma' },
  { value: 'COMUM', label: 'Comum' },
];

const GRADES = [
  { value: 'S', label: 'Grade S' },
  { value: 'A', label: 'Grade A' },
  { value: 'B', label: 'Grade B' },
  { value: 'C', label: 'Grade C' },
  { value: 'D', label: 'Grade D' },
];

export function WonItemsFilters({ onFilterChange }: WonItemsFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<WonItemsFilterValues>({});

  const handleFilterChange = (
    key: keyof WonItemsFilterValues,
    value: string
  ) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="grid gap-4 p-4 border rounded-lg bg-gray-50">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Date From */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Data Inicial
              </label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Data Final
              </label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Categoria
              </label>
              <select
                value={filters.itemCategory || ''}
                onChange={(e) =>
                  handleFilterChange('itemCategory', e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Todas</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium mb-2">Grade</label>
              <select
                value={filters.itemGrade || ''}
                onChange={(e) =>
                  handleFilterChange('itemGrade', e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Todas</option>
                {GRADES.map((grade) => (
                  <option key={grade.value} value={grade.value}>
                    {grade.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
