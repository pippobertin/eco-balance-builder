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
  
  // Scope 1 specific state
  const [scope1Source, setScope1Source] = useState<string>('fuel');
  const [fuelType, setFuelType] = useState<FuelType>('DIESEL');
  const [fuelQuantity, setFuelQuantity] = useState<string>('');
  const [fuelUnit, setFuelUnit] = useState<string>('L');
  
  // Scope 2 specific state
  const [energyType, setEnergyType] = useState<EnergyType>('ELECTRICITY_IT');
  const [energyQuantity, setEnergyQuantity] = useState<string>('');
  const [renewablePercentage, setRenewablePercentage] = useState<number>(0);
  
  // Scope 3 specific state
  const [scope3Category, setScope3Category] = useState<string>('transport');
  const [transportType, setTransportType] = useState<TransportType>('BUSINESS_TRAVEL_CAR');
  const [transportDistance, setTransportDistance] = useState<string>('');
  const [wasteType, setWasteType] = useState<WasteType>('WASTE_LANDFILL');
  const [wasteQuantity, setWasteQuantity] = useState<string>('');
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('PURCHASED_GOODS');
  const [purchaseQuantity, setPurchaseQuantity] = useState<string>('');
  
  // Common state
  const [periodType, setPeriodType] = useState<PeriodType>(PeriodType.ANNUAL);
  const [calculationMethod, setCalculationMethod] = useState<EmissionFactorSource>(EmissionFactorSource.DEFRA);
  
  // Results state
  const [calculatedEmissions, setCalculatedEmissions] = useState<{
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  }>({
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0
  });

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

  // Reset input fields
  const resetInputFields = () => {
    setFuelQuantity('');
    setEnergyQuantity('');
    setTransportDistance('');
    setWasteQuantity('');
    setPurchaseQuantity('');
  };

  // Load existing calculation results
  useEffect(() => {
    const metricsData = getMetricsData();
    
    if (metricsData) {
      setCalculatedEmissions({
        scope1: parseFloat(metricsData.totalScope1Emissions) || 0,
        scope2: parseFloat(metricsData.totalScope2Emissions) || 0,
        scope3: parseFloat(metricsData.totalScope3Emissions) || 0,
        total: parseFloat(metricsData.totalScopeEmissions) || 0
      });
    }

    // Check for reset emission command
    if (formValues.target && formValues.target.name === 'resetEmissions') {
      setCalculatedEmissions({
        scope1: 0,
        scope2: 0,
        scope3: 0,
        total: 0
      });
      resetInputFields();
    }
  }, [formValues]);

  // Calculate emissions based on inputs
  const calculateEmissions = () => {
    let emissionsResult = {
      scope1: 0,
      scope2: 0,
      scope3: 0,
      total: 0,
      scope1Details: '',
      scope2Details: '',
      scope3Details: ''
    };
    
    // Scope 1 calculations
    if (activeTab === 'scope1' && fuelQuantity) {
      // Simple emission factor lookup (these would come from a database in a real application)
      const emissionFactors: Record<FuelType, number> = {
        'DIESEL': 2.68, // kg CO2e per liter
        'GASOLINE': 2.31, // kg CO2e per liter
        'NATURAL_GAS': 2.02, // kg CO2e per m3
        'LPG': 1.51, // kg CO2e per liter
        'BIOMASS_PELLET': 0.04, // kg CO2e per kg
        'BIOMASS_WOOD': 0.02, // kg CO2e per kg
        'BIOFUEL': 1.93, // kg CO2e per liter
        'COAL': 2.42, // kg CO2e per kg
        'FUEL_OIL': 3.15 // kg CO2e per liter
      };
      
      const quantity = parseFloat(fuelQuantity);
      const emissionFactor = emissionFactors[fuelType];
      const emissionsKg = quantity * emissionFactor;
      const emissionsTonnes = emissionsKg / 1000;
      
      emissionsResult.scope1 = emissionsTonnes;
      
      // Save calculation details as JSON string for later reference
      const calculationDetails = {
        fuelType,
        quantity,
        unit: fuelUnit,
        periodType,
        emissionsKg,
        emissionsTonnes,
        calculationDate: new Date().toISOString(),
        source: {
          name: calculationMethod,
          url: calculationMethod === EmissionFactorSource.DEFRA ? 
               'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023' :
               calculationMethod === EmissionFactorSource.ISPRA ?
               'https://www.isprambiente.gov.it/it/pubblicazioni/manuali-e-linee-guida/fattori-emissione-in-atmosfera' :
               'https://www.ipcc-nggip.iges.or.jp/EFDB/main.php',
          year: '2023'
        }
      };
      
      emissionsResult.scope1Details = JSON.stringify(calculationDetails);
    }
    
    // Scope 2 calculations
    if (activeTab === 'scope2' && energyQuantity) {
      // Energy emission factors by source
      const emissionFactors: Record<EnergyType, number> = {
        'ELECTRICITY_IT': 0.2835, // kg CO2e per kWh (Italy)
        'ELECTRICITY_EU': 0.2556, // kg CO2e per kWh (EU average)
        'ELECTRICITY_RENEWABLE': 0.0, // kg CO2e per kWh (100% renewable)
        'ELECTRICITY_COGENERATION': 0.185 // kg CO2e per kWh (cogeneration)
      };
      
      const quantity = parseFloat(energyQuantity);
      let emissionFactor = emissionFactors[energyType];
      
      // Adjust emission factor based on renewable percentage
      if (energyType === 'ELECTRICITY_IT' || energyType === 'ELECTRICITY_EU') {
        emissionFactor = emissionFactor * (1 - (renewablePercentage / 100));
      }
      
      const emissionsKg = quantity * emissionFactor;
      const emissionsTonnes = emissionsKg / 1000;
      
      emissionsResult.scope2 = emissionsTonnes;
      
      // Save calculation details
      const calculationDetails = {
        energyType,
        quantity,
        unit: 'kWh',
        renewablePercentage,
        periodType,
        emissionsKg,
        emissionsTonnes,
        calculationDate: new Date().toISOString(),
        source: {
          name: calculationMethod,
          url: calculationMethod === EmissionFactorSource.DEFRA ? 
               'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023' :
               calculationMethod === EmissionFactorSource.ISPRA ?
               'https://www.isprambiente.gov.it/it/pubblicazioni/manuali-e-linee-guida/fattori-emissione-in-atmosfera' :
               'https://www.ipcc-nggip.iges.or.jp/EFDB/main.php',
          year: '2023'
        }
      };
      
      emissionsResult.scope2Details = JSON.stringify(calculationDetails);
    }
    
    // Scope 3 calculations
    if (activeTab === 'scope3') {
      if (scope3Category === 'transport' && transportDistance) {
        // Transport emission factors
        const emissionFactors: Record<TransportType, number> = {
          'FREIGHT_ROAD': 0.135, // kg CO2e per km
          'FREIGHT_RAIL': 0.028, // kg CO2e per km
          'FREIGHT_SEA': 0.008, // kg CO2e per km
          'FREIGHT_AIR': 2.1, // kg CO2e per km
          'BUSINESS_TRAVEL_CAR': 0.17, // kg CO2e per km
          'BUSINESS_TRAVEL_TRAIN': 0.04, // kg CO2e per km
          'BUSINESS_TRAVEL_FLIGHT_SHORT': 0.255, // kg CO2e per km
          'BUSINESS_TRAVEL_FLIGHT_LONG': 0.18 // kg CO2e per km
        };
        
        const distance = parseFloat(transportDistance);
        const emissionFactor = emissionFactors[transportType];
        const emissionsKg = distance * emissionFactor;
        const emissionsTonnes = emissionsKg / 1000;
        
        emissionsResult.scope3 = emissionsTonnes;
        
        // Save calculation details
        const calculationDetails = {
          activityType: transportType,
          quantity: distance,
          unit: 'km',
          secondaryQuantity: 0,
          secondaryUnit: 't',
          periodType,
          emissionsKg,
          emissionsTonnes,
          calculationDate: new Date().toISOString(),
          source: {
            name: calculationMethod,
            url: calculationMethod === EmissionFactorSource.DEFRA ? 
                 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023' :
                 calculationMethod === EmissionFactorSource.ISPRA ?
                 'https://www.isprambiente.gov.it/it/pubblicazioni/manuali-e-linee-guida/fattori-emissione-in-atmosfera' :
                 'https://www.ipcc-nggip.iges.or.jp/EFDB/main.php',
            year: '2023'
          }
        };
        
        emissionsResult.scope3Details = JSON.stringify(calculationDetails);
      }
      else if (scope3Category === 'waste' && wasteQuantity) {
        // Waste emission factors
        const emissionFactors: Record<WasteType, number> = {
          'WASTE_LANDFILL': 0.58, // kg CO2e per kg
          'WASTE_RECYCLED': 0.021, // kg CO2e per kg
          'WASTE_INCINERATION': 0.335 // kg CO2e per kg
        };
        
        const quantity = parseFloat(wasteQuantity);
        const emissionFactor = emissionFactors[wasteType];
        const emissionsKg = quantity * emissionFactor;
        const emissionsTonnes = emissionsKg / 1000;
        
        emissionsResult.scope3 = emissionsTonnes;
        
        // Save calculation details
        const calculationDetails = {
          activityType: wasteType,
          quantity,
          unit: 'kg',
          periodType,
          emissionsKg,
          emissionsTonnes,
          calculationDate: new Date().toISOString(),
          source: {
            name: calculationMethod,
            url: calculationMethod === EmissionFactorSource.DEFRA ? 
                 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023' :
                 calculationMethod === EmissionFactorSource.ISPRA ?
                 'https://www.isprambiente.gov.it/it/pubblicazioni/manuali-e-linee-guida/fattori-emissione-in-atmosfera' :
                 'https://www.ipcc-nggip.iges.or.jp/EFDB/main.php',
            year: '2023'
          }
        };
        
        emissionsResult.scope3Details = JSON.stringify(calculationDetails);
      }
      else if (scope3Category === 'purchases' && purchaseQuantity) {
        // Purchase emission factors (simplified)
        const emissionFactors: Record<PurchaseType, number> = {
          'PURCHASED_GOODS': 1.2, // kg CO2e per kg
          'PURCHASED_SERVICES': 0.4 // kg CO2e per unit
        };
        
        const quantity = parseFloat(purchaseQuantity);
        const emissionFactor = emissionFactors[purchaseType];
        const emissionsKg = quantity * emissionFactor;
        const emissionsTonnes = emissionsKg / 1000;
        
        emissionsResult.scope3 = emissionsTonnes;
        
        // Save calculation details
        const calculationDetails = {
          activityType: purchaseType,
          quantity,
          unit: purchaseType === 'PURCHASED_GOODS' ? 'kg' : 'unit',
          periodType,
          emissionsKg,
          emissionsTonnes,
          calculationDate: new Date().toISOString(),
          source: {
            name: calculationMethod,
            url: calculationMethod === EmissionFactorSource.DEFRA ? 
                 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023' :
                 calculationMethod === EmissionFactorSource.ISPRA ?
                 'https://www.isprambiente.gov.it/it/pubblicazioni/manuali-e-linee-guida/fattori-emissione-in-atmosfera' :
                 'https://www.ipcc-nggip.iges.or.jp/EFDB/main.php',
            year: '2023'
          }
        };
        
        emissionsResult.scope3Details = JSON.stringify(calculationDetails);
      }
    }
    
    // Calculate total emissions
    emissionsResult.total = emissionsResult.scope1 + emissionsResult.scope2 + emissionsResult.scope3;
    
    // Update state
    setCalculatedEmissions({
      scope1: emissionsResult.scope1,
      scope2: emissionsResult.scope2,
      scope3: emissionsResult.scope3,
      total: emissionsResult.total
    });
    
    // Update form values
    if (emissionsResult.scope1 > 0) {
      updateFormValues('totalScope1Emissions', emissionsResult.scope1.toFixed(2));
      updateFormValues('scope1CalculationDetails', emissionsResult.scope1Details);
    }
    
    if (emissionsResult.scope2 > 0) {
      updateFormValues('totalScope2Emissions', emissionsResult.scope2.toFixed(2));
      updateFormValues('scope2CalculationDetails', emissionsResult.scope2Details);
    }
    
    if (emissionsResult.scope3 > 0) {
      updateFormValues('totalScope3Emissions', emissionsResult.scope3.toFixed(2));
      updateFormValues('scope3CalculationDetails', emissionsResult.scope3Details);
    }
    
    updateFormValues('totalScopeEmissions', emissionsResult.total.toFixed(2));
  };

  // Handle reset button click delegated from EmissionsResults component
  const handleResetClick = () => {
    if (onResetClick) {
      onResetClick();
    }
  };

  return (
    <div className="border rounded-md p-4 bg-white/80">
      <CalculatorHeader 
        calculationMethod={calculationMethod}
        setCalculationMethod={setCalculationMethod}
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
            scope1Source={scope1Source}
            setScope1Source={setScope1Source}
            fuelType={fuelType}
            setFuelType={setFuelType}
            fuelQuantity={fuelQuantity}
            setFuelQuantity={setFuelQuantity}
            fuelUnit={fuelUnit}
            setFuelUnit={setFuelUnit}
            periodType={periodType}
            setPeriodType={setPeriodType}
          />
        </TabsContent>
        
        {/* Scope 2 Content */}
        <TabsContent value="scope2" className="space-y-4">
          <Scope2Form
            energyType={energyType}
            setEnergyType={setEnergyType}
            energyQuantity={energyQuantity}
            setEnergyQuantity={setEnergyQuantity}
            renewablePercentage={renewablePercentage}
            setRenewablePercentage={setRenewablePercentage}
            periodType={periodType}
            setPeriodType={setPeriodType}
          />
        </TabsContent>
        
        {/* Scope 3 Content */}
        <TabsContent value="scope3" className="space-y-4">
          <Scope3Form
            scope3Category={scope3Category}
            setScope3Category={setScope3Category}
            transportType={transportType}
            setTransportType={setTransportType}
            transportDistance={transportDistance}
            setTransportDistance={setTransportDistance}
            wasteType={wasteType}
            setWasteType={setWasteType}
            wasteQuantity={wasteQuantity}
            setWasteQuantity={setWasteQuantity}
            purchaseType={purchaseType}
            setPurchaseType={setPurchaseType}
            purchaseQuantity={purchaseQuantity}
            setPurchaseQuantity={setPurchaseQuantity}
            periodType={periodType}
            setPeriodType={setPeriodType}
          />
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-between items-center">
        <Button 
          onClick={calculateEmissions}
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
