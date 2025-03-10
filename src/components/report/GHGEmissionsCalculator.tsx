import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Leaf, Car, Factory, Wind, Droplet, BatteryCharging, Trash2, PlusCircle, Info, BarChart3 } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
interface GHGEmissionsCalculatorProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}
interface Vehicle {
  id: string;
  type: string;
  fuelType: string;
  kilometers: string;
  fuelConsumption: string;
  emissionsFactor: string;
}
interface FuelConsumption {
  id: string;
  fuelType: string;
  quantity: string;
  unit: string;
  emissionsFactor: string;
  gwpValue: string;
}
interface BusinessTrip {
  id: string;
  transportType: string;
  distance: string;
  unit: string;
  emissionsFactor: string;
}
interface Scope1Data {
  reportingPeriod: string;
  operationalUnit: string;
  companyIdentifier: string;
  notes: string;
  totalEnergyGenerated: string;
  vehicles: Vehicle[];
  fuels: FuelConsumption[];
  otherDirectProcesses: string;
  calculationMethod: string;
}
interface Scope2Data {
  electricityConsumption: string;
  provider: string;
  energyMix: string;
  emissionsFactor: string;
  otherEnergyServices: string;
}
interface Scope3Data {
  waterConsumption: string;
  businessTrips: BusinessTrip[];
  rawMaterialsInfo: string;
  totalWaste: string;
  hazardousWaste: string;
  recycledWaste: string;
  wasteEmissionsFactor: string;
  otherExternalServices: string;
  calculationMethod: string;
}
const GHGEmissionsCalculator: React.FC<GHGEmissionsCalculatorProps> = ({
  formValues,
  setFormValues
}) => {
  const [activeTab, setActiveTab] = useState<'scope1' | 'scope2' | 'scope3'>('scope1');
  const [scope1Data, setScope1Data] = useState<Scope1Data>(() => {
    return formValues.environmentalMetrics?.scope1Data || {
      reportingPeriod: '',
      operationalUnit: '',
      companyIdentifier: '',
      notes: '',
      totalEnergyGenerated: '',
      vehicles: [],
      fuels: [],
      otherDirectProcesses: '',
      calculationMethod: ''
    };
  });
  const [scope2Data, setScope2Data] = useState<Scope2Data>(() => {
    return formValues.environmentalMetrics?.scope2Data || {
      electricityConsumption: '',
      provider: '',
      energyMix: '',
      emissionsFactor: '',
      otherEnergyServices: ''
    };
  });
  const [scope3Data, setScope3Data] = useState<Scope3Data>(() => {
    return formValues.environmentalMetrics?.scope3Data || {
      waterConsumption: '',
      businessTrips: [],
      rawMaterialsInfo: '',
      totalWaste: '',
      hazardousWaste: '',
      recycledWaste: '',
      wasteEmissionsFactor: '',
      otherExternalServices: '',
      calculationMethod: ''
    };
  });
  const [totalScope1Emissions, setTotalScope1Emissions] = useState<number>(0);
  const [totalScope2Emissions, setTotalScope2Emissions] = useState<number>(0);
  const [totalScope3Emissions, setTotalScope3Emissions] = useState<number>(0);

  // Update form values when scope data changes
  useEffect(() => {
    setFormValues(prev => ({
      ...prev,
      environmentalMetrics: {
        ...prev.environmentalMetrics,
        scope1Data,
        scope2Data,
        scope3Data,
        totalScope1Emissions,
        totalScope2Emissions,
        totalScope3Emissions
      }
    }));
  }, [scope1Data, scope2Data, scope3Data, totalScope1Emissions, totalScope2Emissions, totalScope3Emissions, setFormValues]);

  // Calculate emissions when relevant data changes
  useEffect(() => {
    calculateScope1Emissions();
    calculateScope2Emissions();
    calculateScope3Emissions();
  }, [scope1Data, scope2Data, scope3Data]);
  const calculateScope1Emissions = () => {
    let total = 0;

    // Calculate emissions from vehicles
    scope1Data.vehicles.forEach(vehicle => {
      if (vehicle.kilometers && vehicle.fuelConsumption && vehicle.emissionsFactor) {
        const kilometers = parseFloat(vehicle.kilometers);
        const consumption = parseFloat(vehicle.fuelConsumption);
        const factor = parseFloat(vehicle.emissionsFactor);
        if (!isNaN(kilometers) && !isNaN(consumption) && !isNaN(factor)) {
          total += kilometers * consumption * factor / 1000; // Convert to tCO2eq
        }
      }
    });

    // Calculate emissions from fuels
    scope1Data.fuels.forEach(fuel => {
      if (fuel.quantity && fuel.emissionsFactor) {
        const quantity = parseFloat(fuel.quantity);
        const factor = parseFloat(fuel.emissionsFactor);
        const gwp = parseFloat(fuel.gwpValue || '1');
        if (!isNaN(quantity) && !isNaN(factor) && !isNaN(gwp)) {
          total += quantity * factor * gwp / 1000; // Convert to tCO2eq
        }
      }
    });
    setTotalScope1Emissions(parseFloat(total.toFixed(2)));
  };
  const calculateScope2Emissions = () => {
    let total = 0;

    // Calculate emissions from electricity consumption
    if (scope2Data.electricityConsumption && scope2Data.emissionsFactor) {
      const consumption = parseFloat(scope2Data.electricityConsumption);
      const factor = parseFloat(scope2Data.emissionsFactor);
      if (!isNaN(consumption) && !isNaN(factor)) {
        total += consumption * factor; // Already in tCO2eq if factor is in tCO2eq/MWh
      }
    }
    setTotalScope2Emissions(parseFloat(total.toFixed(2)));
  };
  const calculateScope3Emissions = () => {
    let total = 0;

    // Calculate emissions from business trips
    scope3Data.businessTrips.forEach(trip => {
      if (trip.distance && trip.emissionsFactor) {
        const distance = parseFloat(trip.distance);
        const factor = parseFloat(trip.emissionsFactor);
        if (!isNaN(distance) && !isNaN(factor)) {
          total += distance * factor / 1000; // Convert to tCO2eq
        }
      }
    });

    // Calculate emissions from waste if data available
    if (scope3Data.totalWaste && scope3Data.wasteEmissionsFactor) {
      const waste = parseFloat(scope3Data.totalWaste);
      const factor = parseFloat(scope3Data.wasteEmissionsFactor);
      if (!isNaN(waste) && !isNaN(factor)) {
        total += waste * factor; // Already in tCO2eq if factor is in correct units
      }
    }
    setTotalScope3Emissions(parseFloat(total.toFixed(2)));
  };
  const handleScope1Change = (field: keyof Scope1Data, value: string) => {
    setScope1Data(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleScope2Change = (field: keyof Scope2Data, value: string) => {
    setScope2Data(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleScope3Change = (field: keyof Scope3Data, value: string) => {
    setScope3Data(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleVehicleChange = (id: string, field: keyof Vehicle, value: string) => {
    setScope1Data(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(vehicle => vehicle.id === id ? {
        ...vehicle,
        [field]: value
      } : vehicle)
    }));
  };
  const handleFuelChange = (id: string, field: keyof FuelConsumption, value: string) => {
    setScope1Data(prev => ({
      ...prev,
      fuels: prev.fuels.map(fuel => fuel.id === id ? {
        ...fuel,
        [field]: value
      } : fuel)
    }));
  };
  const handleTripChange = (id: string, field: keyof BusinessTrip, value: string) => {
    setScope3Data(prev => ({
      ...prev,
      businessTrips: prev.businessTrips.map(trip => trip.id === id ? {
        ...trip,
        [field]: value
      } : trip)
    }));
  };
  const addVehicle = () => {
    const newVehicle: Vehicle = {
      id: `vehicle-${Date.now()}`,
      type: '',
      fuelType: '',
      kilometers: '',
      fuelConsumption: '',
      emissionsFactor: ''
    };
    setScope1Data(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, newVehicle]
    }));
  };
  const removeVehicle = (id: string) => {
    setScope1Data(prev => ({
      ...prev,
      vehicles: prev.vehicles.filter(vehicle => vehicle.id !== id)
    }));
  };
  const addFuel = () => {
    const newFuel: FuelConsumption = {
      id: `fuel-${Date.now()}`,
      fuelType: '',
      quantity: '',
      unit: '',
      emissionsFactor: '',
      gwpValue: '1'
    };
    setScope1Data(prev => ({
      ...prev,
      fuels: [...prev.fuels, newFuel]
    }));
  };
  const removeFuel = (id: string) => {
    setScope1Data(prev => ({
      ...prev,
      fuels: prev.fuels.filter(fuel => fuel.id !== id)
    }));
  };
  const addBusinessTrip = () => {
    const newTrip: BusinessTrip = {
      id: `trip-${Date.now()}`,
      transportType: '',
      distance: '',
      unit: 'km',
      emissionsFactor: ''
    };
    setScope3Data(prev => ({
      ...prev,
      businessTrips: [...prev.businessTrips, newTrip]
    }));
  };
  const removeBusinessTrip = (id: string) => {
    setScope3Data(prev => ({
      ...prev,
      businessTrips: prev.businessTrips.filter(trip => trip.id !== id)
    }));
  };
  return <GlassmorphicCard className="mb-6">
      <div className="flex items-center mb-4">
        <Leaf className="mr-2 h-5 w-5 text-green-500" />
        <h3 className="text-xl font-semibold">B3 - Energia ed emissioni di gas a effetto serra (Dettagliato)</h3>
      </div>
      
      <div className="p-4 rounded-md mb-6 bg-sky-800">
        <div className="flex items-start">
          <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
          <p className="text-sm text-slate-50">
            Questo calcolatore ti permette di inserire dati dettagliati sui tuoi consumi energetici per calcolare le emissioni di gas a effetto serra secondo lo standard V-SME. I dati sono suddivisi in tre categorie (Scope 1, 2 e 3) in base alla fonte delle emissioni.
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <div className="flex items-center text-green-800 dark:text-green-200 p-3 rounded-lg bg-emerald-800">
            <BarChart3 className="h-5 w-5 mr-2" />
            <div>
              <span className="font-semibold text-lime-50">Totale emissioni GHG: </span>
              <span className="font-bold text-lime-50">{(totalScope1Emissions + totalScope2Emissions + totalScope3Emissions).toFixed(2)} tCO₂eq</span>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <div className="text-blue-800 dark:text-blue-200 px-3 py-2 rounded bg-blue-300">
              <span className="text-sm text-slate-50">Scope 1: <strong>{totalScope1Emissions} tCO₂eq</strong></span>
            </div>
            <div className="text-purple-800 dark:text-purple-200 px-3 py-2 rounded bg-purple-700">
              <span className="text-sm text-slate-50">Scope 2: <strong>{totalScope2Emissions} tCO₂eq</strong></span>
            </div>
            <div className="text-amber-800 dark:text-amber-200 px-3 py-2 rounded bg-green-800">
              <span className="text-sm text-slate-50">Scope 3: <strong>{totalScope3Emissions} tCO₂eq</strong></span>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={value => setActiveTab(value as 'scope1' | 'scope2' | 'scope3')}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="scope1">Scope 1 - Emissioni Dirette</TabsTrigger>
          <TabsTrigger value="scope2">Scope 2 - Energia Acquistata</TabsTrigger>
          <TabsTrigger value="scope3">Scope 3 - Catena del Valore</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scope1" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="reportingPeriod">Periodo di riferimento</Label>
              <Input id="reportingPeriod" value={scope1Data.reportingPeriod} onChange={e => handleScope1Change('reportingPeriod', e.target.value)} placeholder="Es. Anno 2023" />
            </div>
            
            <div>
              <Label htmlFor="operationalUnit">Unità operativa o sede</Label>
              <Input id="operationalUnit" value={scope1Data.operationalUnit} onChange={e => handleScope1Change('operationalUnit', e.target.value)} placeholder="Es. Sede Centrale" />
            </div>
            
            <div>
              <Label htmlFor="companyIdentifier">Identificativo dell'azienda</Label>
              <Input id="companyIdentifier" value={scope1Data.companyIdentifier} onChange={e => handleScope1Change('companyIdentifier', e.target.value)} placeholder="Es. Nome Azienda S.p.A." />
            </div>
            
            <div>
              <Label htmlFor="totalEnergyGenerated">Quantità totale di energia generata internamente (MWh)</Label>
              <Input id="totalEnergyGenerated" type="number" value={scope1Data.totalEnergyGenerated} onChange={e => handleScope1Change('totalEnergyGenerated', e.target.value)} placeholder="0.0" />
            </div>
          </div>
          
          <Accordion type="single" collapsible defaultValue="vehicles">
            <AccordionItem value="vehicles">
              <AccordionTrigger className="font-semibold">
                <div className="flex items-center">
                  <Car className="mr-2 h-4 w-4" />
                  Flotta Auto Aziendale
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {scope1Data.vehicles.map(vehicle => <div key={vehicle.id} className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Veicolo</h4>
                        <Button variant="ghost" size="sm" onClick={() => removeVehicle(vehicle.id)} className="h-8 w-8 p-0 text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`vehicleType-${vehicle.id}`}>Categoria del veicolo</Label>
                          <Select value={vehicle.type} onValueChange={value => handleVehicleChange(vehicle.id, 'type', value)}>
                            <SelectTrigger id={`vehicleType-${vehicle.id}`}>
                              <SelectValue placeholder="Seleziona categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="car">Auto</SelectItem>
                              <SelectItem value="van">Furgone</SelectItem>
                              <SelectItem value="truck">Camion</SelectItem>
                              <SelectItem value="other">Altro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor={`fuelType-${vehicle.id}`}>Tipo di carburante</Label>
                          <Select value={vehicle.fuelType} onValueChange={value => handleVehicleChange(vehicle.id, 'fuelType', value)}>
                            <SelectTrigger id={`fuelType-${vehicle.id}`}>
                              <SelectValue placeholder="Seleziona carburante" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gasoline">Benzina</SelectItem>
                              <SelectItem value="diesel">Diesel</SelectItem>
                              <SelectItem value="lpg">GPL</SelectItem>
                              <SelectItem value="cng">Metano</SelectItem>
                              <SelectItem value="electric">Elettrico</SelectItem>
                              <SelectItem value="hybrid">Ibrido</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor={`kilometers-${vehicle.id}`}>Chilometri percorsi</Label>
                          <Input id={`kilometers-${vehicle.id}`} type="number" value={vehicle.kilometers} onChange={e => handleVehicleChange(vehicle.id, 'kilometers', e.target.value)} placeholder="0" />
                        </div>
                        
                        <div>
                          <Label htmlFor={`fuelConsumption-${vehicle.id}`}>Consumo carburante (l/100km)</Label>
                          <Input id={`fuelConsumption-${vehicle.id}`} type="number" value={vehicle.fuelConsumption} onChange={e => handleVehicleChange(vehicle.id, 'fuelConsumption', e.target.value)} placeholder="0.0" />
                        </div>
                        
                        <div className="col-span-1 md:col-span-2">
                          <Label htmlFor={`emissionsFactor-${vehicle.id}`}>Fattore di emissione (kgCO₂eq/l)</Label>
                          <Input id={`emissionsFactor-${vehicle.id}`} type="number" value={vehicle.emissionsFactor} onChange={e => handleVehicleChange(vehicle.id, 'emissionsFactor', e.target.value)} placeholder="0.0" />
                          <p className="text-xs text-gray-500 mt-1">
                            Esempio: Benzina ~2.3 kgCO₂eq/l, Diesel ~2.7 kgCO₂eq/l
                          </p>
                        </div>
                      </div>
                    </div>)}
                  
                  <Button variant="outline" onClick={addVehicle} className="flex items-center w-full justify-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Aggiungi veicolo
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="fuels">
              <AccordionTrigger className="font-semibold">
                <div className="flex items-center">
                  <Factory className="mr-2 h-4 w-4" />
                  Consumi energetici interni
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {scope1Data.fuels.map(fuel => <div key={fuel.id} className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Combustibile</h4>
                        <Button variant="ghost" size="sm" onClick={() => removeFuel(fuel.id)} className="h-8 w-8 p-0 text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`fuelType-${fuel.id}`}>Tipo di combustibile</Label>
                          <Select value={fuel.fuelType} onValueChange={value => handleFuelChange(fuel.id, 'fuelType', value)}>
                            <SelectTrigger id={`fuelType-${fuel.id}`}>
                              <SelectValue placeholder="Seleziona combustibile" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="natural_gas">Gas naturale</SelectItem>
                              <SelectItem value="lpg">GPL</SelectItem>
                              <SelectItem value="diesel">Gasolio</SelectItem>
                              <SelectItem value="fuel_oil">Olio combustibile</SelectItem>
                              <SelectItem value="coal">Carbone</SelectItem>
                              <SelectItem value="biomass">Biomassa</SelectItem>
                              <SelectItem value="other">Altro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor={`unit-${fuel.id}`}>Unità di misura</Label>
                          <Select value={fuel.unit} onValueChange={value => handleFuelChange(fuel.id, 'unit', value)}>
                            <SelectTrigger id={`unit-${fuel.id}`}>
                              <SelectValue placeholder="Seleziona unità" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="m3">m³ (gas)</SelectItem>
                              <SelectItem value="l">Litri</SelectItem>
                              <SelectItem value="kg">Kg</SelectItem>
                              <SelectItem value="t">Tonnellate</SelectItem>
                              <SelectItem value="kWh">kWh</SelectItem>
                              <SelectItem value="MWh">MWh</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor={`quantity-${fuel.id}`}>Quantità consumata</Label>
                          <Input id={`quantity-${fuel.id}`} type="number" value={fuel.quantity} onChange={e => handleFuelChange(fuel.id, 'quantity', e.target.value)} placeholder="0.0" />
                        </div>
                        
                        <div>
                          <Label htmlFor={`emissionsFactor-${fuel.id}`}>Fattore di emissione (kgCO₂eq/unità)</Label>
                          <Input id={`emissionsFactor-${fuel.id}`} type="number" value={fuel.emissionsFactor} onChange={e => handleFuelChange(fuel.id, 'emissionsFactor', e.target.value)} placeholder="0.0" />
                        </div>
                        
                        <div>
                          <Label htmlFor={`gwpValue-${fuel.id}`}>Valore GWP (potenziale riscaldamento globale)</Label>
                          <Input id={`gwpValue-${fuel.id}`} type="number" value={fuel.gwpValue} onChange={e => handleFuelChange(fuel.id, 'gwpValue', e.target.value)} placeholder="1" />
                          <p className="text-xs text-gray-500 mt-1">
                            Di default 1 per CO₂. Metano: 29.8, N₂O: 273
                          </p>
                        </div>
                      </div>
                    </div>)}
                  
                  <Button variant="outline" onClick={addFuel} className="flex items-center w-full justify-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Aggiungi combustibile
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="otherProcesses">
              <AccordionTrigger className="font-semibold">
                <div className="flex items-center">
                  <Wind className="mr-2 h-4 w-4" />
                  Altri Processi Diretti
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="otherDirectProcesses">Dati relativi a eventuali processi industriali con emissioni dirette</Label>
                    <Textarea id="otherDirectProcesses" value={scope1Data.otherDirectProcesses} onChange={e => handleScope1Change('otherDirectProcesses', e.target.value)} placeholder="Descrivere i processi e le relative emissioni stimate (tCO₂eq)" className="min-h-[100px]" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="calculationMethod">
              <AccordionTrigger className="font-semibold">
                <div className="flex items-center">
                  <Info className="mr-2 h-4 w-4" />
                  Note tecniche e di calcolo
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="calculationMethod">Metodo di calcolo utilizzato</Label>
                    <Textarea id="calculationMethod" value={scope1Data.calculationMethod} onChange={e => handleScope1Change('calculationMethod', e.target.value)} placeholder="Descrivi il metodo di calcolo, le fonti dei fattori di emissione, ecc." className="min-h-[100px]" />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Note e commenti</Label>
                    <Textarea id="notes" value={scope1Data.notes} onChange={e => handleScope1Change('notes', e.target.value)} placeholder="Note sul metodo di rilevazione o altri commenti" className="min-h-[100px]" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        
        <TabsContent value="scope2" className="space-y-6">
          <div className="p-4 border rounded-md bg-purple-50 dark:bg-purple-900/20">
            <h4 className="font-semibold flex items-center mb-2">
              <BatteryCharging className="mr-2 h-4 w-4" />
              Consumo di Energia Elettrica
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="electricityConsumption">Quantità di energia elettrica acquistata (MWh)</Label>
                <Input id="electricityConsumption" type="number" value={scope2Data.electricityConsumption} onChange={e => handleScope2Change('electricityConsumption', e.target.value)} placeholder="0.0" />
                <p className="text-xs text-gray-500 mt-1">
                  Dato generalmente disponibile dalle bollette elettriche
                </p>
              </div>
              
              <div>
                <Label htmlFor="provider">Identificazione del fornitore</Label>
                <Input id="provider" value={scope2Data.provider} onChange={e => handleScope2Change('provider', e.target.value)} placeholder="Es. Nome del fornitore di energia" />
              </div>
              
              <div>
                <Label htmlFor="energyMix">Mix energetico del fornitore (% rinnovabili)</Label>
                <Input id="energyMix" value={scope2Data.energyMix} onChange={e => handleScope2Change('energyMix', e.target.value)} placeholder="Es. 30% rinnovabile, 70% non rinnovabile" />
              </div>
              
              <div>
                <Label htmlFor="emissionsFactor">Fattore di emissione (tCO₂eq/MWh)</Label>
                <Input id="emissionsFactor" type="number" value={scope2Data.emissionsFactor} onChange={e => handleScope2Change('emissionsFactor', e.target.value)} placeholder="0.0" />
                <p className="text-xs text-gray-500 mt-1">
                  Media italiana: ~0.35 tCO₂eq/MWh. Varia in base al fornitore e al mix energetico.
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <Label htmlFor="otherEnergyServices">Altri servizi energetici acquistati</Label>
              <Textarea id="otherEnergyServices" value={scope2Data.otherEnergyServices} onChange={e => handleScope2Change('otherEnergyServices', e.target.value)} placeholder="Es. calore o refrigerazione acquistata da terzi" className="min-h-[100px]" />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="scope3" className="space-y-6">
          <Accordion type="single" collapsible defaultValue="water">
            <AccordionItem value="water">
              <AccordionTrigger className="font-semibold">
                <div className="flex items-center">
                  <Droplet className="mr-2 h-4 w-4" />
                  Consumi di Acqua
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="waterConsumption">Quantità di acqua consumata (m³)</Label>
                    <Input id="waterConsumption" type="number" value={scope3Data.waterConsumption} onChange={e => handleScope3Change('waterConsumption', e.target.value)} placeholder="0.0" />
                    <p className="text-xs text-gray-500 mt-1">
                      Dato generalmente disponibile dalle bollette idriche
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="businessTrips">
              <AccordionTrigger className="font-semibold">
                <div className="flex items-center">
                  <Car className="mr-2 h-4 w-4" />
                  Trasporti e Viaggi d'affari
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {scope3Data.businessTrips.map(trip => <div key={trip.id} className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Viaggio</h4>
                        <Button variant="ghost" size="sm" onClick={() => removeBusinessTrip(trip.id)} className="h-8 w-8 p-0 text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`transportType-${trip.id}`}>Tipo di trasporto</Label>
                          <Select value={trip.transportType} onValueChange={value => handleTripChange(trip.id, 'transportType', value)}>
                            <SelectTrigger id={`transportType-${trip.id}`}>
                              <SelectValue placeholder="Seleziona tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="plane">Aereo</SelectItem>
                              <SelectItem value="train">Treno</SelectItem>
                              <SelectItem value="car">Auto</SelectItem>
                              <SelectItem value="taxi">Taxi</SelectItem>
                              <SelectItem value="bus">Bus</SelectItem>
                              <SelectItem value="other">Altro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor={`distance-${trip.id}`}>Distanza percorsa</Label>
                          <Input id={`distance-${trip.id}`} type="number" value={trip.distance} onChange={e => handleTripChange(trip.id, 'distance', e.target.value)} placeholder="0" />
                        </div>
                        
                        <div>
                          <Label htmlFor={`unit-${trip.id}`}>Unità di misura</Label>
                          <Select value={trip.unit} onValueChange={value => handleTripChange(trip.id, 'unit', value)}>
                            <SelectTrigger id={`unit-${trip.id}`}>
                              <SelectValue placeholder="Seleziona unità" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="km">km</SelectItem>
                              <SelectItem value="mi">miglia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor={`emissionsFactor-${trip.id}`}>Fattore di emissione (gCO₂eq/km)</Label>
                          <Input id={`emissionsFactor-${trip.id}`} type="number" value={trip.emissionsFactor} onChange={e => handleTripChange(trip.id, 'emissionsFactor', e.target.value)} placeholder="0.0" />
                          <p className="text-xs text-gray-500 mt-1">
                            Aereo: ~150-250 gCO₂eq/km, Treno: ~30-60 gCO₂eq/km, Auto: ~120-200 gCO₂eq/km
                          </p>
                        </div>
                      </div>
                    </div>)}
                  
                  <Button variant="outline" onClick={addBusinessTrip} className="flex items-center w-full justify-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Aggiungi viaggio
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="materials">
              <AccordionTrigger className="font-semibold">
                <div className="flex items-center">
                  <Factory className="mr-2 h-4 w-4" />
                  Materie Prime e Approvvigionamenti
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rawMaterialsInfo">Informazioni su approvvigionamenti e catena di fornitura</Label>
                    <Textarea id="rawMaterialsInfo" value={scope3Data.rawMaterialsInfo} onChange={e => handleScope3Change('rawMaterialsInfo', e.target.value)} placeholder="Dettagli sugli acquisti, trasporti in entrata, lavorazione, ecc." className="min-h-[100px]" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="waste">
              <AccordionTrigger className="font-semibold">
                <div className="flex items-center">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Rifiuti e Gestione dei Rifiuti
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="totalWaste">Quantità totale di rifiuti prodotti (t)</Label>
                      <Input id="totalWaste" type="number" value={scope3Data.totalWaste} onChange={e => handleScope3Change('totalWaste', e.target.value)} placeholder="0.0" />
                    </div>
                    
                    <div>
                      <Label htmlFor="hazardousWaste">Rifiuti pericolosi (t)</Label>
                      <Input id="hazardousWaste" type="number" value={scope3Data.hazardousWaste} onChange={e => handleScope3Change('hazardousWaste', e.target.value)} placeholder="0.0" />
                    </div>
                    
                    <div>
                      <Label htmlFor="recycledWaste">Rifiuti destinati al riciclo o riutilizzo (t)</Label>
                      <Input id="recycledWaste" type="number" value={scope3Data.recycledWaste} onChange={e => handleScope3Change('recycledWaste', e.target.value)} placeholder="0.0" />
                    </div>
                    
                    <div>
                      <Label htmlFor="wasteEmissionsFactor">Fattore di emissione rifiuti (tCO₂eq/t)</Label>
                      <Input id="wasteEmissionsFactor" type="number" value={scope3Data.wasteEmissionsFactor} onChange={e => handleScope3Change('wasteEmissionsFactor', e.target.value)} placeholder="0.0" />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="otherServices">
              <AccordionTrigger className="font-semibold">
                <div className="flex items-center">
                  <Info className="mr-2 h-4 w-4" />
                  Altri Consumi e Servizi Esterni
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="otherExternalServices">Informazioni su altri servizi esterni</Label>
                    <Textarea id="otherExternalServices" value={scope3Data.otherExternalServices} onChange={e => handleScope3Change('otherExternalServices', e.target.value)} placeholder="Dettagli su manutenzione, outsourcing, consulenze, trasporto prodotti finiti, ecc." className="min-h-[100px]" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="calculationMethod">
              <AccordionTrigger className="font-semibold">
                <div className="flex items-center">
                  <Info className="mr-2 h-4 w-4" />
                  Note tecniche e di calcolo
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="calculationMethod">Metodo di calcolo utilizzato</Label>
                    <Textarea id="calculationMethod" value={scope3Data.calculationMethod} onChange={e => handleScope3Change('calculationMethod', e.target.value)} placeholder="Descrivi il metodo di calcolo, le fonti dei fattori di emissione, ecc." className="min-h-[100px]" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </GlassmorphicCard>;
};
export default GHGEmissionsCalculator;