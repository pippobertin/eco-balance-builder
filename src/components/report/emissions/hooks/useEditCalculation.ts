
import { useState } from 'react';

export const useEditCalculation = (
  updateInput: (key: string, value: any) => void,
  setActiveTab: (tab: string) => void
) => {
  const [editMode, setEditMode] = useState(false);
  const [editingCalculationId, setEditingCalculationId] = useState<string | null>(null);

  const handleEditCalculation = (calculation: any) => {
    console.log('Editing calculation:', calculation);
    setEditMode(true);
    setEditingCalculationId(calculation.id);

    // Set the active tab based on the calculation scope
    setActiveTab(calculation.scope);

    // Populate the form fields with the calculation data
    const details = calculation.details || {};

    // Common fields across all scopes
    if (details.periodType) {
      updateInput('periodType', details.periodType);
    }

    // Scope-specific fields
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
    } else if (calculation.scope === 'scope2') {
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
    } else if (calculation.scope === 'scope3') {
      // Set the scope3 category
      if (details.scope3Category) {
        updateInput('scope3Category', details.scope3Category);
      } else if (details.transportType) {
        updateInput('scope3Category', 'transport');
      } else if (details.wasteType) {
        updateInput('scope3Category', 'waste');
      } else if (details.purchaseType) {
        updateInput('scope3Category', 'purchases');
      }

      // Transport fields
      if (details.transportType) {
        updateInput('transportType', details.transportType);
      }
      if (details.quantity && details.scope3Category === 'transport') {
        updateInput('transportDistance', details.quantity.toString());
      }

      // Vehicle details
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

      // Waste fields
      if (details.wasteType) {
        updateInput('wasteType', details.wasteType);
      }
      if (details.quantity && details.scope3Category === 'waste') {
        updateInput('wasteQuantity', details.quantity.toString());
      }

      // Purchase fields
      if (details.purchaseType) {
        updateInput('purchaseType', details.purchaseType);
      }
      if (details.quantity && details.scope3Category === 'purchases') {
        updateInput('purchaseQuantity', details.quantity.toString());
      }
      if (details.purchaseDescription) {
        updateInput('purchaseDescription', details.purchaseDescription);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingCalculationId(null);

    // Clear form fields based on active tab
    updateInput('fuelQuantity', '');
    updateInput('energyQuantity', '');
    updateInput('transportDistance', '');
    updateInput('wasteQuantity', '');
    updateInput('purchaseQuantity', '');
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
