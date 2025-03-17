
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  calculateScope1Emissions, 
  calculateScope2Emissions, 
  calculateScope3Emissions,
  getAvailableFuelTypes,
  getAvailableEnergyTypes,
  getAvailableScope3Types,
  getAvailableUnits,
  getEmissionFactorSource
} from '@/lib/emissions-calculator';
import { 
  Scope1Data, 
  Scope2Data, 
  Scope3Data, 
  PeriodType,
  FuelType,
  EnergyType
} from '@/lib/emissions-types';
import { Info, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GHGEmissionsCalculatorProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement>) => void);
}

const GHGEmissionsCalculator: React.FC<GHGEmissionsCalculatorProps> = ({
  formValues,
  setFormValues
}) => {
  // Function to handle changes correctly, supporting both regular and location-specific metrics
  const handleChange = (name: string, value: string) => {
    const event = {
      target: {
        name,
        value
      }
    } as React.ChangeEvent<HTMLInputElement>;

    // Check if setFormValues is a function that accepts an event directly (for location-specific metrics)
    if (typeof setFormValues === 'function' && setFormValues.length === 1) {
      setFormValues(event);
    } else {
      // This is the standard approach for global metrics
      (setFormValues as React.Dispatch<React.SetStateAction<any>>)((prev: any) => ({
        ...prev,
        environmentalMetrics: {
          ...prev.environmentalMetrics,
          [name]: value
        }
      }));
    }
  };

  // State for managing time periods
  const [periodType, setPeriodType] = useState<PeriodType>('ANNUAL');
  
  // State for Scope 1 data (direct emissions from fuel combustion)
  const [scope1Data, setScope1Data] = useState<Scope1Data>({
    fuelType: 'DIESEL',
    quantity: 0,
    unit: 'L',
    periodType: 'ANNUAL'
  });

  // State for Scope 2 data (indirect emissions from purchased electricity)
  const [scope2Data, setScope2Data] = useState<Scope2Data>({
    energyType: 'ELECTRICITY_IT',
    quantity: 0,
    unit: 'kWh',
    renewablePercentage: 0.41, // Default to Italian grid mix
    periodType: 'ANNUAL'
  });

  // State for Scope 3 data (other indirect emissions)
  const [scope3Data, setScope3Data] = useState<Scope3Data>({
    activityType: 'FREIGHT_ROAD',
    quantity: 0,
    unit: 'km',
    secondaryQuantity: 0,
    secondaryUnit: 't',
    periodType: 'ANNUAL'
  });
  
  // Show/hide extended options
  const [showScope1Options, setShowScope1Options] = useState(false);
  const [showScope2Options, setShowScope2Options] = useState(false);
  const [showScope3Options, setShowScope3Options] = useState(false);
  
  // Error states
  const [scope1Error, setScope1Error] = useState<string | null>(null);
  const [scope2Error, setScope2Error] = useState<string | null>(null);
  const [scope3Error, setScope3Error] = useState<string | null>(null);

  // Handle Scope 1 input changes
  const handleScope1Change = (
    key: keyof Scope1Data,
    value: string | number | PeriodType
  ) => {
    setScope1Data(prev => ({
      ...prev,
      [key]: value
    }));
    setScope1Error(null);
  };

  // Handle Scope 2 input changes
  const handleScope2Change = (
    key: keyof Scope2Data,
    value: string | number | PeriodType
  ) => {
    setScope2Data(prev => ({
      ...prev,
      [key]: value
    }));
    setScope2Error(null);
  };

  // Handle Scope 3 input changes
  const handleScope3Change = (
    key: keyof Scope3Data,
    value: string | number | PeriodType
  ) => {
    setScope3Data(prev => ({
      ...prev,
      [key]: value
    }));
    setScope3Error(null);
  };

  // Calculate Scope 1 emissions
  const calculateAndSaveScope1Emissions = () => {
    try {
      if (!scope1Data.fuelType || !scope1Data.quantity) {
        setScope1Error('Inserisci sia il tipo di combustibile che la quantità');
        return;
      }
      
      const emissions = calculateScope1Emissions(
        scope1Data.fuelType as FuelType,
        Number(scope1Data.quantity),
        scope1Data.unit
      );
      
      // Convert to tonnes if over 1000kg
      const formattedEmissions = emissions >= 1000 
        ? (emissions / 1000).toFixed(2) 
        : emissions.toFixed(2);
      
      // Update state with emissions result
      handleChange('totalScope1Emissions', formattedEmissions);
      
      // Store the calculation details for transparency
      const source = getEmissionFactorSource(scope1Data.fuelType);
      handleChange('scope1CalculationDetails', JSON.stringify({
        ...scope1Data,
        emissionsKg: emissions,
        emissionsTonnes: emissions / 1000,
        calculationDate: new Date().toISOString(),
        source: source
      }));
      
      // Show success message
      setScope1Error(null);
    } catch (error) {
      console.error("Error calculating Scope 1 emissions:", error);
      setScope1Error('Errore nel calcolo delle emissioni. Verifica i dati inseriti.');
    }
  };

  // Calculate Scope 2 emissions
  const calculateAndSaveScope2Emissions = () => {
    try {
      if (!scope2Data.energyType || !scope2Data.quantity) {
        setScope2Error('Inserisci sia il tipo di energia che la quantità');
        return;
      }
      
      const emissions = calculateScope2Emissions(
        scope2Data.energyType as EnergyType,
        Number(scope2Data.quantity),
        scope2Data.unit,
        scope2Data.renewablePercentage
      );
      
      // Convert to tonnes if over 1000kg
      const formattedEmissions = emissions >= 1000 
        ? (emissions / 1000).toFixed(2) 
        : emissions.toFixed(2);
      
      // Update state with emissions result
      handleChange('totalScope2Emissions', formattedEmissions);
      
      // Store the calculation details for transparency
      const source = getEmissionFactorSource(scope2Data.energyType);
      handleChange('scope2CalculationDetails', JSON.stringify({
        ...scope2Data,
        emissionsKg: emissions,
        emissionsTonnes: emissions / 1000,
        calculationDate: new Date().toISOString(),
        source: source
      }));
      
      // Show success message
      setScope2Error(null);
    } catch (error) {
      console.error("Error calculating Scope 2 emissions:", error);
      setScope2Error('Errore nel calcolo delle emissioni. Verifica i dati inseriti.');
    }
  };

  // Calculate Scope 3 emissions
  const calculateAndSaveScope3Emissions = () => {
    try {
      if (!scope3Data.activityType || !scope3Data.quantity) {
        setScope3Error('Inserisci sia il tipo di attività che la quantità');
        return;
      }
      
      const emissions = calculateScope3Emissions(
        scope3Data.activityType,
        Number(scope3Data.quantity),
        scope3Data.unit,
        scope3Data.secondaryQuantity ? Number(scope3Data.secondaryQuantity) : undefined,
        scope3Data.secondaryUnit
      );
      
      // Convert to tonnes if over 1000kg
      const formattedEmissions = emissions >= 1000 
        ? (emissions / 1000).toFixed(2) 
        : emissions.toFixed(2);
      
      // Update state with emissions result
      handleChange('totalScope3Emissions', formattedEmissions);
      
      // Store the calculation details for transparency
      const source = getEmissionFactorSource(scope3Data.activityType);
      handleChange('scope3CalculationDetails', JSON.stringify({
        ...scope3Data,
        emissionsKg: emissions,
        emissionsTonnes: emissions / 1000,
        calculationDate: new Date().toISOString(),
        source: source
      }));
      
      // Show success message
      setScope3Error(null);
    } catch (error) {
      console.error("Error calculating Scope 3 emissions:", error);
      setScope3Error('Errore nel calcolo delle emissioni. Verifica i dati inseriti.');
    }
  };

  // Calculate total emissions from all scopes
  const calculateTotalEmissions = () => {
    try {
      // Get values from formValues or use 0 if not available
      const scope1 = parseFloat(formValues.environmentalMetrics?.totalScope1Emissions || '0');
      const scope2 = parseFloat(formValues.environmentalMetrics?.totalScope2Emissions || '0');
      const scope3 = parseFloat(formValues.environmentalMetrics?.totalScope3Emissions || '0');
      
      // Calculate total
      const total = scope1 + scope2 + scope3;
      
      // Update the total
      handleChange('totalScopeEmissions', total.toFixed(2));
    } catch (error) {
      console.error("Error calculating total emissions:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-md bg-blue-50 border border-blue-200 mb-4">
        <div className="flex items-start">
          <Info className="mt-1 mr-2 h-4 w-4 text-blue-500" />
          <div className="text-sm text-slate-700">
            <p className="font-medium mb-1">Informazioni sul calcolo delle emissioni</p>
            <p>
              Il calcolatore utilizza fattori di emissione da fonti ufficiali: DEFRA (UK), IPCC e ISPRA (Italia).
              Tutte le emissioni sono espresse in tonnellate di CO₂ equivalente (tCO₂e).
              I fattori di emissione sono aggiornati al 2023.
            </p>
          </div>
        </div>
      </div>
      
      {/* Period selector for all calculations */}
      <div className="mb-4">
        <Label htmlFor="period-type" className="mb-2 inline-block">Periodo di riferimento</Label>
        <Select 
          value={periodType} 
          onValueChange={(value) => {
            setPeriodType(value as PeriodType);
            handleScope1Change('periodType', value as PeriodType);
            handleScope2Change('periodType', value as PeriodType);
            handleScope3Change('periodType', value as PeriodType);
          }}
        >
          <SelectTrigger className="w-full md:w-72">
            <SelectValue placeholder="Seleziona periodo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ANNUAL">Annuale</SelectItem>
            <SelectItem value="QUARTERLY">Trimestrale</SelectItem>
            <SelectItem value="MONTHLY">Mensile</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Scope 1 Emissions */}
      <div className="p-4 rounded-md border border-gray-200 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-lg">Calcolo Emissioni Scope 1</h4>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-5 w-5 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Le emissioni Scope 1 sono emissioni dirette da fonti possedute o controllate dall'azienda, come la combustione di carburanti per veicoli o riscaldamento.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="fuelType">Tipo di combustibile</Label>
            <Select 
              value={scope1Data.fuelType} 
              onValueChange={(value) => handleScope1Change('fuelType', value)}
            >
              <SelectTrigger id="fuelType" className="w-full">
                <SelectValue placeholder="Seleziona combustibile" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableFuelTypes().map(fuel => (
                  <SelectItem key={fuel.value} value={fuel.value}>
                    {fuel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="quantity">Quantità</Label>
            <Input
              type="number"
              id="quantity"
              value={scope1Data.quantity || ''}
              onChange={(e) => handleScope1Change('quantity', e.target.value)}
              placeholder="es. 1000"
            />
          </div>
          
          <div>
            <Label htmlFor="unit">Unità</Label>
            <Select 
              value={scope1Data.unit} 
              onValueChange={(value) => handleScope1Change('unit', value)}
            >
              <SelectTrigger id="unit" className="w-full">
                <SelectValue placeholder="Seleziona unità" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableUnits('FUEL').map(unit => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {scope1Error && (
          <div className="mt-2 text-sm text-red-500">
            {scope1Error}
          </div>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <button
            type="button"
            onClick={() => setShowScope1Options(!showScope1Options)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showScope1Options ? 'Nascondi opzioni avanzate' : 'Mostra opzioni avanzate'}
          </button>
          
          <button
            onClick={calculateAndSaveScope1Emissions}
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Calcola Emissioni Scope 1
          </button>
        </div>
        
        {showScope1Options && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <h5 className="font-medium mb-2">Dettagli sul fattore di emissione</h5>
            <div className="text-sm text-gray-600">
              <p>
                Fonte: {getEmissionFactorSource(scope1Data.fuelType)?.name || 'Non disponibile'}
                {getEmissionFactorSource(scope1Data.fuelType) && (
                  <a 
                    href={getEmissionFactorSource(scope1Data.fuelType)?.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    Visualizza fonte
                  </a>
                )}
              </p>
              <p>Anno di riferimento: 2023</p>
            </div>
          </div>
        )}
      </div>

      {/* Scope 2 Emissions */}
      <div className="p-4 rounded-md border border-gray-200 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-lg">Calcolo Emissioni Scope 2</h4>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-5 w-5 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Le emissioni Scope 2 sono emissioni indirette dall'acquisto di elettricità, vapore, riscaldamento o raffreddamento.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="energyType">Tipo di energia</Label>
            <Select 
              value={scope2Data.energyType} 
              onValueChange={(value) => handleScope2Change('energyType', value)}
            >
              <SelectTrigger id="energyType" className="w-full">
                <SelectValue placeholder="Seleziona tipo energia" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableEnergyTypes().map(energy => (
                  <SelectItem key={energy.value} value={energy.value}>
                    {energy.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="quantity">Quantità</Label>
            <Input
              type="number"
              id="quantity"
              value={scope2Data.quantity || ''}
              onChange={(e) => handleScope2Change('quantity', e.target.value)}
              placeholder="es. 2000"
            />
          </div>
          
          <div>
            <Label htmlFor="unit">Unità</Label>
            <Select 
              value={scope2Data.unit} 
              onValueChange={(value) => handleScope2Change('unit', value)}
            >
              <SelectTrigger id="unit" className="w-full">
                <SelectValue placeholder="Seleziona unità" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableUnits('ENERGY').map(unit => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Renewable percentage slider - Only for grid electricity */}
        {(scope2Data.energyType === 'ELECTRICITY_IT' || scope2Data.energyType === 'ELECTRICITY_EU') && (
          <div className="mt-4">
            <Label htmlFor="renewablePercentage">
              Percentuale di energia rinnovabile nel mix energetico: {(scope2Data.renewablePercentage || 0) * 100}%
            </Label>
            <Input
              type="range"
              id="renewablePercentage"
              min="0"
              max="1"
              step="0.01"
              value={scope2Data.renewablePercentage || 0}
              onChange={(e) => handleScope2Change('renewablePercentage', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        )}
        
        {scope2Error && (
          <div className="mt-2 text-sm text-red-500">
            {scope2Error}
          </div>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <button
            type="button"
            onClick={() => setShowScope2Options(!showScope2Options)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showScope2Options ? 'Nascondi opzioni avanzate' : 'Mostra opzioni avanzate'}
          </button>
          
          <button
            onClick={calculateAndSaveScope2Emissions}
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Calcola Emissioni Scope 2
          </button>
        </div>
        
        {showScope2Options && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <h5 className="font-medium mb-2">Dettagli sul fattore di emissione</h5>
            <div className="text-sm text-gray-600">
              <p>
                Fonte: {getEmissionFactorSource(scope2Data.energyType)?.name || 'Non disponibile'}
                {getEmissionFactorSource(scope2Data.energyType) && (
                  <a 
                    href={getEmissionFactorSource(scope2Data.energyType)?.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    Visualizza fonte
                  </a>
                )}
              </p>
              <p>Anno di riferimento: 2023</p>
            </div>
          </div>
        )}
      </div>

      {/* Scope 3 Emissions */}
      <div className="p-4 rounded-md border border-gray-200 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-lg">Calcolo Emissioni Scope 3</h4>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-5 w-5 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Le emissioni Scope 3 sono tutte le altre emissioni indirette nella catena del valore di un'azienda, come trasporto merci, viaggi di lavoro, gestione rifiuti, ecc.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="activityType">Tipo di attività</Label>
            <Select 
              value={scope3Data.activityType} 
              onValueChange={(value) => handleScope3Change('activityType', value)}
            >
              <SelectTrigger id="activityType" className="w-full">
                <SelectValue placeholder="Seleziona attività" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableScope3Types().map(activity => (
                  <SelectItem key={activity.value} value={activity.value}>
                    {activity.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="quantity">
              {scope3Data.activityType?.startsWith('FREIGHT') ? 'Distanza' : 
                scope3Data.activityType?.startsWith('WASTE') ? 'Quantità' : 'Valore'}
            </Label>
            <Input
              type="number"
              id="quantity"
              value={scope3Data.quantity || ''}
              onChange={(e) => handleScope3Change('quantity', e.target.value)}
              placeholder={scope3Data.activityType?.startsWith('FREIGHT') ? 'es. 500 km' : 
                scope3Data.activityType?.startsWith('WASTE') ? 'es. 10 tonnellate' : 'es. 100'}
            />
          </div>
          
          <div>
            <Label htmlFor="unit">Unità</Label>
            <Select 
              value={scope3Data.unit} 
              onValueChange={(value) => handleScope3Change('unit', value)}
            >
              <SelectTrigger id="unit" className="w-full">
                <SelectValue placeholder="Seleziona unità" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableUnits(
                  scope3Data.activityType?.startsWith('FREIGHT') || scope3Data.activityType?.startsWith('BUSINESS_TRAVEL') 
                    ? 'TRANSPORT' 
                    : scope3Data.activityType?.startsWith('WASTE') 
                      ? 'WASTE' 
                      : 'TRANSPORT'
                ).map(unit => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Secondary quantity for freight transport */}
        {scope3Data.activityType?.startsWith('FREIGHT') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="secondaryQuantity">Peso del carico</Label>
              <Input
                type="number"
                id="secondaryQuantity"
                value={scope3Data.secondaryQuantity || ''}
                onChange={(e) => handleScope3Change('secondaryQuantity', e.target.value)}
                placeholder="es. 5 tonnellate"
              />
            </div>
            
            <div>
              <Label htmlFor="secondaryUnit">Unità</Label>
              <Select 
                value={scope3Data.secondaryUnit || 't'} 
                onValueChange={(value) => handleScope3Change('secondaryUnit', value)}
              >
                <SelectTrigger id="secondaryUnit" className="w-full">
                  <SelectValue placeholder="Seleziona unità" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableUnits('WASTE').map(unit => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {scope3Error && (
          <div className="mt-2 text-sm text-red-500">
            {scope3Error}
          </div>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <button
            type="button"
            onClick={() => setShowScope3Options(!showScope3Options)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showScope3Options ? 'Nascondi opzioni avanzate' : 'Mostra opzioni avanzate'}
          </button>
          
          <button
            onClick={calculateAndSaveScope3Emissions}
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Calcola Emissioni Scope 3
          </button>
        </div>
        
        {showScope3Options && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <h5 className="font-medium mb-2">Dettagli sul fattore di emissione</h5>
            <div className="text-sm text-gray-600">
              <p>
                Fonte: {getEmissionFactorSource(scope3Data.activityType)?.name || 'Non disponibile'}
                {getEmissionFactorSource(scope3Data.activityType) && (
                  <a 
                    href={getEmissionFactorSource(scope3Data.activityType)?.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    Visualizza fonte
                  </a>
                )}
              </p>
              <p>Anno di riferimento: 2023</p>
            </div>
          </div>
        )}
      </div>

      {/* Calculate Total Emissions */}
      <div className="p-4 rounded-md border border-gray-200 mb-6 bg-gray-50">
        <h4 className="font-semibold text-lg mb-3">Emissioni Totali</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="totalScope1">Scope 1 (tCO₂e)</Label>
            <Input
              type="text"
              id="totalScope1"
              value={formValues.environmentalMetrics?.totalScope1Emissions || "0"}
              readOnly
              className="bg-white"
            />
          </div>
          <div>
            <Label htmlFor="totalScope2">Scope 2 (tCO₂e)</Label>
            <Input
              type="text"
              id="totalScope2"
              value={formValues.environmentalMetrics?.totalScope2Emissions || "0"}
              readOnly
              className="bg-white"
            />
          </div>
          <div>
            <Label htmlFor="totalScope3">Scope 3 (tCO₂e)</Label>
            <Input
              type="text"
              id="totalScope3"
              value={formValues.environmentalMetrics?.totalScope3Emissions || "0"}
              readOnly
              className="bg-white"
            />
          </div>
          <div>
            <Label htmlFor="totalScopes">Totale (tCO₂e)</Label>
            <Input
              type="text"
              id="totalScopes"
              value={formValues.environmentalMetrics?.totalScopeEmissions || "0"}
              readOnly
              className="bg-white font-bold"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={calculateTotalEmissions}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
          >
            Calcola Emissioni Totali
          </button>
        </div>
      </div>
    </div>
  );
};

export default GHGEmissionsCalculator;
