
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calculator } from 'lucide-react';
import { EmissionFactorSource, PeriodType } from '@/lib/emissions-types';
import { GHGEmissionsCalculatorProps } from './emissions/types';
import { useCalculator } from './emissions/hooks/useCalculator';

// Import refactored components
import Scope1Form from './emissions/Scope1Form';
import Scope2Form from './emissions/Scope2Form';
import Scope3Form from './emissions/Scope3Form';
import EmissionsResults from './emissions/EmissionsResults';
import CalculatorHeader from './emissions/CalculatorHeader';

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
    handleResetClick
  } = useCalculator(formValues, setFormValues, onResetClick);
  
  return (
    <div className="border rounded-md p-4 bg-white/80">
      <CalculatorHeader 
        calculationMethod={inputs.calculationMethod || EmissionFactorSource.DEFRA}
        setCalculationMethod={(value) => updateInput('calculationMethod', value)}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="scope1">Scope 1 - Emissioni Dirette</TabsTrigger>
          <TabsTrigger value="scope2">Scope 2 - Energia</TabsTrigger>
          <TabsTrigger value="scope3">Scope 3 - Altre Emissioni</TabsTrigger>
        </TabsList>
        
        {/* Scope 1 Content */}
        <TabsContent value="scope1" className="space-y-4">
          <Scope1Form
            scope1Source={inputs.scope1Source || 'fuel'}
            setScope1Source={(value) => updateInput('scope1Source', value)}
            fuelType={inputs.fuelType || 'DIESEL'}
            setFuelType={(value) => updateInput('fuelType', value)}
            fuelQuantity={inputs.fuelQuantity || ''}
            setFuelQuantity={(value) => updateInput('fuelQuantity', value)}
            fuelUnit={inputs.fuelUnit || 'L'}
            setFuelUnit={(value) => updateInput('fuelUnit', value)}
            periodType={inputs.periodType || PeriodType.ANNUAL}
            setPeriodType={(value) => updateInput('periodType', value)}
          />
        </TabsContent>
        
        {/* Scope 2 Content */}
        <TabsContent value="scope2" className="space-y-4">
          <Scope2Form
            energyType={inputs.energyType || 'ELECTRICITY_IT'}
            setEnergyType={(value) => updateInput('energyType', value)}
            energyQuantity={inputs.energyQuantity || ''}
            setEnergyQuantity={(value) => updateInput('energyQuantity', value)}
            renewablePercentage={inputs.renewablePercentage || 0}
            setRenewablePercentage={(value) => updateInput('renewablePercentage', value)}
            periodType={inputs.periodType || PeriodType.ANNUAL}
            setPeriodType={(value) => updateInput('periodType', value)}
          />
        </TabsContent>
        
        {/* Scope 3 Content */}
        <TabsContent value="scope3" className="space-y-4">
          <Scope3Form
            scope3Category={inputs.scope3Category || 'transport'}
            setScope3Category={(value) => updateInput('scope3Category', value)}
            transportType={inputs.transportType || 'BUSINESS_TRAVEL_CAR'}
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
            periodType={inputs.periodType || PeriodType.ANNUAL}
            setPeriodType={(value) => updateInput('periodType', value)}
          />
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-between items-center">
        <Button 
          onClick={() => calculateEmissions()}
          className="flex items-center"
        >
          <Calculator className="mr-2 h-4 w-4" />
          Calcola Emissioni
        </Button>
        
        <EmissionsResults
          calculatedEmissions={calculatedEmissions}
          onResetClick={handleResetClick}
        />
      </div>
    </div>
  );
};

export default GHGEmissionsCalculator;
