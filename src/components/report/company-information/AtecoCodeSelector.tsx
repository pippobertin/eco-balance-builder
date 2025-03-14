
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter, Search, X } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { atecoCategories, atecoCodes, getAtecoCodesByCategory, searchAtecoCodes } from './atecoCodesData';

interface AtecoCodeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const AtecoCodeSelector: React.FC<AtecoCodeSelectorProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filteredCodes, setFilteredCodes] = useState(atecoCodes);
  
  // Find the selected ATECO code's full description
  const selectedCode = atecoCodes.find(code => code.code === value);
  const displayValue = selectedCode 
    ? `${selectedCode.code} - ${selectedCode.description}` 
    : value || "Seleziona codice ATECO";

  // Apply filtering when search query or category changes
  useEffect(() => {
    if (searchQuery) {
      // Search has priority over category filter
      setFilteredCodes(searchAtecoCodes(searchQuery));
    } else if (selectedCategory) {
      // If no search query but category is selected
      setFilteredCodes(getAtecoCodesByCategory(selectedCategory));
    } else {
      // No filters applied, show a limited set
      setFilteredCodes([]);
    }
  }, [searchQuery, selectedCategory]);

  const handleSelectCode = (code: string) => {
    onChange(code);
    setOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onChange('');
    setSelectedCategory('');
    setSearchQuery('');
  };

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            aria-expanded={open}
            className="w-full justify-between overflow-hidden text-ellipsis whitespace-nowrap"
          >
            <span className="truncate mr-2">{displayValue}</span>
            {value && (
              <X 
                className="h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-4 w-4 opacity-50" />
              <Input
                placeholder="Cerca per codice o descrizione..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 border-none shadow-none focus-visible:ring-0"
              />
              {searchQuery && (
                <X 
                  className="h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer" 
                  onClick={() => setSearchQuery('')}
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 opacity-50" />
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-8 w-full">
                  <SelectValue placeholder="Filtra per categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tutte le categorie</SelectItem>
                  {atecoCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto p-1">
            {filteredCodes.length > 0 ? (
              filteredCodes.map((code) => (
                <Button
                  key={code.code}
                  variant="ghost"
                  className={`w-full justify-start text-left px-2 py-1.5 ${value === code.code ? 'bg-accent' : ''}`}
                  onClick={() => handleSelectCode(code.code)}
                >
                  <span className="font-medium">{code.code}</span>
                  <span className="ml-2 text-sm text-muted-foreground truncate">
                    {code.description}
                  </span>
                </Button>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {searchQuery || selectedCategory 
                  ? "Nessun codice trovato. Prova a modificare i filtri."
                  : "Seleziona una categoria o cerca un codice per iniziare."}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AtecoCodeSelector;
