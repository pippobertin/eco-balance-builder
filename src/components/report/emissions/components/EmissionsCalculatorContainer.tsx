
import React, { useEffect } from 'react';
import { useReport } from '@/hooks/use-report-context';
import { GHGEmissionsCalculatorProps } from '../types';
import { useCalculator } from '../hooks/useCalculator';
import { useEditCalculation } from '../hooks/useEditCalculation';
import LoadingState from './LoadingState';
import CalculatorHeader from '../CalculatorHeader';
import EditModeNotice from './EditModeNotice';
import CalculatorTabs from './CalculatorTabs';
import CalculatorControls from './CalculatorControls';
import CalculationsOverview from './CalculationsOverview';

const EmissionsCalculatorContainer: React.FC<GHGEmissionsCalculatorProps> = ({
  formValues,
  setFormValues,
  onResetClick
}) => {
  const { currentReport } = useReport();
  const reportId = currentReport?.id || formValues?.reportId;
  
  // Use a ref to track if we've already logged initial information
  const hasLoggedInitialInfo = React.useRef(false);

  // State and handlers for edit mode
  const {
    editMode,
    editingCalculationId,
    editingCalculation,
    handleEditCalculation,
    handleCancelEdit,
    setEditMode,
    setEditingCalculationId
  } = useEditCalculation();
  
  useEffect(() => {
    // Only log this information once when the component mounts, not on every render
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

  // Only log calculation logs when they actually change, not on every render
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

  // When entering edit mode, load the calculation data into the inputs
  useEffect(() => {
    if (editMode && editingCalculation) {
      console.log('Loading calculation data for editing:', editingCalculation);
      
      try {
        // Set the active tab based on the calculation scope
        setActiveTab(editingCalculation.scope);
        
        // Clear form data first before setting new values to avoid mixing
        if (editingCalculation.scope === 'scope1') {
          updateInput('fuelQuantity', '');
        } else if (editingCalculation.scope === 'scope2') {
          updateInput('energyQuantity', '');
        } else if (editingCalculation.scope === 'scope3') {
          updateInput('transportDistance', '');
          updateInput('wasteQuantity', '');
          updateInput('purchaseQuantity', '');
        }
        
        // Add a small delay before setting values to ensure form is reset
        setTimeout(() => {
          // Set common inputs
          if (editingCalculation.details?.periodType) {
            updateInput('periodType', editingCalculation.details.periodType);
          }
          
          // Set scope-specific inputs
          if (editingCalculation.scope === 'scope1') {
            const details = editingCalculation.details;
            if (details) {
              updateInput('scope1Source', details.scope1Source || 'fuel');
              updateInput('fuelType', details.fuelType || 'DIESEL');
              
              // For numerical inputs, use a short timeout to avoid race conditions
              setTimeout(() => {
                if (details.quantity !== undefined) {
                  updateInput('fuelQuantity', String(details.quantity));
                }
                updateInput('fuelUnit', details.unit || 'L');
              }, 50);
            }
          } else if (editingCalculation.scope === 'scope2') {
            const details = editingCalculation.details;
            if (details) {
              updateInput('energyType', details.energyType || 'ELECTRICITY_IT');
              
              // For numerical inputs, use a short timeout to avoid race conditions
              setTimeout(() => {
                if (details.quantity !== undefined) {
                  updateInput('energyQuantity', String(details.quantity));
                }
                if (details.renewablePercentage !== undefined) {
                  updateInput('renewablePercentage', details.renewablePercentage);
                }
                updateInput('energyProvider', details.energyProvider || '');
              }, 50);
            }
          } else if (editingCalculation.scope === 'scope3') {
            const details = editingCalculation.details;
            if (details) {
              updateInput('scope3Category', details.scope3Category || 'transport');
              
              // For numerical inputs, use a short timeout to avoid race conditions
              setTimeout(() => {
                if (details.scope3Category === 'transport') {
                  updateInput('transportType', details.transportType || 'BUSINESS_TRAVEL_CAR');
                  
                  if (details.quantity !== undefined) {
                    updateInput('transportDistance', String(details.quantity));
                  }
                  
                  // Vehicle details if available
                  if (details.vehicleType) {
                    updateInput('vehicleType', details.vehicleType);
                    updateInput('vehicleFuelType', details.vehicleFuelType || 'DIESEL');
                    updateInput('vehicleEnergyClass', details.vehicleEnergyClass || 'euro6');
                    if (details.vehicleFuelConsumption) {
                      updateInput('vehicleFuelConsumption', String(details.vehicleFuelConsumption));
                    }
                    updateInput('vehicleFuelConsumptionUnit', details.vehicleFuelConsumptionUnit || 'l_100km');
                  }
                } else if (details.scope3Category === 'waste') {
                  updateInput('wasteType', details.wasteType || 'WASTE_LANDFILL');
                  
                  if (details.quantity !== undefined) {
                    updateInput('wasteQuantity', String(details.quantity));
                  }
                } else if (details.scope3Category === 'purchases') {
                  updateInput('purchaseType', details.purchaseType || 'PURCHASED_GOODS');
                  
                  if (details.quantity !== undefined) {
                    updateInput('purchaseQuantity', String(details.quantity));
                  }
                  updateInput('purchaseDescription', details.purchaseDescription || '');
                }
              }, 50);
            }
          }
          
          console.log('Filled input fields successfully for editing');
        }, 100);
      } catch (error) {
        console.error('Error loading calculation data:', error);
      }
    }
  }, [editMode, editingCalculation, updateInput, setActiveTab]);

  const handleCalculateClick = async () => {
    console.log('Calculate button clicked for tab:', activeTab);
    console.log('Using reportId for calculation:', reportId);
    
    if (editMode && editingCalculationId) {
      // Update existing calculation
      const scope = activeTab as 'scope1' | 'scope2' | 'scope3';
      await updateCalculation(editingCalculationId, scope);
      
      // Reset edit mode
      setEditMode(false);
      setEditingCalculationId(null);
    } else {
      // Create new calculation
      await calculateEmissions(activeTab as 'scope1' | 'scope2' | 'scope3');
    }
  };

  const handleSaveClick = () => {
    console.log('Save button clicked with reportId:', reportId);
    handleSubmitCalculation();
  };

  if (isLoadingExisting) {
    return <LoadingState />;
  }

  return (
    <div className="border rounded-md p-4 bg-white/80">
      <CalculatorHeader 
        calculationMethod={
          typeof inputs.calculationMethod === 'string' 
            ? inputs.calculationMethod 
            : 'DEFRA'
        } 
        setCalculationMethod={value => updateInput('calculationMethod', value)} 
      />
      
      {editMode && <EditModeNotice />}
      
      <CalculatorTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        inputs={inputs}
        updateInput={updateInput}
      />
      
      <CalculatorControls
        handleCalculateClick={handleCalculateClick}
        handleCancelEdit={handleCancelEdit}
        handleSaveClick={handleSaveClick}
        editMode={editMode}
        isSaving={isSaving}
        calculatedEmissions={calculatedEmissions}
      />
      
      <CalculationsOverview 
        calculationLogs={calculationLogs}
        handleRemoveCalculation={handleRemoveCalculation}
        handleEditCalculation={handleEditCalculation}
      />
    </div>
  );
};

export default EmissionsCalculatorContainer;
