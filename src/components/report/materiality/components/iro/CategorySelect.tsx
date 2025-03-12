
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SelectionItem from './SelectionItem';

interface CategorySelectProps {
  title: string;
  description: string;
  options: string[];
  selections: string[];
  onSelectionChange: (value: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  title,
  description,
  options,
  selections,
  onSelectionChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">
          Selezionati: {selections.length > 0 ? selections.join(', ') : 'Nessuna selezione'}
        </p>
        
        <Select onValueChange={onSelectionChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Seleziona ${title.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option, i) => (
              <SelectItem 
                key={`${title.toLowerCase()}-option-${i}`} 
                value={option}
                className={selections.includes(option) ? "bg-gray-100" : ""}
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selections.length > 0 && (
        <div className="mt-2">
          <ul className="list-disc list-inside space-y-1">
            {selections.map((selected, idx) => (
              <SelectionItem 
                key={idx} 
                item={selected} 
                onRemove={() => onSelectionChange(selected)} 
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
