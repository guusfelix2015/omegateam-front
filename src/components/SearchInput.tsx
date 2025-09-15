import { memo, forwardRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = memo(forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({
    value,
    onChange,
    onSearch,
    placeholder = "Buscar...",
    className = ""
  }, ref) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && onSearch) {
        e.preventDefault();
        onSearch();
      }
    };

    return (
      <div className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={ref}
          placeholder={placeholder}
          className="pl-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    );
  }
));
