
import React, { useEffect } from 'react';
import { useCalculator } from './emissions/hooks/useCalculator';
import { useReport } from '@/hooks/use-report-context';
import { GHGEmissionsCalculatorProps } from './emissions/types';
import { useEditCalculation } from './emissions/hooks/useEditCalculation';

// Import refactored components
import CalculatorHeader from './emissions/CalculatorHeader';
import EditModeNotice from './emissions/EditModeNotice';
import CalculationTabsContent from './emissions/CalculationTabsContent';
import CalculatorActions from './emissions/CalculatorActions';
import CalculationsOverview from './emissions/CalculationsOverview';
import LoadingState from './emissions/LoadingState';

const GHGEmissionsCalculator: React.FC<GHGEmissionsCalculatorProps> = ({
  formValues,
  setFormValues,
  onResetClick
}) => {
  const { currentReport } = useReport();
  const reportId = currentReport?.id || formValues?.reportId;

  // Use a ref to track if we've already logged initial information
  const hasLoggedInitialInfo = React.useRef(false);

  // Initialize calculator state and actions
  const {
    activeTab,
    setActiveTab,
    calculatedEmissions,
    inputs,
    updateInput,
    calculationLogs,
    handleRemoveCalculation,
    handleSubmitCalculation,
    calculateEmissions,
    updateCalculation,
    isSaving,
    isLoadingExisting
  } = useCalculator({
    ...formValues,
    reportId
  }, setFormValues, onResetClick);

  // Initialize edit calculation state and actions
  const {
    editMode,
    editingCalculationId,
    handleEditCalculation,
    handleCancelEdit
  } = useEditCalculation(updateInput, setActiveTab);

  // Log initial information
  useEffect(() => {
    if (!hasLoggedInitialInfo.current) {
      console.log('GHGEmissionsCalculator: Current reportId:', reportId);
      console.log('GHGEmissionsCalculator: formValues:', formValues);
      hasLoggedInitialInfo.current = true;
    }
  }, [reportId, formValues]);

  // Only log calculation logs when they actually change
  const calculationLogCountRef = React.useRef({
    scope1: 0,
    scope2: 0,
    scope3: 0
  });
  
  useEffect(() => {
    const newCounts = {
      scope1: calculationLogs.scope1Calculations?.length || 0,
      scope2: calculationLogs.scope2Calculations?.length || 0,
      scope3: calculationLogs.scope3Calculations?.length || 0
    };

    // Only log if the counts have changed
    if (newCounts.scope1 !== calculationLogCountRef.current.scope1 || 
        newCounts.scope2 !== calculationLogCountRef.current.scope2 || 
        newCounts.scope3 !== calculationLogCountRef.current.scope3) {
      console.log("GHGEmissionsCalculator: Current calculation logs:", calculationLogs);
      console.log("Scope1 calculations:", calculationLogs.scope1Calculations?.length || 0);
      console.log("Scope2 calculations:", calculationLogs.scope2Calculations?.length || 0);
      console.log("Scope3 calculations:", calculationLogs.scope3Calculations?.length || 0);

      // Update the ref with new counts
      calculationLogCountRef.current = newCounts;
    }
  }, [calculationLogs]);

  // Handle calculate button click
  const handleCalculateClick = async () => {
    console.log('Calculate button clicked for tab:', activeTab);
    console.log('Using reportId for calculation:', reportId);
    
    if (editMode && editingCalculationId) {
      // Update existing calculation
      const scope = activeTab as 'scope1' | 'scope2' | 'scope3';
      await updateCalculation(editingCalculationId, scope);

      // Reset edit mode
      handleCancelEdit();
    } else {
      // Create new calculation
      await calculateEmissions(activeTab as 'scope1' | 'scope2' | 'scope3');
    }
  };

  // Handle save button click
  const handleSaveClick = () => {
    console.log('Save button clicked with reportId:', reportId);
    handleSubmitCalculation();
  };

  // Show loading state while data is being loaded
  if (isLoadingExisting) {
    return <LoadingState />;
  }

  return (
    <div className="border rounded-md p-4 bg-white/80">
      <CalculatorHeader 
        calculationMethod={typeof inputs.calculationMethod === 'string' ? inputs.calculationMethod : 'DEFRA'} 
        setCalculationMethod={value => updateInput('calculationMethod', value)} 
      />
      
      <EditModeNotice editMode={editMode} />
      
      <CalculationTabsContent 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        inputs={inputs}
        updateInput={updateInput}
      />
      
      <CalculatorActions 
        handleCalculateClick={handleCalculateClick}
        handleSaveClick={handleSaveClick}
        handleCancelEdit={handleCancelEdit}
        editMode={editMode}
        isSaving={isSaving}
        calculatedEmissions={calculatedEmissions}
      />
      
      <CalculationsOverview 
        calculationLogs={calculationLogs}
        handleRemoveCalculation={handleRemoveCalculation}
        onEditCalculation={handleEditCalculation}
      />
    </div>
  );
};

export default GHGEmissionsCalculator;
