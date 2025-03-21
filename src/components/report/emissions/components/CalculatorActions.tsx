
import React from 'react';
import { Button } from '@/components/ui/button';
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
    <div className="mt-6 flex justify-between items-center">
      <div className="flex space-x-3">
        <Button 
          onClick={handleCalculateClick} 
          className="h-10 w-48 flex items-center justify-center"
        >
          <Calculator className="mr-2 h-4 w-4" />
          {editMode ? 'Aggiorna Calcolo' : 'Calcola Emissioni'}
        </Button>
        
        {editMode && (
          <Button 
            onClick={handleCancelEdit} 
            variant="outline" 
            className="h-10 w-48 flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800 border-gray-300"
          >
            <Trash2 className="mr-2 h-4 w-4 text-gray-600" />
            Annulla Modifica
          </Button>
        )}
        
        <Button 
          onClick={handleSaveClick} 
          disabled={isSaving} 
          variant="outline" 
          className="h-10 w-48 flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-stone-50"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Salvando...' : 'Salva Emissioni'}
        </Button>
      </div>
    </div>
  );
};

export default CalculatorActions;
