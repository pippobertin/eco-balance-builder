
import { useState } from 'react';
import { EmissionCalculationRecord } from '@/hooks/emissions-calculator/types';

export const useEditCalculation = () => {
  const [editMode, setEditMode] = useState(false);
  const [editingCalculationId, setEditingCalculationId] = useState<string | null>(null);
  const [editingCalculation, setEditingCalculation] = useState<EmissionCalculationRecord | null>(null);

  // Handle editing a calculation
  const handleEditCalculation = (calculation: EmissionCalculationRecord) => {
    console.log('Editing calculation:', calculation);
    setEditMode(true);
    setEditingCalculationId(calculation.id);
    setEditingCalculation(calculation);
  };

  // Handle canceling edit mode
  const handleCancelEdit = () => {
    console.log('Canceling edit mode');
    setEditMode(false);
    setEditingCalculationId(null);
    setEditingCalculation(null);
  };

  return {
    editMode,
    editingCalculationId,
    editingCalculation,
    handleEditCalculation,
    handleCancelEdit,
    setEditMode,
    setEditingCalculationId,
    setEditingCalculation
  };
};
