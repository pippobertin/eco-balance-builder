
import React from 'react';
import CalculatorActions from './CalculatorActions';
import EmissionsResults from '../EmissionsResults';
import { EmissionsResults as EmissionsResultsType } from '@/hooks/emissions-calculator/types';

interface CalculatorControlsProps {
  handleCalculateClick: () => void;
  handleCancelEdit: () => void;
  handleSaveClick: () => void;
  editMode: boolean;
  isSaving: boolean;
  calculatedEmissions: EmissionsResultsType;
}

const CalculatorControls: React.FC<CalculatorControlsProps> = ({
  handleCalculateClick,
  handleCancelEdit,
  handleSaveClick,
  editMode,
  isSaving,
  calculatedEmissions
}) => {
  return (
    <div className="flex justify-between items-center">
      <CalculatorActions 
        handleCalculateClick={handleCalculateClick}
        handleCancelEdit={handleCancelEdit}
        handleSaveClick={handleSaveClick}
        editMode={editMode}
        isSaving={isSaving}
      />
      
      <EmissionsResults calculatedEmissions={calculatedEmissions} />
    </div>
  );
};

export default CalculatorControls;
