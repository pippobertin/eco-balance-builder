
import React from 'react';
import Scope1Form from './emissions/Scope1Form';
import Scope2Form from './emissions/Scope2Form';
import Scope3Form from './emissions/Scope3Form';
import CalculatorHeader from './emissions/CalculatorHeader';
import EmissionsResults from './emissions/EmissionsResults';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCalculator } from './emissions/hooks/useCalculator';
import { EmissionFactorSource } from '@/lib/emissions-types';

interface GHGEmissionsCalculatorProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void);
  onResetClick?: (callback: () => void) => void;
}

const GHGEmissionsCalculator: React.FC<GHGEmissionsCalculatorProps> = ({ 
  formValues, 
  setFormValues,
  onResetClick
}) => {
  const {
    activeTab,
    setActiveTab,
    calculatedEmissions,
    inputs,
    updateInput,
    calculateEmissions,
    handleResetClick: calculatorResetHandler,
    showResetDialog,
    setShowResetDialog,
    handleResetConfirm,
    handleResetCancel,
    calculationMethod,
    setCalculationMethod
  } = useCalculator(formValues, setFormValues);

  // Use the external reset handler if provided, otherwise use the internal one
  const handleResetClick = () => {
    if (onResetClick) {
      // Pass the calculatorResetHandler as a callback to be executed after confirmation
      onResetClick(handleResetConfirm);
    } else {
      // Use internal reset handler
      calculatorResetHandler();
    }
  };

  return (
    <div className="mb-6">
      <CalculatorHeader 
        calculationMethod={calculationMethod}
        setCalculationMethod={setCalculationMethod}
      />
      
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-medium">Inserisci dati per il calcolo</h3>
          <EmissionsResults 
            calculatedEmissions={calculatedEmissions} 
            onResetClick={handleResetClick}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="scope1">Scope 1</TabsTrigger>
            <TabsTrigger value="scope2">Scope 2</TabsTrigger>
            <TabsTrigger value="scope3">Scope 3</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scope1">
            <Scope1Form 
              scope1Source={inputs.scope1Source || ''}
              setScope1Source={(value) => updateInput('scope1Source', value)}
              fuelType={inputs.fuelType || 'DIESEL'}
              setFuelType={(value) => updateInput('fuelType', value)}
              fuelQuantity={inputs.fuelQuantity || ''}
              setFuelQuantity={(value) => updateInput('fuelQuantity', value)}
              fuelUnit={inputs.fuelUnit || 'L'}
              setFuelUnit={(value) => updateInput('fuelUnit', value)}
              periodType={inputs.periodType || 'ANNUAL'}
              setPeriodType={(value) => updateInput('periodType', value)}
              calculateEmissions={() => calculateEmissions('scope1')}
            />
          </TabsContent>
          
          <TabsContent value="scope2">
            <Scope2Form 
              energyType={inputs.energyType || 'ELECTRICITY_IT'}
              setEnergyType={(value) => updateInput('energyType', value)}
              energyQuantity={inputs.energyQuantity || ''}
              setEnergyQuantity={(value) => updateInput('energyQuantity', value)}
              renewablePercentage={inputs.renewablePercentage || 0}
              setRenewablePercentage={(value) => updateInput('renewablePercentage', value)}
              periodType={inputs.periodType || 'ANNUAL'}
              setPeriodType={(value) => updateInput('periodType', value)}
              calculateEmissions={() => calculateEmissions('scope2')}
            />
          </TabsContent>
          
          <TabsContent value="scope3">
            <Scope3Form 
              scope3Category={inputs.scope3Category || 'transport'}
              setScope3Category={(value) => updateInput('scope3Category', value)}
              transportType={inputs.transportType || 'FREIGHT_ROAD'}
              setTransportType={(value) => updateInput('transportType', value)}
              transportDistance={inputs.transportDistance || ''}
              setTransportDistance={(value) => updateInput('transportDistance', value)}
              wasteType={inputs.wasteType || 'WASTE_LANDFILL'}
              setWasteType={(value) => updateInput('wasteType', value)}
              wasteQuantity={inputs.wasteQuantity || ''}
              setWasteQuantity={(value) => updateInput('wasteQuantity', value)}
              purchaseType={inputs.purchaseType || 'PURCHASED_GOODS'}
              setPurchaseType={(value) => updateInput('purchaseType', value)}
              purchaseQuantity={inputs.purchaseQuantity || ''}
              setPurchaseQuantity={(value) => updateInput('purchaseQuantity', value)}
              periodType={inputs.periodType || 'ANNUAL'}
              setPeriodType={(value) => updateInput('periodType', value)}
              calculateEmissions={() => calculateEmissions('scope3')}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GHGEmissionsCalculator;
