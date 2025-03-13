
import React from 'react';
import { Filter, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { esrsThemes } from '../utils/esgCategoryUtils';
import { translateESGCategory } from '../utils/esgCategoryUtils';

interface ESRSThemeFilterProps {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const ESRSThemeFilter: React.FC<ESRSThemeFilterProps> = ({
  selectedCategories,
  setSelectedCategories
}) => {
  // Ottieni tutte le categorie ESG disponibili
  const esgCategories = ['environmental', 'social', 'governance'];
  
  // Handle selection change
  const handleSelectionChange = (value: string) => {
    if (value === 'all') {
      setSelectedCategories([]);
    } else {
      // If value is already selected, remove it, otherwise add it
      if (selectedCategories.includes(value)) {
        setSelectedCategories(selectedCategories.filter(category => category !== value));
      } else {
        setSelectedCategories([...selectedCategories, value]);
      }
    }
  };

  // Get display text for the trigger
  const getDisplayText = () => {
    if (selectedCategories.length === 0) {
      return "Tutti i temi";
    } else if (selectedCategories.length === 1) {
      return translateESGCategory(selectedCategories[0]);
    } else {
      return `${selectedCategories.length} categorie selezionate`;
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <Filter className="h-4 w-4 text-gray-600 mr-2" />
        <h4 className="text-sm font-medium text-gray-800">Filtra per categoria ESG</h4>
      </div>
      
      <Select value={selectedCategories.length === 0 ? "all" : selectedCategories[0]} onValueChange={handleSelectionChange}>
        <SelectTrigger className="w-full md:w-[300px]">
          <SelectValue placeholder={getDisplayText()} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">Tutti i temi</SelectItem>
            {esgCategories.map(category => (
              <SelectItem key={category} value={category}>
                {translateESGCategory(category)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ESRSThemeFilter;
