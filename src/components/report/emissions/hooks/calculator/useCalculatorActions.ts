
import { useState, useEffect } from 'react';
import { EmissionCalculationLogs, EmissionsInput, EmissionsResults, EmissionCalculationRecord } from '@/hooks/emissions-calculator/types';
import { useEmissionsCalculator } from '@/hooks/emissions-calculator/useEmissionsCalculator';
import { useEmissionRecords } from '@/hooks/emissions-calculator/useEmissionRecords';
import { useToast } from '@/hooks/use-toast';

export const useCalculatorActions = (
  reportId: string | undefined,
  inputs: EmissionsInput,
  updateInput: (key: string, value: any) => void,
  calculationLogs: EmissionCalculationLogs,
  setCalculationLogs: (logs: EmissionCalculationLogs) => void,
  calculatedEmissions: EmissionsResults,
  setCalculatedEmissions: (results: EmissionsResults) => void
) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Initialize the emission records service
  const {
    loadEmissionRecords,
    saveEmissionRecord,
    deleteEmissionRecord,
    calculateTotals,
    createRecord
  } = useEmissionRecords(reportId);
  
  // Initialize the emissions calculator
  const { 
    calculateEmissions: calculateEmissionsWithHook,
    results,
    resetCalculation: resetCalculationWithHook
  } = useEmissionsCalculator(
    inputs,
    (results, details) => {
      console.log('Calculator results updated:', results);
      setCalculatedEmissions(results);
    },
    (logs) => {
      console.log('Calculator logs updated:', logs);
      console.log('Log structure:', {
        scope1: logs.scope1Calculations?.length || 0,
        scope2: logs.scope2Calculations?.length || 0,
        scope3: logs.scope3Calculations?.length || 0
      });
      setCalculationLogs(logs);
    }
  );
  
  // Load existing records on mount
  useEffect(() => {
    if (reportId) {
      loadExistingRecords(reportId);
    }
  }, [reportId]);
  
  // Load existing records from the database
  const loadExistingRecords = async (reportId: string) => {
    try {
      const records = await loadEmissionRecords(reportId);
      
      if (records && records.length > 0) {
        // Group records by scope
        const scope1Records = records.filter(record => record.scope === 'scope1');
        const scope2Records = records.filter(record => record.scope === 'scope2');
        const scope3Records = records.filter(record => record.scope === 'scope3');
        
        // Create calculation logs
        const logs: EmissionCalculationLogs = {
          scope1Calculations: scope1Records,
          scope2Calculations: scope2Records,
          scope3Calculations: scope3Records
        };
        
        // Update logs state
        setCalculationLogs(logs);
        
        // Calculate totals
        const totals = calculateTotals(records);
        setCalculatedEmissions(totals);
        
        console.log('Loaded existing emission records:', {
          records: records.length,
          scope1: scope1Records.length,
          scope2: scope2Records.length,
          scope3: scope3Records.length,
          totals
        });
      }
    } catch (error) {
      console.error('Error loading existing records:', error);
    }
  };
  
  // Call the emissions calculation hook
  const calculateEmissions = (scope: 'scope1' | 'scope2' | 'scope3') => {
    console.log(`Calculating emissions for ${scope} with inputs:`, inputs);
    
    try {
      // Perform the calculation
      const result = calculateEmissionsWithHook(scope);
      console.log(`Calculation result for ${scope}:`, result);
      
      // Create a new record from the calculation
      if (result && result.results && reportId) {
        let description = '';
        let source = '';
        let quantity = 0;
        let unit = '';
        let details = {};
        
        // Set values based on the scope
        switch (scope) {
          case 'scope1':
            description = `Emissioni da ${inputs.fuelType}`;
            source = 'Combustibile';
            quantity = parseFloat(inputs.fuelQuantity || '0');
            unit = inputs.fuelUnit || 'L';
            details = {
              fuelType: inputs.fuelType,
              periodType: inputs.periodType
            };
            break;
          case 'scope2':
            description = `Emissioni da ${inputs.energyType}`;
            source = 'Energia';
            quantity = parseFloat(inputs.energyQuantity || '0');
            unit = 'kWh';
            details = {
              energyType: inputs.energyType,
              energyProvider: inputs.energyProvider,
              renewablePercentage: inputs.renewablePercentage,
              periodType: inputs.periodType
            };
            break;
          case 'scope3':
            if (inputs.scope3Category === 'transport') {
              description = `Emissioni da ${inputs.transportType}`;
              source = 'Trasporto';
              quantity = parseFloat(inputs.transportDistance || '0');
              unit = 'km';
              details = {
                transportType: inputs.transportType,
                vehicleType: inputs.vehicleType,
                vehicleFuelType: inputs.vehicleFuelType,
                vehicleEnergyClass: inputs.vehicleEnergyClass,
                periodType: inputs.periodType
              };
            } else if (inputs.scope3Category === 'waste') {
              description = `Emissioni da ${inputs.wasteType}`;
              source = 'Rifiuti';
              quantity = parseFloat(inputs.wasteQuantity || '0');
              unit = 'kg';
              details = {
                wasteType: inputs.wasteType,
                periodType: inputs.periodType
              };
            } else if (inputs.scope3Category === 'purchase') {
              description = `Emissioni da ${inputs.purchaseDescription || inputs.purchaseType}`;
              source = 'Acquisti';
              quantity = parseFloat(inputs.purchaseQuantity || '0');
              unit = 'EUR';
              details = {
                purchaseType: inputs.purchaseType,
                purchaseDescription: inputs.purchaseDescription,
                periodType: inputs.periodType
              };
            }
            break;
        }
        
        // Get the emission value from the result
        const emissionValue = scope === 'scope1' ? result.results.scope1 :
                             scope === 'scope2' ? result.results.scope2 :
                             result.results.scope3;
        
        // Create the record object
        const newRecord = createRecord(
          scope,
          source,
          description,
          quantity,
          unit,
          emissionValue,
          details
        );
        
        // Save the record to the database
        saveEmissionRecord(newRecord).then(savedRecord => {
          if (savedRecord) {
            // Add the new record to the appropriate scope array
            const updatedLogs = { ...calculationLogs };
            
            if (scope === 'scope1') {
              updatedLogs.scope1Calculations = [...updatedLogs.scope1Calculations, savedRecord];
            } else if (scope === 'scope2') {
              updatedLogs.scope2Calculations = [...updatedLogs.scope2Calculations, savedRecord];
            } else if (scope === 'scope3') {
              updatedLogs.scope3Calculations = [...updatedLogs.scope3Calculations, savedRecord];
            }
            
            // Update the logs state
            setCalculationLogs(updatedLogs);
            
            // Update the calculated emissions
            const allRecords = [
              ...updatedLogs.scope1Calculations,
              ...updatedLogs.scope2Calculations,
              ...updatedLogs.scope3Calculations
            ];
            
            setCalculatedEmissions(calculateTotals(allRecords));
            setLastSaved(new Date());
          }
        });
      }
      
      // Show toast notification
      toast({
        title: "Calcolo completato",
        description: `Il calcolo delle emissioni per ${scope === 'scope1' ? 'Scope 1' : scope === 'scope2' ? 'Scope 2' : 'Scope 3'} è stato completato`
      });
      
      return result;
    } catch (error) {
      console.error('Error calculating emissions:', error);
      
      toast({
        title: "Errore",
        description: `Si è verificato un errore durante il calcolo delle emissioni: ${error}`,
        variant: "destructive"
      });
      
      return null;
    }
  };
  
  // Handle saving the calculation data
  const handleSubmitCalculation = async () => {
    if (!reportId) {
      console.error('Cannot save calculation: report ID is undefined');
      toast({
        title: "Errore",
        description: "Impossibile salvare i dati. ID report non disponibile.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // We don't need to do anything here anymore since calculations are saved individually
      // Just update the lastSaved date
      setLastSaved(new Date());
      
      toast({
        title: "Salvato",
        description: "I dati delle emissioni sono stati salvati con successo"
      });
    } catch (error) {
      console.error('Error submitting calculation:', error);
      
      toast({
        title: "Errore",
        description: `Si è verificato un errore durante il salvataggio: ${error}`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle removing a calculation
  const handleRemoveCalculation = (calculationId: string) => {
    console.log('Removing calculation with ID:', calculationId);
    
    // Find the record and its scope
    let scope = '';
    let scopeKey = '';
    
    if (calculationLogs.scope1Calculations.some(calc => calc.id === calculationId)) {
      scope = 'scope1';
      scopeKey = 'scope1Calculations';
    } else if (calculationLogs.scope2Calculations.some(calc => calc.id === calculationId)) {
      scope = 'scope2';
      scopeKey = 'scope2Calculations';
    } else if (calculationLogs.scope3Calculations.some(calc => calc.id === calculationId)) {
      scope = 'scope3';
      scopeKey = 'scope3Calculations';
    }
    
    if (!scope) {
      console.error('Calculation ID not found:', calculationId);
      return;
    }
    
    // Delete the record from the database
    deleteEmissionRecord(calculationId).then(success => {
      if (success) {
        // Remove the record from the appropriate scope array
        const updatedLogs = { ...calculationLogs };
        updatedLogs[scopeKey as keyof EmissionCalculationLogs] = (
          updatedLogs[scopeKey as keyof EmissionCalculationLogs] as EmissionCalculationRecord[]
        ).filter(calc => calc.id !== calculationId);
        
        // Update the logs state
        setCalculationLogs(updatedLogs);
        
        // Update the calculated emissions
        const allRecords = [
          ...updatedLogs.scope1Calculations,
          ...updatedLogs.scope2Calculations,
          ...updatedLogs.scope3Calculations
        ];
        
        setCalculatedEmissions(calculateTotals(allRecords));
        
        // Show toast notification
        toast({
          title: "Calcolo rimosso",
          description: "Il calcolo selezionato è stato rimosso con successo"
        });
      }
    });
  };
  
  // Reset the calculation
  const resetCalculation = () => {
    console.log('Resetting calculation');
    
    // Call the hook's resetCalculation function
    resetCalculationWithHook();
    
    // Reset inputs
    updateInput('scope1Source', 'fuel');
    updateInput('fuelType', 'DIESEL');
    updateInput('fuelQuantity', '');
    updateInput('fuelUnit', 'L');
    updateInput('energyType', 'ELECTRICITY_IT');
    updateInput('energyQuantity', '');
    updateInput('renewablePercentage', 0);
    updateInput('energyProvider', '');
    updateInput('scope3Category', 'transport');
    updateInput('transportType', 'BUSINESS_TRAVEL_CAR');
    updateInput('transportDistance', '');
    updateInput('wasteType', 'WASTE_LANDFILL');
    updateInput('wasteQuantity', '');
    updateInput('purchaseType', 'PURCHASED_GOODS');
    updateInput('purchaseQuantity', '');
    updateInput('purchaseDescription', '');
    updateInput('periodType', 'ANNUAL');
    
    // Show toast notification
    toast({
      title: "Reset completato",
      description: "Tutti i dati di calcolo sono stati reimpostati"
    });
  };
  
  return {
    calculateEmissions,
    handleRemoveCalculation,
    resetCalculation,
    handleSubmitCalculation,
    isSaving,
    lastSaved
  };
};
