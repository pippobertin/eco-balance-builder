
import { useState } from 'react';

interface UseEditCalculationParams {
  updateInput: (key: string, value: any) => void;
  setActiveTab: (tab: string) => void;
}

export const useEditCalculation = ({ updateInput, setActiveTab }: UseEditCalculationParams) => {
  const [editMode, setEditMode] = useState(false);
  const [editingCalculationId, setEditingCalculationId] = useState<string | null>(null);

  const handleEditCalculation = (calculation: any) => {
    console.log('Editing calculation:', calculation);
    setEditMode(true);
    setEditingCalculationId(calculation.id);
    
    setActiveTab(calculation.scope);
    
    const details = calculation.details || {};
    
    if (details.periodType) {
      updateInput('periodType', details.periodType);
    }
    
    if (calculation.scope === 'scope1') {
      if (details.scope1Source) {
        updateInput('scope1Source', details.scope1Source);
      }
      
      if (details.fuelType) {
        updateInput('fuelType', details.fuelType);
      }
      
      if (details.quantity) {
        updateInput('fuelQuantity', details.quantity.toString());
      }
      
      if (details.unit) {
        updateInput('fuelUnit', details.unit);
      }
    } 
    else if (calculation.scope === 'scope2') {
      if (details.energyType) {
        updateInput('energyType', details.energyType);
      }
      
      if (details.quantity) {
        updateInput('energyQuantity', details.quantity.toString());
      }
      
      if (details.renewablePercentage !== undefined) {
        updateInput('renewablePercentage', details.renewablePercentage);
      }
      
      if (details.energyProvider) {
        updateInput('energyProvider', details.energyProvider);
      }
    } 
    else if (calculation.scope === 'scope3') {
      if (details.scope3Category) {
        updateInput('scope3Category', details.scope3Category);
      } else if (details.transportType) {
        updateInput('scope3Category', 'transport');
      } else if (details.wasteType) {
        updateInput('scope3Category', 'waste');
      } else if (details.purchaseType) {
        updateInput('scope3Category', 'purchases');
      } else if (details.activityType) {
        if (details.activityType.includes('WASTE')) {
          updateInput('scope3Category', 'waste');
        } else if (details.activityType.includes('PURCHASED')) {
          updateInput('scope3Category', 'purchases');
        } else {
          updateInput('scope3Category', 'transport');
        }
      }
      
      if (details.transportType) {
        updateInput('transportType', details.transportType);
      }
      
      if (details.quantity) {
        const category = details.scope3Category || 
                        (details.transportType ? 'transport' : 
                         details.wasteType ? 'waste' : 
                         details.purchaseType ? 'purchases' : null);
                         
        if (category === 'transport' || (category === null && details.transportType)) {
          updateInput('transportDistance', details.quantity.toString());
        } else if (category === 'waste' || (category === null && details.wasteType)) {
          updateInput('wasteQuantity', details.quantity.toString());
        } else if (category === 'purchases' || (category === null && details.purchaseType)) {
          updateInput('purchaseQuantity', details.quantity.toString());
        }
      }
      
      if (details.vehicleType) {
        updateInput('vehicleType', details.vehicleType);
      }
      
      if (details.vehicleFuelType) {
        updateInput('vehicleFuelType', details.vehicleFuelType);
      }
      
      if (details.vehicleEnergyClass) {
        updateInput('vehicleEnergyClass', details.vehicleEnergyClass);
      }
      
      if (details.vehicleFuelConsumption) {
        updateInput('vehicleFuelConsumption', details.vehicleFuelConsumption);
      }
      
      if (details.vehicleFuelConsumptionUnit) {
        updateInput('vehicleFuelConsumptionUnit', details.vehicleFuelConsumptionUnit);
      }
      
      if (details.wasteType) {
        updateInput('wasteType', details.wasteType);
      }
      
      if (details.purchaseType) {
        updateInput('purchaseType', details.purchaseType);
      }
      
      if (details.purchaseDescription) {
        updateInput('purchaseDescription', details.purchaseDescription);
      }
    }
  };

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
