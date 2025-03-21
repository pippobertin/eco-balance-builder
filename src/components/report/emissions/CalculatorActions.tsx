
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calculator, Save } from 'lucide-react';
import EmissionsResults from './EmissionsResults';

interface CalculatorActionsProps {
  handleCalculateClick: () => void;
  handleSaveClick: () => void;
  handleCancelEdit: () => void;
  editMode: boolean;
  isSaving: boolean;
  calculatedEmissions: {
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  };
}

const CalculatorActions: React.FC<CalculatorActionsProps> = ({
  handleCalculateClick,
  handleSaveClick,
  handleCancelEdit,
  editMode,
  isSaving,
  calculatedEmissions
}) => {
  return (
    <div className="mt-6 flex justify-between items-center">
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={handleCalculateClick} 
          className="flex items-center justify-center w-[200px] h-12"
        >
          <Calculator className="mr-2 h-4 w-4" />
          {editMode ? 'Aggiorna Calcolo' : 'Calcola Emissioni'}
        </Button>
        
        {editMode && (
          <Button 
            onClick={handleCancelEdit} 
            variant="outline" 
            className="flex items-center justify-center w-[200px] h-12 text-yellow-100 bg-red-600 hover:bg-red-500"
          >
            Annulla Modifica
          </Button>
        )}
        
        <Button 
          onClick={handleSaveClick} 
          disabled={isSaving} 
          variant="outline" 
          className="flex items-center justify-center w-[200px] h-12 bg-emerald-500 hover:bg-emerald-400 text-stone-50"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Salvando...' : 'Salva Emissioni'}
        </Button>
      </div>
      
      <EmissionsResults calculatedEmissions={calculatedEmissions} />
    </div>
  );
};

export default CalculatorActions;
