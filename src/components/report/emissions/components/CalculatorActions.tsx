
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calculator, Save, Trash2 } from 'lucide-react';

interface CalculatorActionsProps {
  handleCalculateClick: () => void;
  handleCancelEdit: () => void;
  handleSaveClick: () => void;
  editMode: boolean;
  isSaving: boolean;
}

const CalculatorActions: React.FC<CalculatorActionsProps> = ({
  handleCalculateClick,
  handleCancelEdit,
  handleSaveClick,
  editMode,
  isSaving
}) => {
  return (
    <div className="flex gap-3 items-center">
      <Button 
        onClick={handleCalculateClick} 
        className="min-w-[140px] h-10"
        disabled={isSaving}
      >
        <Calculator className="mr-2 h-4 w-4" />
        {editMode ? 'Aggiorna Calcolo' : 'Calcola Emissioni'}
      </Button>
      
      {editMode && (
        <Button 
          onClick={handleCancelEdit} 
          variant="secondary" 
          className="min-w-[140px] h-10 bg-gray-200 hover:bg-gray-300"
          disabled={isSaving}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Annulla Modifica
        </Button>
      )}
      
      <Button 
        onClick={handleSaveClick} 
        variant="outline" 
        className="min-w-[140px] h-10"
        disabled={isSaving}
      >
        <Save className="mr-2 h-4 w-4" />
        {isSaving ? 'Salvataggio...' : 'Salva Report'}
      </Button>
    </div>
  );
};

export default CalculatorActions;
