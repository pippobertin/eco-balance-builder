
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';

interface StakeholderFormActionsProps {
  isValid: boolean;
  onCancel?: () => void;
  onSubmit: () => void;
}

const StakeholderFormActions: React.FC<StakeholderFormActionsProps> = ({
  isValid,
  onCancel,
  onSubmit
}) => {
  return (
    <div className="flex justify-between space-x-4">
      <Button 
        variant="outline" 
        onClick={onCancel}
        className="flex-1"
      >
        Annulla
      </Button>
      <Button 
        onClick={onSubmit}
        className="flex-1"
        disabled={!isValid}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Aggiungi stakeholder
      </Button>
    </div>
  );
};

export default StakeholderFormActions;
