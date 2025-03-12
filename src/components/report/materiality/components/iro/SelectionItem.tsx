
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SelectionItemProps {
  item: string;
  onRemove: (item: string) => void;
}

const SelectionItem: React.FC<SelectionItemProps> = ({ item, onRemove }) => {
  return (
    <li className="flex items-center text-sm">
      <span>{item}</span>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        className="ml-2 h-6 w-6 p-0" 
        onClick={() => onRemove(item)}
      >
        <X className="h-3 w-3" />
      </Button>
    </li>
  );
};

export default SelectionItem;
