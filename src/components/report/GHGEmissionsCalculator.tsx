
import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plus, Trash2, Info, ArrowRight } from 'lucide-react';
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
  EmissionScope,
  PeriodType,
  EmissionSource,
  Scope1EmissionSource,
  Scope2EmissionSource,
  Scope3EmissionSource,
  FuelType,
  EnergyType,
  TransportType,
  WasteType
} from '@/lib/emissions-types';

interface GHGEmissionsCalculatorProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void);
}

const GHGEmissionsCalculator: React.FC<GHGEmissionsCalculatorProps> = ({ formValues, setFormValues }) => {
  // Stati per le fonti di emissione per ogni scope
  const [scope1Sources, setScope1Sources] = useState<Scope1EmissionSource[]>([]);
  const [scope2Sources, setScope2Sources] = useState<Scope2EmissionSource[]>([]);
  const [scope3Sources, setScope3Sources] = useState<Scope3EmissionSource[]>([]);
  
  // Stato per i totali calcolati
  const [totalScope1Emissions, setTotalScope1Emissions] = useState<number>(0);
  const [totalScope2Emissions, setTotalScope2Emissions] = useState<number>(0);
  const [totalScope3Emissions, setTotalScope3Emissions] = useState<number>(0);
  const [totalEmissions, setTotalEmissions] = useState<number>(0);
  
  // Opzioni disponibili
  const fuelTypes = getAvailableFuelTypes();
  const energyTypes = getAvailableEnergyTypes();
  const scope3Types = getAvailableScope3Types();
  
  // Opzioni per i tipi di veicoli e attività
  const vehicleTypes = [
    { value: 'car', label: 'Auto' },
    { value: 'truck', label: 'Camion' },
    { value: 'van', label: 'Furgone' },
    { value: 'bus', label: 'Autobus' },
    { value: 'motorcycle', label: 'Motocicletta' },
    { value: 'other', label: 'Altro' }
  ];
  
  const transportTypes = [
    { value: 'FREIGHT_ROAD', label: 'Trasporto merci terrestre' },
    { value: 'FREIGHT_RAIL', label: 'Trasporto merci ferroviario' },
    { value: 'FREIGHT_SEA', label: 'Trasporto merci marittimo' },
    { value: 'FREIGHT_AIR', label: 'Trasporto merci aereo' },
    { value: 'BUSINESS_TRAVEL_CAR', label: 'Viaggi di lavoro - Auto' },
    { value: 'BUSINESS_TRAVEL_TRAIN', label: 'Viaggi di lavoro - Treno' },
    { value: 'BUSINESS_TRAVEL_FLIGHT_SHORT', label: 'Viaggi di lavoro - Volo breve (<1500km)' },
    { value: 'BUSINESS_TRAVEL_FLIGHT_LONG', label: 'Viaggi di lavoro - Volo lungo (>1500km)' }
  ];
  
  const wasteTypes = [
    { value: 'WASTE_LANDFILL', label: 'Rifiuti generici - Discarica' },
    { value: 'WASTE_RECYCLED', label: 'Rifiuti riciclati' },
    { value: 'WASTE_INCINERATION', label: 'Rifiuti - Incenerimento' }
  ];
  
  const purchaseTypes = [
    { value: 'PURCHASED_GOODS', label: 'Beni acquistati' },
    { value: 'PURCHASED_SERVICES', label: 'Servizi acquistati' }
  ];
  
  const periodTypes = Object.values(PeriodType).map(type => ({
    value: type,
    label: type === 'ANNUAL' ? 'Annuale' :
           type === 'QUARTERLY' ? 'Trimestrale' :
           type === 'MONTHLY' ? 'Mensile' :
           type === 'WEEKLY' ? 'Settimanale' : 'Giornaliero'
  }));

  // Funzione per aggiungere nuove fonti di emissione
  const addEmissionSource = (scope: number) => {
    if (scope === 1) {
      const newSource: Scope1EmissionSource = {
        id: uuidv4(),
        type: 'scope1',
        fuelType: 'DIESEL',
        quantity: 0,
        unit: 'L',
        category: 'production',
        periodType: PeriodType.ANNUAL
      };
      setScope1Sources(prev => [...prev, newSource]);
    } else if (scope === 2) {
      const newSource: Scope2EmissionSource = {
        id: uuidv4(),
        type: 'scope2',
        energyType: 'ELECTRICITY_IT',
        quantity: 0,
        unit: 'kWh',
        renewablePercentage: 0,
        periodType: PeriodType.ANNUAL
      };
      setScope2Sources(prev => [...prev, newSource]);
    } else if (scope === 3) {
      const newSource: Scope3EmissionSource = {
        id: uuidv4(),
        type: 'scope3',
        activityType: 'FREIGHT_ROAD',
        category: 'transport',
        quantity: 0,
        unit: 'km',
        periodType: PeriodType.ANNUAL
      };
      setScope3Sources(prev => [...prev, newSource]);
    }
  };

  // Funzione per rimuovere fonti di emissione
  const removeEmissionSource = (scope: number, id: string) => {
    if (scope === 1) {
      setScope1Sources(prev => prev.filter(source => source.id !== id));
    } else if (scope === 2) {
      setScope2Sources(prev => prev.filter(source => source.id !== id));
    } else if (scope === 3) {
      setScope3Sources(prev => prev.filter(source => source.id !== id));
    }
  };

  // Funzione per aggiornare i dettagli di una fonte di emissione
  const updateScope1Source = (id: string, updates: Partial<Scope1EmissionSource>) => {
    setScope1Sources(prev => 
      prev.map(source => 
        source.id === id ? { ...source, ...updates } : source
      )
    );
  };

  const updateScope2Source = (id: string, updates: Partial<Scope2EmissionSource>) => {
    setScope2Sources(prev => 
      prev.map(source => 
        source.id === id ? { ...source, ...updates } : source
      )
    );
  };

  const updateScope3Source = (id: string, updates: Partial<Scope3EmissionSource>) => {
    setScope3Sources(prev => 
      prev.map(source => 
        source.id === id ? { ...source, ...updates } : source
      )
    );
  };

  // Helper function to create a synthetic event for form updates
  const createSyntheticEvent = (name: string, value: string): React.ChangeEvent<HTMLInputElement> => {
    return {
      target: {
        name,
        value
      },
    } as React.ChangeEvent<HTMLInputElement>;
  };

  // Funzione per calcolare le emissioni per ogni fonte
  const calculateEmissions = useCallback(() => {
    // Calcola emissioni Scope 1
    let scope1Total = 0;
    const updatedScope1Sources = scope1Sources.map(source => {
      try {
        const emissions = calculateScope1Emissions(
          source.fuelType,
          source.quantity,
          source.unit
        );
        
        scope1Total += emissions / 1000; // Converti da kg a tonnellate
        
        return {
          ...source,
          emissionsKg: emissions,
          emissionsTonnes: emissions / 1000,
          calculationDate: new Date().toISOString(),
          source: getEmissionFactorSource(source.fuelType)
        };
      } catch (error) {
        console.error("Errore nel calcolo delle emissioni Scope 1:", error);
        return source;
      }
    });
    
    setScope1Sources(updatedScope1Sources);
    setTotalScope1Emissions(scope1Total);
    
    // Calcola emissioni Scope 2
    let scope2Total = 0;
    const updatedScope2Sources = scope2Sources.map(source => {
      try {
        const emissions = calculateScope2Emissions(
          source.energyType,
          source.quantity,
          source.unit,
          source.renewablePercentage
        );
        
        scope2Total += emissions / 1000; // Converti da kg a tonnellate
        
        return {
          ...source,
          emissionsKg: emissions,
          emissionsTonnes: emissions / 1000,
          calculationDate: new Date().toISOString(),
          source: getEmissionFactorSource(source.energyType)
        };
      } catch (error) {
        console.error("Errore nel calcolo delle emissioni Scope 2:", error);
        return source;
      }
    });
    
    setScope2Sources(updatedScope2Sources);
    setTotalScope2Emissions(scope2Total);
    
    // Calcola emissioni Scope 3
    let scope3Total = 0;
    const updatedScope3Sources = scope3Sources.map(source => {
      try {
        const emissions = calculateScope3Emissions(
          source.activityType,
          source.quantity,
          source.unit,
          source.secondaryQuantity,
          source.secondaryUnit
        );
        
        scope3Total += emissions / 1000; // Converti da kg a tonnellate
        
        return {
          ...source,
          emissionsKg: emissions,
          emissionsTonnes: emissions / 1000,
          calculationDate: new Date().toISOString(),
          source: getEmissionFactorSource(source.activityType)
        };
      } catch (error) {
        console.error("Errore nel calcolo delle emissioni Scope 3:", error);
        return source;
      }
    });
    
    setScope3Sources(updatedScope3Sources);
    setTotalScope3Emissions(scope3Total);
    
    // Calcola il totale complessivo
    const total = scope1Total + scope2Total + scope3Total;
    setTotalEmissions(total);
    
    // Salva i risultati nei form values
    const emissionsData = {
      scope1CalculationDetails: updatedScope1Sources.length > 0 ? 
        JSON.stringify(updatedScope1Sources[0]) : undefined,
      scope2CalculationDetails: updatedScope2Sources.length > 0 ? 
        JSON.stringify(updatedScope2Sources[0]) : undefined,
      scope3CalculationDetails: updatedScope3Sources.length > 0 ? 
        JSON.stringify(updatedScope3Sources[0]) : undefined,
      totalScope1Emissions: scope1Total.toFixed(2),
      totalScope2Emissions: scope2Total.toFixed(2),
      totalScope3Emissions: scope3Total.toFixed(2),
      totalScopeEmissions: total.toFixed(2)
    };
    
    // Aggiorna il form
    if (typeof setFormValues === 'function') {
      if (setFormValues.length === 1) {
        // Se è una funzione che accetta direttamente un evento
        // Creiamo eventi sintetici per ogni valore
        setFormValues(createSyntheticEvent('totalScope1Emissions', scope1Total.toFixed(2)));
        setFormValues(createSyntheticEvent('totalScope2Emissions', scope2Total.toFixed(2)));
        setFormValues(createSyntheticEvent('totalScope3Emissions', scope3Total.toFixed(2)));
        setFormValues(createSyntheticEvent('totalScopeEmissions', total.toFixed(2)));
      } else {
        // Altrimenti è una funzione di aggiornamento dello stato
        (setFormValues as React.Dispatch<React.SetStateAction<any>>)((prev: any) => ({
          ...prev,
          environmentalMetrics: {
            ...prev.environmentalMetrics,
            ...emissionsData
          }
        }));
      }
    }
  }, [scope1Sources, scope2Sources, scope3Sources, setFormValues]);

  // Esegui il calcolo iniziale quando cambiano le fonti
  useEffect(() => {
    calculateEmissions();
  }, [scope1Sources, scope2Sources, scope3Sources, calculateEmissions]);

  // Inizializza le fonti dai dati esistenti, se presenti
  useEffect(() => {
    const envMetrics = formValues.environmentalMetrics || {};
    
    // Carica i dati di Scope 1 se salvati
    if (envMetrics.scope1CalculationDetails) {
      try {
        const savedScope1 = JSON.parse(envMetrics.scope1CalculationDetails);
        if (savedScope1 && savedScope1.fuelType) {
          setScope1Sources([{
            id: uuidv4(),
            type: 'scope1',
            fuelType: savedScope1.fuelType,
            quantity: parseFloat(savedScope1.quantity),
            unit: savedScope1.unit,
            periodType: savedScope1.periodType || PeriodType.ANNUAL,
            emissionsKg: savedScope1.emissionsKg,
            emissionsTonnes: savedScope1.emissionsTonnes,
            calculationDate: savedScope1.calculationDate,
            source: savedScope1.source
          }]);
        }
      } catch (error) {
        console.error("Errore nel caricamento dei dati di Scope 1:", error);
      }
    }
    
    // Carica i dati di Scope 2 se salvati
    if (envMetrics.scope2CalculationDetails) {
      try {
        const savedScope2 = JSON.parse(envMetrics.scope2CalculationDetails);
        if (savedScope2 && savedScope2.energyType) {
          setScope2Sources([{
            id: uuidv4(),
            type: 'scope2',
            energyType: savedScope2.energyType,
            quantity: parseFloat(savedScope2.quantity),
            unit: savedScope2.unit,
            renewablePercentage: savedScope2.renewablePercentage,
            periodType: savedScope2.periodType || PeriodType.ANNUAL,
            emissionsKg: savedScope2.emissionsKg,
            emissionsTonnes: savedScope2.emissionsTonnes,
            calculationDate: savedScope2.calculationDate,
            source: savedScope2.source
          }]);
        }
      } catch (error) {
        console.error("Errore nel caricamento dei dati di Scope 2:", error);
      }
    }
    
    // Carica i dati di Scope 3 se salvati
    if (envMetrics.scope3CalculationDetails) {
      try {
        const savedScope3 = JSON.parse(envMetrics.scope3CalculationDetails);
        if (savedScope3 && savedScope3.activityType) {
          setScope3Sources([{
            id: uuidv4(),
            type: 'scope3',
            activityType: savedScope3.activityType,
            quantity: parseFloat(savedScope3.quantity),
            unit: savedScope3.unit,
            secondaryQuantity: savedScope3.secondaryQuantity,
            secondaryUnit: savedScope3.secondaryUnit,
            periodType: savedScope3.periodType || PeriodType.ANNUAL,
            emissionsKg: savedScope3.emissionsKg,
            emissionsTonnes: savedScope3.emissionsTonnes,
            calculationDate: savedScope3.calculationDate,
            source: savedScope3.source
          }]);
        }
      } catch (error) {
        console.error("Errore nel caricamento dei dati di Scope 3:", error);
      }
    }
    
    // Carica i totali se salvati
    if (envMetrics.totalScope1Emissions) {
      setTotalScope1Emissions(parseFloat(envMetrics.totalScope1Emissions));
    }
    if (envMetrics.totalScope2Emissions) {
      setTotalScope2Emissions(parseFloat(envMetrics.totalScope2Emissions));
    }
    if (envMetrics.totalScope3Emissions) {
      setTotalScope3Emissions(parseFloat(envMetrics.totalScope3Emissions));
    }
    if (envMetrics.totalScopeEmissions) {
      setTotalEmissions(parseFloat(envMetrics.totalScopeEmissions));
    }
  }, [formValues]);

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-800">Calcolatore di emissioni di gas serra (GHG)</AlertTitle>
        <AlertDescription className="text-blue-600">
          Questo strumento ti aiuta a calcolare le emissioni di gas serra della tua azienda secondo il GHG Protocol.
          I fattori di emissione sono basati su database ufficiali come IPCC, DEFRA e ISPRA.
        </AlertDescription>
      </Alert>
      
      <Accordion type="single" collapsible defaultValue="scope1" className="space-y-4">
        {/* Scope 1 - Emissioni dirette */}
        <AccordionItem value="scope1" className="border rounded-lg p-1">
          <AccordionTrigger className="px-4 py-2 hover:bg-slate-50 rounded-md text-lg font-medium">
            Emissioni Scope 1 (emissioni dirette)
          </AccordionTrigger>
          <AccordionContent className="px-4 pt-2 pb-4">
            <div className="space-y-6">
              {/* Alert informativo per Scope 1 */}
              <Alert className="bg-slate-50">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm text-slate-500">
                  Le emissioni Scope 1 sono emissioni dirette provenienti da fonti di proprietà o controllate dall'azienda,
                  come la combustione di combustibili in impianti fissi o mobili.
                </AlertDescription>
              </Alert>
              
              {/* Fonti di emissione Scope 1 */}
              <div className="space-y-4">
                {scope1Sources.map((source, index) => (
                  <div key={source.id} className="border p-4 rounded-md">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Fonte di emissione #{index + 1}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeEmissionSource(1, source.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Rimuovi
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`scope1-${source.id}-category`} className="mb-1">Categoria</Label>
                        <Select
                          value={source.category || 'production'}
                          onValueChange={(value) => updateScope1Source(source.id, { category: value as 'production' | 'fleet' | 'other' })}
                        >
                          <SelectTrigger id={`scope1-${source.id}-category`} className="bg-white">
                            <SelectValue placeholder="Seleziona categoria" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="production">Combustibile per produzione</SelectItem>
                            <SelectItem value="fleet">Flotta aziendale</SelectItem>
                            <SelectItem value="other">Altro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {source.category === 'fleet' && (
                        <div>
                          <Label htmlFor={`scope1-${source.id}-vehicle-type`} className="mb-1">Tipo di veicolo</Label>
                          <Select
                            value={source.vehicleType || ''}
                            onValueChange={(value) => updateScope1Source(source.id, { vehicleType: value })}
                          >
                            <SelectTrigger id={`scope1-${source.id}-vehicle-type`} className="bg-white">
                              <SelectValue placeholder="Seleziona tipo di veicolo" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {vehicleTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <div>
                        <Label htmlFor={`scope1-${source.id}-fuel-type`} className="mb-1">Tipo di combustibile</Label>
                        <Select
                          value={source.fuelType}
                          onValueChange={(value) => updateScope1Source(source.id, { fuelType: value as FuelType })}
                        >
                          <SelectTrigger id={`scope1-${source.id}-fuel-type`} className="bg-white">
                            <SelectValue placeholder="Seleziona tipo di combustibile" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {fuelTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor={`scope1-${source.id}-quantity`} className="mb-1">Quantità</Label>
                        <Input
                          id={`scope1-${source.id}-quantity`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={source.quantity || ''}
                          onChange={(e) => updateScope1Source(source.id, { quantity: parseFloat(e.target.value) || 0 })}
                          className="bg-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`scope1-${source.id}-unit`} className="mb-1">Unità di misura</Label>
                        <Select
                          value={source.unit}
                          onValueChange={(value) => updateScope1Source(source.id, { unit: value })}
                        >
                          <SelectTrigger id={`scope1-${source.id}-unit`} className="bg-white">
                            <SelectValue placeholder="Seleziona unità" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {getAvailableUnits('FUEL').map(unit => (
                              <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {source.category === 'fleet' && (
                        <>
                          <div>
                            <Label htmlFor={`scope1-${source.id}-kilometers`} className="mb-1">Chilometraggio percorso</Label>
                            <Input
                              id={`scope1-${source.id}-kilometers`}
                              type="number"
                              min="0"
                              step="1"
                              value={source.kilometers || ''}
                              onChange={(e) => updateScope1Source(source.id, { kilometers: parseFloat(e.target.value) || 0 })}
                              className="bg-white"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`scope1-${source.id}-fuel-consumption`} className="mb-1">Consumo di carburante (L/100km)</Label>
                            <Input
                              id={`scope1-${source.id}-fuel-consumption`}
                              type="number"
                              min="0"
                              step="0.1"
                              value={source.fuelConsumption || ''}
                              onChange={(e) => updateScope1Source(source.id, { fuelConsumption: parseFloat(e.target.value) || 0 })}
                              className="bg-white"
                            />
                          </div>
                        </>
                      )}
                      
                      <div>
                        <Label htmlFor={`scope1-${source.id}-period`} className="mb-1">Periodo</Label>
                        <Select
                          value={source.periodType || PeriodType.ANNUAL}
                          onValueChange={(value) => updateScope1Source(source.id, { periodType: value as PeriodType })}
                        >
                          <SelectTrigger id={`scope1-${source.id}-period`} className="bg-white">
                            <SelectValue placeholder="Seleziona periodo" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {periodTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Risultati del calcolo */}
                    {source.emissionsKg && (
                      <div className="mt-4 p-3 bg-green-50 rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="text-green-800 font-medium">Emissioni calcolate:</span>
                          <span className="text-green-700 font-semibold">
                            {source.emissionsTonnes?.toFixed(3)} tonnellate CO₂e
                          </span>
                        </div>
                        {source.source && (
                          <div className="text-xs text-green-600 mt-1">
                            Fonte: {source.source.name} ({source.source.year})
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addEmissionSource(1)}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" /> Aggiungi fonte di emissione Scope 1
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Scope 2 - Emissioni indirette da energia */}
        <AccordionItem value="scope2" className="border rounded-lg p-1">
          <AccordionTrigger className="px-4 py-2 hover:bg-slate-50 rounded-md text-lg font-medium">
            Emissioni Scope 2 (emissioni indirette da energia acquistata)
          </AccordionTrigger>
          <AccordionContent className="px-4 pt-2 pb-4">
            <div className="space-y-6">
              {/* Alert informativo per Scope 2 */}
              <Alert className="bg-slate-50">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm text-slate-500">
                  Le emissioni Scope 2 sono emissioni indirette derivanti dall'acquisto di elettricità, vapore, 
                  riscaldamento o raffreddamento consumati dall'azienda.
                </AlertDescription>
              </Alert>
              
              {/* Fonti di emissione Scope 2 */}
              <div className="space-y-4">
                {scope2Sources.map((source, index) => (
                  <div key={source.id} className="border p-4 rounded-md">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Fonte di energia #{index + 1}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeEmissionSource(2, source.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Rimuovi
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`scope2-${source.id}-energy-type`} className="mb-1">Tipo di energia</Label>
                        <Select
                          value={source.energyType}
                          onValueChange={(value) => updateScope2Source(source.id, { energyType: value as EnergyType })}
                        >
                          <SelectTrigger id={`scope2-${source.id}-energy-type`} className="bg-white">
                            <SelectValue placeholder="Seleziona tipo di energia" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {energyTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor={`scope2-${source.id}-quantity`} className="mb-1">Quantità</Label>
                        <Input
                          id={`scope2-${source.id}-quantity`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={source.quantity || ''}
                          onChange={(e) => updateScope2Source(source.id, { quantity: parseFloat(e.target.value) || 0 })}
                          className="bg-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`scope2-${source.id}-unit`} className="mb-1">Unità di misura</Label>
                        <Select
                          value={source.unit}
                          onValueChange={(value) => updateScope2Source(source.id, { unit: value })}
                        >
                          <SelectTrigger id={`scope2-${source.id}-unit`} className="bg-white">
                            <SelectValue placeholder="Seleziona unità" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {getAvailableUnits('ENERGY').map(unit => (
                              <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor={`scope2-${source.id}-renewable`} className="mb-1">Percentuale rinnovabile (%)</Label>
                        <Input
                          id={`scope2-${source.id}-renewable`}
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={source.renewablePercentage !== undefined ? (source.renewablePercentage * 100).toString() : ''}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            updateScope2Source(source.id, { 
                              renewablePercentage: isNaN(value) ? 0 : value / 100 
                            });
                          }}
                          className="bg-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`scope2-${source.id}-provider`} className="mb-1">Fornitore (opzionale)</Label>
                        <Input
                          id={`scope2-${source.id}-provider`}
                          value={source.provider || ''}
                          onChange={(e) => updateScope2Source(source.id, { provider: e.target.value })}
                          className="bg-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`scope2-${source.id}-period`} className="mb-1">Periodo</Label>
                        <Select
                          value={source.periodType || PeriodType.ANNUAL}
                          onValueChange={(value) => updateScope2Source(source.id, { periodType: value as PeriodType })}
                        >
                          <SelectTrigger id={`scope2-${source.id}-period`} className="bg-white">
                            <SelectValue placeholder="Seleziona periodo" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {periodTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Risultati del calcolo */}
                    {source.emissionsKg && (
                      <div className="mt-4 p-3 bg-green-50 rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="text-green-800 font-medium">Emissioni calcolate:</span>
                          <span className="text-green-700 font-semibold">
                            {source.emissionsTonnes?.toFixed(3)} tonnellate CO₂e
                          </span>
                        </div>
                        {source.source && (
                          <div className="text-xs text-green-600 mt-1">
                            Fonte: {source.source.name} ({source.source.year})
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addEmissionSource(2)}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" /> Aggiungi fonte di energia Scope 2
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Scope 3 - Altre emissioni indirette */}
        <AccordionItem value="scope3" className="border rounded-lg p-1">
          <AccordionTrigger className="px-4 py-2 hover:bg-slate-50 rounded-md text-lg font-medium">
            Emissioni Scope 3 (altre emissioni indirette)
          </AccordionTrigger>
          <AccordionContent className="px-4 pt-2 pb-4">
            <div className="space-y-6">
              {/* Alert informativo per Scope 3 */}
              <Alert className="bg-slate-50">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm text-slate-500">
                  Le emissioni Scope 3 sono tutte le emissioni indirette (non incluse nello Scope 2) che si verificano nella catena del valore dell'azienda,
                  incluse le emissioni a monte e a valle.
                </AlertDescription>
              </Alert>
              
              {/* Fonti di emissione Scope 3 */}
              <div className="space-y-4">
                {scope3Sources.map((source, index) => (
                  <div key={source.id} className="border p-4 rounded-md">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Fonte di emissione indiretta #{index + 1}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeEmissionSource(3, source.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Rimuovi
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`scope3-${source.id}-category`} className="mb-1">Categoria</Label>
                        <Select
                          value={source.category || 'transport'}
                          onValueChange={(value) => updateScope3Source(source.id, { category: value as 'transport' | 'purchases' | 'waste' | 'other' })}
                        >
                          <SelectTrigger id={`scope3-${source.id}-category`} className="bg-white">
                            <SelectValue placeholder="Seleziona categoria" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="transport">Trasporto e Logistica</SelectItem>
                            <SelectItem value="purchases">Acquisto beni e servizi</SelectItem>
                            <SelectItem value="waste">Gestione rifiuti</SelectItem>
                            <SelectItem value="other">Altro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor={`scope3-${source.id}-activity-type`} className="mb-1">Tipo di attività</Label>
                        <Select
                          value={source.activityType || ''}
                          onValueChange={(value) => updateScope3Source(source.id, { activityType: value })}
                        >
                          <SelectTrigger id={`scope3-${source.id}-activity-type`} className="bg-white">
                            <SelectValue placeholder="Seleziona tipo di attività" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {source.category === 'transport' && transportTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                            {source.category === 'waste' && wasteTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                            {source.category === 'purchases' && purchaseTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                            {source.category === 'other' && scope3Types.map(type => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {source.category === 'transport' && (
                        <div>
                          <Label htmlFor={`scope3-${source.id}-vehicle-type`} className="mb-1">Tipo di veicolo/mezzo</Label>
                          <Select
                            value={source.vehicleType || ''}
                            onValueChange={(value) => updateScope3Source(source.id, { vehicleType: value })}
                          >
                            <SelectTrigger id={`scope3-${source.id}-vehicle-type`} className="bg-white">
                              <SelectValue placeholder="Seleziona tipo di veicolo" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {vehicleTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                              ))}
                              <SelectItem value="train">Treno</SelectItem>
                              <SelectItem value="plane">Aereo</SelectItem>
                              <SelectItem value="ship">Nave</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <div>
                        <Label htmlFor={`scope3-${source.id}-quantity`} className="mb-1">{
                          source.category === 'transport' ? 'Distanza percorsa' :
                          source.category === 'waste' ? 'Quantità di rifiuti' :
                          source.category === 'purchases' ? 'Quantità acquistata' :
                          'Quantità'
                        }</Label>
                        <Input
                          id={`scope3-${source.id}-quantity`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={source.quantity || ''}
                          onChange={(e) => updateScope3Source(source.id, { quantity: parseFloat(e.target.value) || 0 })}
                          className="bg-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`scope3-${source.id}-unit`} className="mb-1">Unità di misura</Label>
                        <Select
                          value={source.unit}
                          onValueChange={(value) => updateScope3Source(source.id, { unit: value })}
                        >
                          <SelectTrigger id={`scope3-${source.id}-unit`} className="bg-white">
                            <SelectValue placeholder="Seleziona unità" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {source.category === 'transport' && getAvailableUnits('TRANSPORT').map(unit => (
                              <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
                            ))}
                            {(source.category === 'waste' || source.category === 'purchases') && getAvailableUnits('WASTE').map(unit => (
                              <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
                            ))}
                            {source.category === 'other' && getAvailableUnits('TRANSPORT').map(unit => (
                              <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {source.category === 'transport' && (
                        <>
                          <div>
                            <Label htmlFor={`scope3-${source.id}-secondary-quantity`} className="mb-1">Peso del carico (opzionale)</Label>
                            <Input
                              id={`scope3-${source.id}-secondary-quantity`}
                              type="number"
                              min="0"
                              step="0.01"
                              value={source.secondaryQuantity || ''}
                              onChange={(e) => updateScope3Source(source.id, { secondaryQuantity: parseFloat(e.target.value) || 0 })}
                              className="bg-white"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`scope3-${source.id}-secondary-unit`} className="mb-1">Unità di misura del carico</Label>
                            <Select
                              value={source.secondaryUnit || ''}
                              onValueChange={(value) => updateScope3Source(source.id, { secondaryUnit: value })}
                            >
                              <SelectTrigger id={`scope3-${source.id}-secondary-unit`} className="bg-white">
                                <SelectValue placeholder="Seleziona unità" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                {getAvailableUnits('WASTE').map(unit => (
                                  <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                      
                      <div>
                        <Label htmlFor={`scope3-${source.id}-period`} className="mb-1">Periodo</Label>
                        <Select
                          value={source.periodType || PeriodType.ANNUAL}
                          onValueChange={(value) => updateScope3Source(source.id, { periodType: value as PeriodType })}
                        >
                          <SelectTrigger id={`scope3-${source.id}-period`} className="bg-white">
                            <SelectValue placeholder="Seleziona periodo" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {periodTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Risultati del calcolo */}
                    {source.emissionsKg && (
                      <div className="mt-4 p-3 bg-green-50 rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="text-green-800 font-medium">Emissioni calcolate:</span>
                          <span className="text-green-700 font-semibold">
                            {source.emissionsTonnes?.toFixed(3)} tonnellate CO₂e
                          </span>
                        </div>
                        {source.source && (
                          <div className="text-xs text-green-600 mt-1">
                            Fonte: {source.source.name} ({source.source.year})
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addEmissionSource(3)}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" /> Aggiungi fonte di emissione Scope 3
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Riepilogo delle emissioni */}
      <div className="mt-8 border rounded-lg p-6 bg-white">
        <h3 className="text-xl font-semibold mb-4">Emissioni totali di gas serra</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md p-3 bg-purple-50">
              <div className="text-sm text-purple-700">Scope 1 (emissioni dirette)</div>
              <div className="text-xl font-semibold text-purple-900 mt-1">{totalScope1Emissions.toFixed(2)} tCO₂e</div>
            </div>
            
            <div className="rounded-md p-3 bg-orange-50">
              <div className="text-sm text-orange-700">Scope 2 (energia acquistata)</div>
              <div className="text-xl font-semibold text-orange-900 mt-1">{totalScope2Emissions.toFixed(2)} tCO₂e</div>
            </div>
            
            <div className="rounded-md p-3 bg-blue-50">
              <div className="text-sm text-blue-700">Scope 3 (altre indirette)</div>
              <div className="text-xl font-semibold text-blue-900 mt-1">{totalScope3Emissions.toFixed(2)} tCO₂e</div>
            </div>
            
            <div className="rounded-md p-3 bg-green-50">
              <div className="text-sm text-green-700">Emissioni Totali</div>
              <div className="text-xl font-semibold text-green-900 mt-1">{totalEmissions.toFixed(2)} tCO₂e</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Calcolo aggiornato: {new Date().toLocaleString()}
            </div>
            
            <Button onClick={calculateEmissions} className="bg-green-600 hover:bg-green-700">
              <ArrowRight className="h-4 w-4 mr-1" /> Ricalcola emissioni
            </Button>
          </div>
        </div>
      </div>
      
      {/* Fonti dei fattori di emissione */}
      <div className="mt-4 border rounded-lg p-4 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Fonti dei fattori di emissione</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li><a href="https://www.ipcc-nggip.iges.or.jp/EFDB/main.php" target="_blank" rel="noopener noreferrer" className="underline">IPCC Guidelines</a> - Linee guida internazionali del Gruppo intergovernativo sul cambiamento climatico</li>
          <li><a href="https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023" target="_blank" rel="noopener noreferrer" className="underline">DEFRA (UK)</a> - Fattori di conversione per il reporting dei gas serra</li>
          <li><a href="https://www.isprambiente.gov.it/it/pubblicazioni/manuali-e-linee-guida/fattori-emissione-in-atmosfera" target="_blank" rel="noopener noreferrer" className="underline">ISPRA (Italia)</a> - Fattori di emissione in atmosfera</li>
        </ul>
      </div>
    </div>
  );
};

export default GHGEmissionsCalculator;
