
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CategorySelectorProps {
  scope3Category: string;
  setScope3Category: (value: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  scope3Category,
  setScope3Category
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <Label>Categoria</Label>
        <Select 
          value={scope3Category} 
          onValueChange={setScope3Category}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Seleziona categoria" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="transport">Trasporto e Logistica</SelectItem>
            <SelectItem value="waste">Gestione Rifiuti</SelectItem>
            <SelectItem value="purchases">Acquisto di beni e servizi</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CategorySelector;
