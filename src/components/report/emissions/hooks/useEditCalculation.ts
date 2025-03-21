
import { useState } from 'react';

export const useEditCalculation = () => {
  const [editMode, setEditMode] = useState(false);
  const [editingCalculationId, setEditingCalculationId] = useState<string | null>(null);

  // Handle editing a calculation
  const handleEditCalculation = (calculation: any) => {
    console.log('Editing calculation:', calculation);
    setEditMode(true);
    setEditingCalculationId(calculation.id);
  };

  // Handle canceling edit mode
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingCalculationId(null);
  };

  return {
    editMode,
    editingCalculationId,
    handleEditCalculation,
    handleCancelEdit,
    setEditMode,
    setEditingCalculationId
  };
};
