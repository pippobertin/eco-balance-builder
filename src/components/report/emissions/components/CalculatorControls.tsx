
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calculator, Save, Trash2 } from 'lucide-react';
import { EmissionsResults } from '../EmissionsResults';

type CalculatorControlsProps = {
  handleCalculateClick: () => Promise<void>;
  handleCancelEdit: () => void;
  handleSaveClick: () => void;
  editMode: boolean;
  isSaving: boolean;
  calculatedEmissions: any;
};

const CalculatorControls: React.FC<CalculatorControlsProps> = ({
  handleCalculateClick,
  handleCancelEdit,
  handleSaveClick,
  editMode,
  isSaving,
  calculatedEmissions
}) => {
  return (
    <div className="mt-6 flex justify-between items-center">
      <div className="flex space-x-3">
        <Button 
          onClick={handleCalculateClick} 
          className="h-10 px-4 flex items-center justify-center w-40"
        >
          <Calculator className="mr-2 h-4 w-4" />
          {editMode ? 'Aggiorna Calcolo' : 'Calcola Emissioni'}
        </Button>
        
        {editMode && (
          <Button 
            onClick={handleCancelEdit} 
            variant="outline" 
            className="h-10 px-4 flex items-center justify-center w-40 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Annulla Modifica
          </Button>
        )}
        
        <Button 
          onClick={handleSaveClick} 
          disabled={isSaving} 
          variant="outline" 
          className="h-10 px-4 flex items-center justify-center w-40 bg-emerald-500 hover:bg-emerald-400 text-stone-50"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Salvando...' : 'Salva Emissioni'}
        </Button>
      </div>
      
      <EmissionsResults calculatedEmissions={calculatedEmissions} />
    </div>
  );
};

export default CalculatorControls;
