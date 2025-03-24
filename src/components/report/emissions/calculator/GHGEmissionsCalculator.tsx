
import React, { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GHGEmissionsCalculatorProps } from '../types';
import { useCalculator } from '../hooks/useCalculator';
import { useReport } from '@/hooks/use-report-context';
import { useEditCalculation } from './useEditCalculation';
import { EmissionFactorSource } from '@/lib/emissions-types';
import { toast } from 'sonner';

// Import refactored components
import CalculatorHeader from '../CalculatorHeader';
import CalculatorTabContent from './CalculatorTabContent';
import CalculatorButtons from './CalculatorButtons';
import CalculatorSummary from './CalculatorSummary';
import CalculatorLoadingState from './CalculatorLoadingState';
import EditModeAlert from './EditModeAlert';

const GHGEmissionsCalculator: React.FC<GHGEmissionsCalculatorProps> = ({
  formValues,
  setFormValues,
  onResetClick
}) => {
  const { currentReport, setNeedsSaving, setLastSaved } = useReport();
  const reportId = currentReport?.id || formValues?.reportId;
  
  const hasLoggedInitialInfo = React.useRef(false);
  const calculatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasLoggedInitialInfo.current) {
      console.log('GHGEmissionsCalculator: Current reportId:', reportId);
      console.log('GHGEmissionsCalculator: formValues:', formValues);
      hasLoggedInitialInfo.current = true;
    }
  }, [reportId, formValues]);
  
  const {
    activeTab,
    setActiveTab,
    calculatedEmissions,
    inputs,
    updateInput,
    calculateEmissions,
    calculationLogs,
    handleRemoveCalculation,
    handleSubmitCalculation,
    updateCalculation,
    isSaving,
    isLoadingExisting
  } = useCalculator(
    { ...formValues, reportId },
    setFormValues, 
    onResetClick
  );

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
    
    if (newCounts.scope1 !== calculationLogCountRef.current.scope1 ||
        newCounts.scope2 !== calculationLogCountRef.current.scope2 ||
        newCounts.scope3 !== calculationLogCountRef.current.scope3) {
        
      console.log("GHGEmissionsCalculator: Current calculation logs:", calculationLogs);
      console.log("Scope1 calculations:", calculationLogs.scope1Calculations?.length || 0);
      console.log("Scope2 calculations:", calculationLogs.scope2Calculations?.length || 0);
      console.log("Scope3 calculations:", calculationLogs.scope3Calculations?.length || 0);
      
      calculationLogCountRef.current = newCounts;
    }
  }, [calculationLogs]);

  // Use the edit calculation hook
  const {
    editMode,
    editingCalculationId,
    handleEditCalculation,
    handleCancelEdit,
    setEditMode,
    setEditingCalculationId
  } = useEditCalculation({ updateInput, setActiveTab });

  // Custom handler for editing calculations that also scrolls to top
  const handleEditWithScroll = (calculation: any) => {
    handleEditCalculation(calculation);
    
    // Scroll to the top of the calculator component with smooth animation
    setTimeout(() => {
      if (calculatorRef.current) {
        calculatorRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }
    }, 100); // Small delay to ensure state updates first
  };

  const handleCalculateClick = async () => {
    console.log('Calculate button clicked for tab:', activeTab);
    console.log('Using reportId for calculation:', reportId);
    
    if (editMode && editingCalculationId) {
      const scope = activeTab as 'scope1' | 'scope2' | 'scope3';
      await updateCalculation(editingCalculationId, scope);
      
      handleCancelEdit();
    } else {
      await calculateEmissions(activeTab as 'scope1' | 'scope2' | 'scope3');
    }
  };

  const handleSaveClick = async () => {
    console.log('Save button clicked with reportId:', reportId);
    try {
      await handleSubmitCalculation();
      setNeedsSaving(false);
      setLastSaved(new Date());
      toast.success("Emissioni salvate con successo");
    } catch (error) {
      console.error("Errore nel salvataggio delle emissioni:", error);
      toast.error("Errore nel salvataggio delle emissioni");
    }
  };

  if (isLoadingExisting) {
    return <CalculatorLoadingState isLoading={true} />;
  }

  return (
    <div ref={calculatorRef} className="border rounded-md p-4 bg-white/80">
      <CalculatorHeader 
        calculationMethod={typeof inputs.calculationMethod === 'string' ? inputs.calculationMethod as EmissionFactorSource : EmissionFactorSource.DEFRA} 
        setCalculationMethod={value => updateInput('calculationMethod', value)} 
      />
      
      <EditModeAlert editMode={editMode} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="scope1">Scope 1 - Emissioni Dirette</TabsTrigger>
          <TabsTrigger value="scope2">Scope 2 - Energia</TabsTrigger>
          <TabsTrigger value="scope3">Scope 3 - Altre Emissioni</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          <CalculatorTabContent 
            activeTab={activeTab}
            inputs={inputs}
            updateInput={updateInput}
          />
        </TabsContent>
      </Tabs>
      
      <CalculatorButtons 
        activeTab={activeTab}
        isSaving={isSaving}
        editMode={editMode}
        calculatedEmissions={calculatedEmissions}
        handleCalculateClick={handleCalculateClick}
        handleCancelEdit={handleCancelEdit}
        handleSaveClick={handleSaveClick}
      />
      
      <CalculatorSummary 
        calculationLogs={calculationLogs}
        handleRemoveCalculation={handleRemoveCalculation}
        handleEditCalculation={handleEditWithScroll}
      />
    </div>
  );
};

export default GHGEmissionsCalculator;
