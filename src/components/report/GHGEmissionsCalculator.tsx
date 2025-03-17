import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calculator } from 'lucide-react';
import { 
  EmissionFactorSource, 
  PeriodType, 
  FuelType, 
  EnergyType, 
  TransportType, 
  WasteType, 
  PurchaseType
} from '@/lib/emissions-types';
import { useEmissionsCalculator } from '@/hooks/use-emissions-calculator';

// Import refactored components
import Scope1Form from './emissions/Scope1Form';
import Scope2Form from './emissions/Scope2Form';
import Scope3Form from './emissions/Scope3Form';
import EmissionsResults from './emissions/EmissionsResults';
import CalculatorHeader from './emissions/CalculatorHeader';

interface GHGEmissionsCalculatorProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void);
  onResetClick?: () => void;
}

// Helper to create a synthetic event for use with the setFormValues function
const createSyntheticEvent = (name: string, value: any): React.ChangeEvent<HTMLInputElement> => {
  const event = {
    target: {
      name,
      value
    }
  } as React.ChangeEvent<HTMLInputElement>;
  return event;
};

const GHGEmissionsCalculator: React.FC<GHGEmissionsCalculatorProps> = ({ 
  formValues, 
  setFormValues,
  onResetClick
}) => {
  const [activeTab, setActiveTab] = useState<string>('scope1');
  
  // Get the appropriate metrics data
  const getMetricsData = () => {
    // If we're using location-specific metrics, we need to get the data from the specific location
    if (formValues.environmentalMetrics?.locationMetrics) {
      const locationMetrics = formValues.environmentalMetrics.locationMetrics;
      const currentMetricsObj = locationMetrics.find((lm: any) => lm.metrics);
      return currentMetricsObj?.metrics || {};
    }
    
    // Otherwise, use the global metrics
    return formValues.environmentalMetrics || {};
  };

  // Emit value changes to parent component
  const updateFormValues = (name: string, value: any) => {
    if (typeof setFormValues === 'function') {
      if (setFormValues.length === 1) {
        // It's a location-specific metrics handler
        setFormValues(createSyntheticEvent(name, value));
      } else {
        // It's a global form handler (useState setter)
        (setFormValues as React.Dispatch<React.SetStateAction<any>>)((prev: any) => {
          return {
            ...prev,
            environmentalMetrics: {
              ...prev.environmentalMetrics,
              [name]: value
            }
          };
        });
      }
    }
  };

  // Use our custom hook for emissions calculations
  const { 
    inputs, 
    updateInput, 
    results: calculatedEmissions, 
    details,
    calculateEmissions, 
    resetCalculation 
  } = useEmissionsCalculator(undefined, (results, details) => {
    // This callback runs when calculation results change
    if (results.scope1 > 0) {
      updateFormValues('totalScope1Emissions', results.scope1.toFixed(2));
      updateFormValues('scope1CalculationDetails', details.scope1Details);
    }
    
    if (results.scope2 > 0) {
      updateFormValues('totalScope2Emissions', results.scope2.toFixed(2));
      updateFormValues('scope2CalculationDetails', details.scope2Details);
    }
    
    if (results.scope3 > 0) {
      updateFormValues('totalScope3Emissions', results.scope3.toFixed(2));
      updateFormValues('scope3CalculationDetails', details.scope3Details);
    }
    
    updateFormValues('totalScopeEmissions', results.total.toFixed(2));
  });

  // Load existing calculation results
  useEffect(() => {
    const metricsData = getMetricsData();
    
    if (metricsData) {
      // Update the state with existing values
      const scope1 = parseFloat(metricsData.totalScope1Emissions) || 0;
      const scope2 = parseFloat(metricsData.totalScope2Emissions) || 0;
      const scope3 = parseFloat(metricsData.totalScope3Emissions) || 0;
      const total = parseFloat(metricsData.totalScopeEmissions) || 0;
      
      // Only update if there's at least one non-zero value
      if (scope1 > 0 || scope2 > 0 || scope3 > 0) {
        updateInput('results', { scope1, scope2, scope3, total });
      }
    }

    // Check for reset emission command
    if (formValues.target && formValues.target.name === 'resetEmissions') {
      resetCalculation();
    }
  }, [formValues]);

  // Handle reset button click delegated from EmissionsResults component
  const handleResetClick = () => {
    if (onResetClick) {
      onResetClick();
    }
  };

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
