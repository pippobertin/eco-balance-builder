
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
import { esrsThemes } from '../utils/materialityUtils';

interface ESRSThemeFilterProps {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  showPredefinedSelector: boolean;
  togglePredefinedSelector: () => void;
}

const ESRSThemeFilter: React.FC<ESRSThemeFilterProps> = ({
  selectedTheme,
  setSelectedTheme,
  showPredefinedSelector,
  togglePredefinedSelector
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <h4 className="text-sm font-medium text-gray-800">Filtra per tema ESRS</h4>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center" 
          onClick={togglePredefinedSelector}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {showPredefinedSelector ? 'Nascondi temi predefiniti' : 'Aggiungi temi predefiniti'}
        </Button>
      </div>
      
      <Select value={selectedTheme} onValueChange={setSelectedTheme}>
        <SelectTrigger className="w-full md:w-[300px]">
          <SelectValue placeholder="Seleziona un tema ESRS" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">Tutti i temi</SelectItem>
            {esrsThemes.map(theme => (
              <SelectItem key={theme} value={theme}>{theme}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ESRSThemeFilter;
