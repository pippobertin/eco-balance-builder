
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  EmissionScope, 
  EmissionFactorSource, 
  PeriodType, 
  FuelType, 
  EnergyType, 
  TransportType, 
  WasteType, 
  PurchaseType,
  BaseEmissionSource
} from '@/lib/emissions-types';
import { Info, Plus, Trash2, Calculator, ArrowRight, RefreshCcw } from 'lucide-react';

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

  // Get the appropriate metrics data and handle changes
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

  // Emit value changes to parent component using the appropriate mechanism
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

  // Handle reset button click
  const handleResetClick = () => {
    if (onResetClick) {
      onResetClick();
    }
  };

  return (
    <div className="border rounded-md p-4 bg-white/80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Calcolatore di Emissioni GHG</h3>
        <div className="text-sm text-gray-500">
          <span>Fonte dati: </span>
          <Select 
            value={calculationMethod} 
            onValueChange={(value) => setCalculationMethod(value as EmissionFactorSource)}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Seleziona fonte" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value={EmissionFactorSource.DEFRA}>DEFRA (UK)</SelectItem>
              <SelectItem value={EmissionFactorSource.ISPRA}>ISPRA (Italia)</SelectItem>
              <SelectItem value={EmissionFactorSource.IPCC}>IPCC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="scope1">Scope 1 - Emissioni Dirette</TabsTrigger>
          <TabsTrigger value="scope2">Scope 2 - Energia</TabsTrigger>
          <TabsTrigger value="scope3">Scope 3 - Altre Emissioni</TabsTrigger>
        </TabsList>
        
        {/* Scope 1 Content */}
        <TabsContent value="scope1" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Categoria fonte di emissione</Label>
              <Select 
                value={scope1Source} 
                onValueChange={setScope1Source}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Seleziona categoria" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="fuel">Combustibili per produzione</SelectItem>
                  <SelectItem value="fleet">Flotta aziendale</SelectItem>
                  <SelectItem value="other">Altre fonti dirette</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {scope1Source === 'fuel' && (
              <div>
                <Label>Tipo di combustibile</Label>
                <Select 
                  value={fuelType} 
                  onValueChange={(value) => setFuelType(value as FuelType)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Seleziona combustibile" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="DIESEL">Diesel</SelectItem>
                    <SelectItem value="GASOLINE">Benzina</SelectItem>
                    <SelectItem value="NATURAL_GAS">Gas Naturale</SelectItem>
                    <SelectItem value="LPG">GPL</SelectItem>
                    <SelectItem value="BIOMASS_PELLET">Pellet di Biomassa</SelectItem>
                    <SelectItem value="BIOMASS_WOOD">Legna</SelectItem>
                    <SelectItem value="BIOFUEL">Biocombustibile</SelectItem>
                    <SelectItem value="COAL">Carbone</SelectItem>
                    <SelectItem value="FUEL_OIL">Olio Combustibile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Quantità</Label>
              <Input 
                type="number" 
                value={fuelQuantity} 
                onChange={(e) => setFuelQuantity(e.target.value)}
                placeholder="Inserisci quantità"
                className="bg-white"
              />
            </div>
            
            <div>
              <Label>Unità di misura</Label>
              <Select 
                value={fuelUnit} 
                onValueChange={setFuelUnit}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Seleziona unità" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="L">Litri (L)</SelectItem>
                  <SelectItem value="kg">Kilogrammi (kg)</SelectItem>
                  <SelectItem value="m3">Metri cubi (m³)</SelectItem>
                  <SelectItem value="kWh">Kilowattora (kWh)</SelectItem>
                  <SelectItem value="MWh">Megawattora (MWh)</SelectItem>
                  <SelectItem value="GJ">Gigajoule (GJ)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Periodo di riferimento</Label>
              <Select 
                value={periodType} 
                onValueChange={(value) => setPeriodType(value as PeriodType)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Seleziona periodo" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value={PeriodType.ANNUAL}>Annuale</SelectItem>
                  <SelectItem value={PeriodType.QUARTERLY}>Trimestrale</SelectItem>
                  <SelectItem value={PeriodType.MONTHLY}>Mensile</SelectItem>
                  <SelectItem value={PeriodType.WEEKLY}>Settimanale</SelectItem>
                  <SelectItem value={PeriodType.DAILY}>Giornaliero</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        {/* Scope 2 Content */}
        <TabsContent value="scope2" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Tipo di energia</Label>
              <Select 
                value={energyType} 
                onValueChange={(value) => setEnergyType(value as EnergyType)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Seleziona tipo di energia" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="ELECTRICITY_IT">Elettricità da rete nazionale (Italia)</SelectItem>
                  <SelectItem value="ELECTRICITY_EU">Elettricità da rete europea</SelectItem>
                  <SelectItem value="ELECTRICITY_RENEWABLE">Elettricità 100% rinnovabile</SelectItem>
                  <SelectItem value="ELECTRICITY_COGENERATION">Elettricità da cogenerazione</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Percentuale di energia rinnovabile (%)</Label>
              <Input 
                type="number" 
                min="0" 
                max="100" 
                value={renewablePercentage.toString()} 
                onChange={(e) => setRenewablePercentage(Number(e.target.value))}
                placeholder="Percentuale energia rinnovabile"
                className="bg-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Quantità di energia consumata (kWh)</Label>
              <Input 
                type="number" 
                value={energyQuantity} 
                onChange={(e) => setEnergyQuantity(e.target.value)}
                placeholder="Inserisci quantità in kWh"
                className="bg-white"
              />
            </div>
            
            <div>
              <Label>Periodo di riferimento</Label>
              <Select 
                value={periodType} 
                onValueChange={(value) => setPeriodType(value as PeriodType)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Seleziona periodo" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value={PeriodType.ANNUAL}>Annuale</SelectItem>
                  <SelectItem value={PeriodType.QUARTERLY}>Trimestrale</SelectItem>
                  <SelectItem value={PeriodType.MONTHLY}>Mensile</SelectItem>
                  <SelectItem value={PeriodType.WEEKLY}>Settimanale</SelectItem>
                  <SelectItem value={PeriodType.DAILY}>Giornaliero</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        {/* Scope 3 Content */}
        <TabsContent value="scope3" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Categoria</Label>
              <Select 
                value={scope3Category} 
                onValueChange={setScope3Category}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Seleziona categoria" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="transport">Trasporto e Logistica</SelectItem>
                  <SelectItem value="waste">Gestione Rifiuti</SelectItem>
                  <SelectItem value="purchases">Acquisto di beni e servizi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {scope3Category === 'transport' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tipo di trasporto</Label>
                <Select 
                  value={transportType} 
                  onValueChange={(value) => setTransportType(value as TransportType)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Seleziona tipo di trasporto" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="FREIGHT_ROAD">Trasporto merci su strada</SelectItem>
                    <SelectItem value="FREIGHT_RAIL">Trasporto merci su rotaia</SelectItem>
                    <SelectItem value="FREIGHT_SEA">Trasporto merci via mare</SelectItem>
                    <SelectItem value="FREIGHT_AIR">Trasporto merci via aerea</SelectItem>
                    <SelectItem value="BUSINESS_TRAVEL_CAR">Viaggi di lavoro in auto</SelectItem>
                    <SelectItem value="BUSINESS_TRAVEL_TRAIN">Viaggi di lavoro in treno</SelectItem>
                    <SelectItem value="BUSINESS_TRAVEL_FLIGHT_SHORT">Viaggi di lavoro in aereo (corto raggio)</SelectItem>
                    <SelectItem value="BUSINESS_TRAVEL_FLIGHT_LONG">Viaggi di lavoro in aereo (lungo raggio)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Distanza percorsa (km)</Label>
                <Input 
                  type="number" 
                  value={transportDistance} 
                  onChange={(e) => setTransportDistance(e.target.value)}
                  placeholder="Inserisci distanza in km"
                  className="bg-white"
                />
              </div>
            </div>
          )}
          
          {scope3Category === 'waste' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tipo di rifiuto</Label>
                <Select 
                  value={wasteType} 
                  onValueChange={(value) => setWasteType(value as WasteType)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Seleziona tipo di rifiuto" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="WASTE_LANDFILL">Rifiuti in discarica</SelectItem>
                    <SelectItem value="WASTE_RECYCLED">Rifiuti riciclati</SelectItem>
                    <SelectItem value="WASTE_INCINERATION">Rifiuti inceneriti</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Quantità di rifiuti (kg)</Label>
                <Input 
                  type="number" 
                  value={wasteQuantity} 
                  onChange={(e) => setWasteQuantity(e.target.value)}
                  placeholder="Inserisci quantità in kg"
                  className="bg-white"
                />
              </div>
            </div>
          )}
          
          {scope3Category === 'purchases' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tipo di acquisto</Label>
                <Select 
                  value={purchaseType} 
                  onValueChange={(value) => setPurchaseType(value as PurchaseType)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Seleziona tipo di acquisto" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="PURCHASED_GOODS">Beni acquistati</SelectItem>
                    <SelectItem value="PURCHASED_SERVICES">Servizi acquistati</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Quantità</Label>
                <Input 
                  type="number" 
                  value={purchaseQuantity} 
                  onChange={(e) => setPurchaseQuantity(e.target.value)}
                  placeholder={purchaseType === 'PURCHASED_GOODS' ? "Inserisci quantità in kg" : "Inserisci numero di unità"}
                  className="bg-white"
                />
              </div>
            </div>
          )}
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
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Risultati del calcolo (tonnellate CO₂e):</p>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="text-center">
                <p className="font-semibold">Scope 1</p>
                <p>{calculatedEmissions.scope1.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">Scope 2</p>
                <p>{calculatedEmissions.scope2.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">Scope 3</p>
                <p>{calculatedEmissions.scope3.toFixed(2)}</p>
              </div>
              <div className="text-center bg-blue-50 rounded-md p-1">
                <p className="font-semibold">Totale</p>
                <p>{calculatedEmissions.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetClick}
            className="flex items-center gap-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <RefreshCcw className="h-4 w-4" />
            Azzera calcoli
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GHGEmissionsCalculator;
