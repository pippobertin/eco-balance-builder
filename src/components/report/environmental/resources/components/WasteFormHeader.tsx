
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface WasteFormHeaderProps {
  isEditing: boolean;
  wasteType: 'hazardous' | 'non-hazardous';
  onCancel: () => void;
}

const WasteFormHeader: React.FC<WasteFormHeaderProps> = ({
  isEditing,
  wasteType,
  onCancel
}) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-medium">
        {isEditing ? 'Modifica' : 'Nuovo'} rifiuto {wasteType === 'hazardous' ? 'pericoloso' : 'non pericoloso'}
      </h4>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={onCancel}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default WasteFormHeader;
