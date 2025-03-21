
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calculator, Save } from 'lucide-react';
import EmissionsResults from '../EmissionsResults';

interface CalculatorButtonsProps {
  activeTab: string;
  isSaving: boolean;
  editMode: boolean;
  calculatedEmissions: {
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  };
  handleCalculateClick: () => void;
  handleCancelEdit: () => void;
  handleSaveClick: () => void;
}

const CalculatorButtons: React.FC<CalculatorButtonsProps> = ({
  activeTab,
  isSaving,
  editMode,
  calculatedEmissions,
  handleCalculateClick,
  handleCancelEdit,
  handleSaveClick
}) => {
  return (
    <div className="mt-6 flex justify-between items-center">
      <div className="space-x-2">
        <Button onClick={handleCalculateClick} className="flex items-center">
          <Calculator className="mr-2 h-4 w-4" />
          {editMode ? 'Aggiorna Calcolo' : 'Calcola Emissioni'}
        </Button>
        
        {editMode && (
          <Button onClick={handleCancelEdit} variant="outline" className="flex items-center">
            Annulla Modifica
          </Button>
        )}
        
        <Button onClick={handleSaveClick} disabled={isSaving} variant="outline" className="flex items-center text-center my-[10px] bg-emerald-500 hover:bg-emerald-400 text-stone-50">
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Salvando...' : 'Salva Emissioni'}
        </Button>
      </div>
      
      <EmissionsResults calculatedEmissions={calculatedEmissions} />
    </div>
  );
};

export default CalculatorButtons;
