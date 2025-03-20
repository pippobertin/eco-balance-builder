
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';
import { useReport } from '@/hooks/use-report-context';

interface StakeholderFormActionsProps {
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  onSubmit?: () => void; // Add onSubmit prop to support both naming conventions
  isNew?: boolean;
  disabled?: boolean;
  isValid?: boolean; // Added this prop to match usage in AddStakeholderForm
}

const StakeholderFormActions: React.FC<StakeholderFormActionsProps> = ({
  onSave,
  onCancel,
  onDelete,
  onSubmit, // Add this to destructuring
  isNew = true,
  disabled = false,
  isValid = true // Default to true to maintain backward compatibility
}) => {
  const { needsSaving, lastSaved } = useReport();
  
  // Use onSubmit if provided, otherwise fall back to onSave
  const handleSaveClick = () => {
    if (onSubmit) {
      onSubmit();
    } else {
      onSave();
    }
  };
  
  return (
    <div className="flex items-center justify-between gap-4 mt-6">
      <div>
        {!isNew && onDelete && (
          <Button variant="destructive" onClick={onDelete} type="button">
            <Trash2 className="mr-2 h-4 w-4" />
            Elimina
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <AutoSaveIndicator 
          needsSaving={needsSaving}
          lastSaved={lastSaved}
        />
        
        <Button variant="outline" onClick={onCancel} type="button">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Annulla
        </Button>
        
        <Button onClick={handleSaveClick} disabled={disabled || !isValid} type="button">
          <Save className="mr-2 h-4 w-4" />
          Salva
        </Button>
      </div>
    </div>
  );
};

export default StakeholderFormActions;
