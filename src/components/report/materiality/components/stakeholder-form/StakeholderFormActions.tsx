
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';
import { useReport } from '@/hooks/use-report-context';

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
  // Get needsSaving and lastSaved from the report context
  const { needsSaving, lastSaved } = useReport();
  
  return (
    <div className="flex justify-between items-center space-x-4">
      <AutoSaveIndicator 
        needsSaving={needsSaving} 
        lastSaved={lastSaved} 
      />
      
      <div className="flex space-x-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Annulla
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={!isValid}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Aggiungi stakeholder
        </Button>
      </div>
    </div>
  );
};

export default StakeholderFormActions;
