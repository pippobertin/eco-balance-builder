import React, { useState, useEffect } from 'react';
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
import { Info, HelpCircle, PlusCircle, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';

interface GHGEmissionsCalculatorProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement>) => void);
}

// Interfacce per le fonti di emissione con ID unico
interface Scope1EmissionSource {
  type: 'scope1';
  id: string;
  data: Scope1Data;
  calculatedEmissions?: number;
}

interface Scope2EmissionSource {
  type: 'scope2';
  id: string;
  data: Scope2Data;
  calculatedEmissions?: number;
}

interface Scope3EmissionSource {
  type: 'scope3';
  id: string;
  data: Scope3Data;
  calculatedEmissions?: number;
}

type EmissionSource = Scope1EmissionSource | Scope2EmissionSource | Scope3EmissionSource;

const GHGEmissionsCalculator: React.FC<GHGEmissionsCalculatorProps> = ({
  formValues,
  setFormValues
}) => {
  // Funzione per gestire le modifiche, supportando sia le metriche globali che quelle specifiche per sede
  const handleChange = (name: string, value: string) => {
    const event = {
      target: {
        name,
        value
      }
    } as React.ChangeEvent<HTMLInputElement>;

    // Verifica se setFormValues è una funzione che accetta direttamente un evento (per le metriche specifiche della sede)
    if (typeof setFormValues === 'function' && setFormValues.length === 1) {
      setFormValues(event);
    } else {
      // Questo è l'approccio standard per le metriche globali
      (setFormValues as React.Dispatch<React.SetStateAction<any>>)((prev: any) => ({
        ...prev,
        environmentalMetrics: {
          ...prev.environmentalMetrics,
          [name]: value
        }
      }));
    }
  };

  // Stato per la gestione dei periodi temporali
  const [periodType, setPeriodType] = useState<PeriodType>('ANNUAL');
  
  // Stati per le fonti di emissione multiple
  const [scope1Sources, setScope1Sources] = useState<Scope1EmissionSource[]>([{
    type: 'scope1',
    id: uuidv4(),
    data: {
      fuelType: 'DIESEL',
      quantity: 0,
      unit: 'L',
      periodType: 'ANNUAL'
    }
  }]);

  const [scope2Sources, setScope2Sources] = useState<Scope2EmissionSource[]>([{
    type: 'scope2',
    id: uuidv4(),
    data: {
      energyType: 'ELECTRICITY_IT',
      quantity: 0,
      unit: 'kWh',
      renewablePercentage: 0.41, // Default per il mix energetico italiano
      periodType: 'ANNUAL'
    }
  }]);

  const [scope3Sources, setScope3Sources] = useState<Scope3EmissionSource[]>([{
    type: 'scope3',
    id: uuidv4(),
    data: {
      activityType: 'FREIGHT_ROAD',
      quantity: 0,
      unit: 'km',
      secondaryQuantity: 0,
      secondaryUnit: 't',
      periodType: 'ANNUAL'
    }
  }]);
  
  // Mostra/nascondi opzioni estese
  const [showScope1Options, setShowScope1Options] = useState(false);
  const [showScope2Options, setShowScope2Options] = useState(false);
  const [showScope3Options, setShowScope3Options] = useState(false);
  
  // Stati di errore
  const [scope1Error, setScope1Error] = useState<string | null>(null);
  const [scope2Error, setScope2Error] = useState<string | null>(null);
  const [scope3Error, setScope3Error] = useState<string | null>(null);

  // Gestione delle modifiche per Scope 1
  const handleScope1SourceChange = (
    sourceId: string,
    key: keyof Scope1Data,
    value: string | number | PeriodType
  ) => {
    setScope1Sources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, data: { ...source.data, [key]: value } as Scope1Data } 
        : source
    ));
    setScope1Error(null);
  };

  // Gestione delle modifiche per Scope 2
  const handleScope2SourceChange = (
    sourceId: string,
    key: keyof Scope2Data,
    value: string | number | PeriodType
  ) => {
    setScope2Sources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, data: { ...source.data, [key]: value } as Scope2Data } 
        : source
    ));
    setScope2Error(null);
  };

  // Gestione delle modifiche per Scope 3
  const handleScope3SourceChange = (
    sourceId: string,
    key: keyof Scope3Data,
    value: string | number | PeriodType
  ) => {
    setScope3Sources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, data: { ...source.data, [key]: value } as Scope3Data } 
        : source
    ));
    setScope3Error(null);
  };

  // Aggiungere una nuova fonte di emissione per Scope 1
  const addScope1Source = () => {
    setScope1Sources(prev => [...prev, {
      type: 'scope1',
      id: uuidv4(),
      data: {
        fuelType: 'DIESEL',
        quantity: 0,
        unit: 'L',
        periodType: periodType
      }
    }]);
  };

  // Aggiungere una nuova fonte di emissione per Scope 2
  const addScope2Source = () => {
    setScope2Sources(prev => [...prev, {
      type: 'scope2',
      id: uuidv4(),
      data: {
        energyType: 'ELECTRICITY_IT',
        quantity: 0,
        unit: 'kWh',
        renewablePercentage: 0.41, // Default per il mix energetico italiano
        periodType: periodType
      }
    }]);
  };

  // Aggiungere una nuova fonte di emissione per Scope 3
  const addScope3Source = () => {
    setScope3Sources(prev => [...prev, {
      type: 'scope3',
      id: uuidv4(),
      data: {
        activityType: 'FREIGHT_ROAD',
        quantity: 0,
        unit: 'km',
        secondaryQuantity: 0,
        secondaryUnit: 't',
        periodType: periodType
      }
    }]);
  };

  // Rimuovere una fonte di emissione per Scope 1
  const removeScope1Source = (sourceId: string) => {
    if (scope1Sources.length > 1) {
      setScope1Sources(prev => prev.filter(source => source.id !== sourceId));
    }
  };

  // Rimuovere una fonte di emissione per Scope 2
  const removeScope2Source = (sourceId: string) => {
    if (scope2Sources.length > 1) {
      setScope2Sources(prev => prev.filter(source => source.id !== sourceId));
    }
  };

  // Rimuovere una fonte di emissione per Scope 3
  const removeScope3Source = (sourceId: string) => {
    if (scope3Sources.length > 1) {
      setScope3Sources(prev => prev.filter(source => source.id !== sourceId));
    }
  };

  // Calcolo delle emissioni Scope 1
  const calculateAndSaveScope1Emissions = () => {
    try {
      // Verifica che tutte le fonti abbiano dati validi
      for (const source of scope1Sources) {
        if (!source.data.fuelType || !source.data.quantity) {
          setScope1Error('Inserisci sia il tipo di combustibile che la quantità per tutte le fonti');
          return;
        }
      }
      
      // Calcola le emissioni per ogni fonte
      let totalEmissions = 0;
      const updatedSources = scope1Sources.map(source => {
        const emissions = calculateScope1Emissions(
          source.data.fuelType as FuelType,
          Number(source.data.quantity),
          source.data.unit
        );
        totalEmissions += emissions;
        return { ...source, calculatedEmissions: emissions };
      });
      
      // Aggiorna lo stato con le fonti calcolate
      setScope1Sources(updatedSources);
      
      // Converti in tonnellate se superiore a 1000kg
      const formattedEmissions = totalEmissions >= 1000 
        ? (totalEmissions / 1000).toFixed(2) 
        : (totalEmissions / 1000).toFixed(3);
      
      // Aggiorna lo stato con il risultato delle emissioni
      handleChange('totalScope1Emissions', formattedEmissions);
      
      // Memorizza i dettagli del calcolo per trasparenza
      handleChange('scope1CalculationDetails', JSON.stringify({
        sources: updatedSources.map(s => ({
          ...s.data,
          emissionsKg: s.calculatedEmissions,
          emissionsTonnes: s.calculatedEmissions ? s.calculatedEmissions / 1000 : 0,
        })),
        totalEmissionsKg: totalEmissions,
        totalEmissionsTonnes: totalEmissions / 1000,
        calculationDate: new Date().toISOString(),
        sourceDetails: updatedSources.map(s => getEmissionFactorSource(s.data.fuelType))
      }));
      
      // Mostra messaggio di successo
      setScope1Error(null);
    } catch (error) {
      console.error("Errore nel calcolo delle emissioni Scope 1:", error);
      setScope1Error('Errore nel calcolo delle emissioni. Verifica i dati inseriti.');
    }
  };

  // Calcolo delle emissioni Scope 2
  const calculateAndSaveScope2Emissions = () => {
    try {
      // Verifica che tutte le fonti abbiano dati validi
      for (const source of scope2Sources) {
        if (!source.data.energyType || !source.data.quantity) {
          setScope2Error('Inserisci sia il tipo di energia che la quantità per tutte le fonti');
          return;
        }
      }
      
      // Calcola le emissioni per ogni fonte
      let totalEmissions = 0;
      const updatedSources = scope2Sources.map(source => {
        const emissions = calculateScope2Emissions(
          source.data.energyType as EnergyType,
          Number(source.data.quantity),
          source.data.unit,
          source.data.renewablePercentage
        );
        totalEmissions += emissions;
        return { ...source, calculatedEmissions: emissions };
      });
      
      // Aggiorna lo stato con le fonti calcolate
      setScope2Sources(updatedSources);
      
      // Converti in tonnellate se superiore a 1000kg
      const formattedEmissions = totalEmissions >= 1000 
        ? (totalEmissions / 1000).toFixed(2) 
        : (totalEmissions / 1000).toFixed(3);
      
      // Aggiorna lo stato con il risultato delle emissioni
      handleChange('totalScope2Emissions', formattedEmissions);
      
      // Memorizza i dettagli del calcolo per trasparenza
      handleChange('scope2CalculationDetails', JSON.stringify({
        sources: updatedSources.map(s => ({
          ...s.data,
          emissionsKg: s.calculatedEmissions,
          emissionsTonnes: s.calculatedEmissions ? s.calculatedEmissions / 1000 : 0,
        })),
        totalEmissionsKg: totalEmissions,
        totalEmissionsTonnes: totalEmissions / 1000,
        calculationDate: new Date().toISOString(),
        sourceDetails: updatedSources.map(s => getEmissionFactorSource(s.data.energyType))
      }));
      
      // Mostra messaggio di successo
      setScope2Error(null);
    } catch (error) {
      console.error("Errore nel calcolo delle emissioni Scope 2:", error);
      setScope2Error('Errore nel calcolo delle emissioni. Verifica i dati inseriti.');
    }
  };

  // Calcolo delle emissioni Scope 3
  const calculateAndSaveScope3Emissions = () => {
    try {
      // Verifica che tutte le fonti abbiano dati validi
      for (const source of scope3Sources) {
        if (!source.data.activityType || !source.data.quantity) {
          setScope3Error('Inserisci sia il tipo di attività che la quantità per tutte le fonti');
          return;
        }
      }
      
      // Calcola le emissioni per ogni fonte
      let totalEmissions = 0;
      const updatedSources = scope3Sources.map(source => {
        const emissions = calculateScope3Emissions(
          source.data.activityType,
          Number(source.data.quantity),
          source.data.unit,
          source.data.secondaryQuantity ? Number(source.data.secondaryQuantity) : undefined,
          source.data.secondaryUnit
        );
        totalEmissions += emissions;
        return { ...source, calculatedEmissions: emissions };
      });
      
      // Aggiorna lo stato con le fonti calcolate
      setScope3Sources(updatedSources);
      
      // Converti in tonnellate se superiore a 1000kg
      const formattedEmissions = totalEmissions >= 1000 
        ? (totalEmissions / 1000).toFixed(2) 
        : (totalEmissions / 1000).toFixed(3);
      
      // Aggiorna lo stato con il risultato delle emissioni
      handleChange('totalScope3Emissions', formattedEmissions);
      
      // Memorizza i dettagli del calcolo per trasparenza
      handleChange('scope3CalculationDetails', JSON.stringify({
        sources: updatedSources.map(s => ({
          ...s.data,
          emissionsKg: s.calculatedEmissions,
          emissionsTonnes: s.calculatedEmissions ? s.calculatedEmissions / 1000 : 0,
        })),
        totalEmissionsKg: totalEmissions,
        totalEmissionsTonnes: totalEmissions / 1000,
        calculationDate: new Date().toISOString(),
        sourceDetails: updatedSources.map(s => getEmissionFactorSource(s.data.activityType))
      }));
      
      // Mostra messaggio di successo
      setScope3Error(null);
    } catch (error) {
      console.error("Errore nel calcolo delle emissioni Scope 3:", error);
      setScope3Error('Errore nel calcolo delle emissioni. Verifica i dati inseriti.');
    }
  };

  // Calcola le emissioni totali da tutti gli scope
  const calculateTotalEmissions = () => {
    try {
      // Ottieni i valori da formValues o usa 0 se non disponibili
      const scope1 = parseFloat(formValues.environmentalMetrics?.totalScope1Emissions || '0');
      const scope2 = parseFloat(formValues.environmentalMetrics?.totalScope2Emissions || '0');
      const scope3 = parseFloat(formValues.environmentalMetrics?.totalScope3Emissions || '0');
      
      // Calcola il totale
      const total = scope1 + scope2 + scope3;
      
      // Aggiorna il totale
      handleChange('totalScopeEmissions', total.toFixed(2));
    } catch (error) {
      console.error("Errore nel calcolo delle emissioni totali:", error);
    }
  };

  // Quando cambia qualsiasi valore di Scope, aggiorna il totale
  useEffect(() => {
    calculateTotalEmissions();
  }, [formValues.environmentalMetrics?.totalScope1Emissions, 
      formValues.environmentalMetrics?.totalScope2Emissions, 
      formValues.environmentalMetrics?.totalScope3Emissions]);

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
      
      {/* Selettore del periodo per tutti i calcoli */}
      <div className="mb-4">
        <Label htmlFor="period-type" className="mb-2 inline-block">Periodo di riferimento</Label>
        <Select 
          value={periodType} 
          onValueChange={(value) => {
            setPeriodType(value as PeriodType);
            scope1Sources.forEach(source => {
              handleScope1SourceChange(source.id, 'periodType', value as PeriodType);
            });
            scope2Sources.forEach(source => {
              handleScope2SourceChange(source.id, 'periodType', value as PeriodType);
            });
            scope3Sources.forEach(source => {
              handleScope3SourceChange(source.id, 'periodType', value as PeriodType);
            });
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
      
      {/* Emissioni Scope 1 */}
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
        
        {scope1Sources.map((source, index) => (
          <div key={source.id} className="mb-4 p-3 border border-gray-100 rounded-md bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h5 className="font-medium text-gray-700">Fonte di emissione {index + 1}</h5>
              {scope1Sources.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeScope1Source(source.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`fuelType-${source.id}`}>Tipo di combustibile</Label>
                <Select 
                  value={source.data.fuelType} 
                  onValueChange={(value) => handleScope1SourceChange(source.id, 'fuelType', value)}
                >
                  <SelectTrigger id={`fuelType-${source.id}`} className="w-full">
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
                <Label htmlFor={`quantity-${source.id}`}>Quantità</Label>
                <Input
                  type="number"
                  id={`quantity-${source.id}`}
                  value={source.data.quantity || ''}
                  onChange={(e) => handleScope1SourceChange(source.id, 'quantity', e.target.value)}
                  placeholder="es. 1000"
                />
              </div>
              
              <div>
                <Label htmlFor={`unit-${source.id}`}>Unità</Label>
                <Select 
                  value={source.data.unit} 
                  onValueChange={(value) => handleScope1SourceChange(source.id, 'unit', value)}
                >
                  <SelectTrigger id={`unit-${source.id}`} className="w-full">
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
          </div>
        ))}
        
        <div className="mt-2 mb-4">
          <Button 
            onClick={addScope1Source} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1 text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            <PlusCircle className="h-4 w-4" /> Aggiungi fonte di emissione
          </Button>
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
            <h5 className="font-medium mb-2">Dettagli sui fattori di emissione</h5>
            <div className="text-sm text-gray-600">
              {scope1Sources.map((source, index) => (
                <div key={`source-details-${source.id}`} className="mb-2">
                  <p>
                    <strong>Fonte {index + 1}:</strong> {getEmissionFactorSource(source.data.fuelType)?.name || 'Non disponibile'}
                    {getEmissionFactorSource(source.data.fuelType) && (
                      <a 
                        href={getEmissionFactorSource(source.data.fuelType)?.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-500 hover:underline"
                      >
                        Visualizza fonte
                      </a>
                    )}
                  </p>
                </div>
              ))}
              <p>Anno di riferimento: 2023</p>
            </div>
          </div>
        )}
      </div>

      {/* Emissioni Scope 2 */}
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
        
        {scope2Sources.map((source, index) => (
          <div key={source.id} className="mb-4 p-3 border border-gray-100 rounded-md bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h5 className="font-medium text-gray-700">Fonte di energia {index + 1}</h5>
              {scope2Sources.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeScope2Source(source.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`energyType-${source.id}`}>Tipo di energia</Label>
                <Select 
                  value={source.data.energyType} 
                  onValueChange={(value) => handleScope2SourceChange(source.id, 'energyType', value)}
                >
                  <SelectTrigger id={`energyType-${source.id}`} className="w-full">
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
                <Label htmlFor={`quantity-${source.id}`}>Quantità</Label>
                <Input
                  type="number"
                  id={`quantity-${source.id}`}
                  value={source.data.quantity || ''}
                  onChange={(e) => handleScope2SourceChange(source.id, 'quantity', e.target.value)}
                  placeholder="es. 2000"
                />
              </div>
              
              <div>
                <Label htmlFor={`unit-${source.id}`}>Unità</Label>
                <Select 
                  value={source.data.unit} 
                  onValueChange={(value) => handleScope2SourceChange(source.id, 'unit', value)}
                >
                  <SelectTrigger id={`unit-${source.id}`} className="w-full">
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
            
            {/* Slider percentuale rinnovabile - Solo per l'elettricità di rete */}
            {(source.data.energyType === 'ELECTRICITY_IT' || source.data.energyType === 'ELECTRICITY_EU') && (
              <div className="mt-4">
                <Label htmlFor={`renewablePercentage-${source.id}`}>
                  Percentuale di energia rinnovabile nel mix energetico: {((source.data.renewablePercentage || 0) * 100).toFixed(0)}%
                </Label>
                <Input
                  type="range"
                  id={`renewablePercentage-${source.id}`}
                  min="0"
                  max="1"
                  step="0.01"
                  value={source.data.renewablePercentage || 0}
                  onChange={(e) => handleScope2SourceChange(source.id, 'renewablePercentage', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>
        ))}
        
        <div className="mt-2 mb-4">
          <Button 
            onClick={addScope2Source} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1 text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            <PlusCircle className="h-4 w-4" /> Aggiungi fonte di energia
          </Button>
        </div>
        
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
            <h5 className="font-medium mb-2">Dettagli sui fattori di emissione</h5>
            <div className="text-sm text-gray-600">
              {scope2Sources.map((source, index) => (
                <div key={`source-details-${source.id}`} className="mb-2">
                  <p>
                    <strong>Fonte {index + 1}:</strong> {getEmissionFactorSource(source.data.energyType)?.name || 'Non disponibile'}
                    {getEmissionFactorSource(source.data.energyType) && (
                      <a 
                        href={getEmissionFactorSource(source.data.energyType)?.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-500 hover:underline"
                      >
                        Visualizza fonte
                      </a>
                    )}
                  </p>
                </div>
              ))}
              <p>Anno di riferimento: 2023</p>
            </div>
          </div>
        )}
      </div>

      {/* Emissioni Scope 3 */}
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
        
        {scope3Sources.map((source, index) => (
          <div key={source.id} className="mb-4 p-3 border border-gray-100 rounded-md bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h5 className="font-medium text-gray-700">Attività {index + 1}</h5>
              {scope3Sources.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeScope3Source(source.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
