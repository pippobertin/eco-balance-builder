
import { useState, useEffect } from 'react';
import { EmissionCalculationRecord } from '@/hooks/emissions-calculator/types';

export const useEditCalculation = () => {
  const [editMode, setEditMode] = useState(false);
  const [editingCalculationId, setEditingCalculationId] = useState<string | null>(null);
  const [editingCalculation, setEditingCalculation] = useState<EmissionCalculationRecord | null>(null);
  
  // Reset editing states when exiting edit mode
  useEffect(() => {
    if (!editMode) {
      setEditingCalculationId(null);
      setEditingCalculation(null);
    }
  }, [editMode]);

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
