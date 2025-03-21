
import { useEmissionCalculation } from './actions/useEmissionCalculation';
import { useEmissionRecordManager } from './actions/useEmissionRecordManager';
import { useEmissionReset } from './actions/useEmissionReset';
import { useEmissionSubmit } from './actions/useEmissionSubmit';
import { EmissionsInput, EmissionCalculationLogs, EmissionsResults } from '@/hooks/emissions-calculator/types';

export const useCalculatorActions = (
  reportId: string | undefined,
  inputs: EmissionsInput,
  updateInput: (name: string, value: any) => void,
  calculationLogs: EmissionCalculationLogs,
  setCalculationLogs: React.Dispatch<React.SetStateAction<EmissionCalculationLogs>>,
  calculatedEmissions: EmissionsResults,
  setCalculatedEmissions: React.Dispatch<React.SetStateAction<EmissionsResults>>
) => {
  // Use the emission record manager
  const {
    createNewCalculation,
    removeCalculation,
    updateCalculation,
    isCreating,
    isDeleting,
    isUpdating
  } = useEmissionRecordManager();

  // Use the emission calculation
  const { calculateEmissions: performCalculation, isCalculating } = useEmissionCalculation(
    reportId,
    inputs,
    calculationLogs,
    setCalculationLogs,
    calculatedEmissions,
    setCalculatedEmissions
  );

  // Use the emission reset
  const { resetCalculation } = useEmissionReset(
    setCalculatedEmissions,
    setCalculationLogs
  );

  // Use the emission submit
  const { handleSubmitCalculation, isSaving } = useEmissionSubmit(
    reportId,
    setCalculationLogs,
    setCalculatedEmissions
  );

  // Function to handle calculation based on scope
  const calculateEmissions = async (scope: 'scope1' | 'scope2' | 'scope3') => {
    console.log(`Calculating emissions for ${scope}`);
    
    try {
      // Prepare source, description, quantity, and unit based on scope
      let source = '';
      let description = '';
      let quantity = '';
      let unit = '';
      let details: any = {};
      
      if (scope === 'scope1') {
        source = inputs.scope1Source || 'fuel';
        description = `${inputs.fuelType || 'DIESEL'} consumption`;
        quantity = inputs.fuelQuantity || '0';
        unit = inputs.fuelUnit || 'L';
        details = {
          periodType: inputs.periodType || 'ANNUAL',
          scope1Source: inputs.scope1Source || 'fuel',
          fuelType: inputs.fuelType || 'DIESEL',
          quantity: Number(inputs.fuelQuantity || 0),
          unit: inputs.fuelUnit || 'L'
        };
      } else if (scope === 'scope2') {
        source = 'electricity';
        description = `${inputs.energyType || 'ELECTRICITY_IT'} consumption`;
        quantity = inputs.energyQuantity || '0';
        unit = 'kWh';
        details = {
          periodType: inputs.periodType || 'ANNUAL',
          energyType: inputs.energyType || 'ELECTRICITY_IT',
          quantity: Number(inputs.energyQuantity || 0),
          renewablePercentage: Number(inputs.renewablePercentage || 0),
          energyProvider: inputs.energyProvider || ''
        };
      } else if (scope === 'scope3') {
        const category = inputs.scope3Category || 'transport';
        
        if (category === 'transport') {
          source = 'transport';
          description = `${inputs.transportType || 'BUSINESS_TRAVEL_CAR'} travel`;
          quantity = inputs.transportDistance || '0';
          unit = 'km';
          details = {
            periodType: inputs.periodType || 'ANNUAL',
            scope3Category: 'transport',
            transportType: inputs.transportType || 'BUSINESS_TRAVEL_CAR',
            transportDistance: Number(inputs.transportDistance || 0),
            vehicleType: inputs.vehicleType || '',
            vehicleFuelType: inputs.vehicleFuelType || 'DIESEL',
            vehicleEnergyClass: inputs.vehicleEnergyClass || '',
            vehicleFuelConsumption: Number(inputs.vehicleFuelConsumption || 0),
            vehicleFuelConsumptionUnit: inputs.vehicleFuelConsumptionUnit || 'l_100km'
          };
        } else if (category === 'waste') {
          source = 'waste';
          description = `${inputs.wasteType || 'WASTE_LANDFILL'} disposal`;
          quantity = inputs.wasteQuantity || '0';
          unit = 'kg';
          details = {
            periodType: inputs.periodType || 'ANNUAL',
            scope3Category: 'waste',
            wasteType: inputs.wasteType || 'WASTE_LANDFILL',
            wasteQuantity: Number(inputs.wasteQuantity || 0)
          };
        } else if (category === 'purchases') {
          source = 'purchases';
          description = `${inputs.purchaseType || 'PURCHASED_GOODS'}: ${inputs.purchaseDescription || ''}`;
          quantity = inputs.purchaseQuantity || '0';
          unit = 'units';
          details = {
            periodType: inputs.periodType || 'ANNUAL',
            scope3Category: 'purchases',
            purchaseType: inputs.purchaseType || 'PURCHASED_GOODS',
            purchaseQuantity: Number(inputs.purchaseQuantity || 0),
            purchaseDescription: inputs.purchaseDescription || ''
          };
        }
      }
      
      // Calculate emissions (dummy value for now)
      const emissionsValue = 2.5; // This would normally come from a calculation function
      
      // Create a new calculation record
      await createNewCalculation(
        scope,
        source,
        description,
        quantity,
        unit,
        emissionsValue,
        details
      );
      
      console.log(`${scope} emissions calculated successfully`);
      return true;
    } catch (error) {
      console.error(`Error calculating ${scope} emissions:`, error);
      return false;
    }
  };

  return {
    calculateEmissions,
    handleRemoveCalculation: removeCalculation,
    resetCalculation,
    handleSubmitCalculation,
    updateCalculation,
    isCalculating,
    isCreating,
    isDeleting,
    isUpdating,
    isSaving
  };
};
