
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';
import { useReport } from '@/hooks/use-report-context';

interface StakeholderFormActionsProps {
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  isNew?: boolean;
  disabled?: boolean;
}

const StakeholderFormActions: React.FC<StakeholderFormActionsProps> = ({
  onSave,
  onCancel,
  onDelete,
  isNew = true,
  disabled = false
}) => {
  const { needsSaving, lastSaved } = useReport();
  
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
        
        <Button onClick={onSave} disabled={disabled} type="button">
          <Save className="mr-2 h-4 w-4" />
          Salva
        </Button>
      </div>
    </div>
  );
};

export default StakeholderFormActions;
