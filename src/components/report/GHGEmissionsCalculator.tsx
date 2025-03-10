
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Factory, 
  Car,
  Bolt,
  Truck,
  Package,
  Droplet, // Changed Water to Droplet as it doesn't exist in lucide-react
  Trash,
  Info,
  Plus,
  Check,
  X
} from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

interface GHGEmissionsCalculatorProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const GHGEmissionsCalculator: React.FC<GHGEmissionsCalculatorProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  const [activeTab, setActiveTab] = useState("common");
  
  // Funzione per gestire i cambiamenti nei dati comuni
  const handleCommonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      environmentalMetrics: {
        ...prev.environmentalMetrics,
        ghgEmissions: {
          ...prev.environmentalMetrics?.ghgEmissions,
          common: {
            ...prev.environmentalMetrics?.ghgEmissions?.common,
            [name]: value
          }
        }
      }
    }));
  };
  
  // Funzione per gestire i cambiamenti nei dati Scope 1
  const handleScope1Change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, category?: string, index?: number) => {
    const { name, value } = e.target;
    
    if (category && index !== undefined) {
      // Per campi in array come veicoli o combustibili
      setFormValues((prev: any) => {
        const updatedScope1 = { ...prev.environmentalMetrics?.ghgEmissions?.scope1 || {} };
        if (!updatedScope1[category]) updatedScope1[category] = [];
        if (!updatedScope1[category][index]) updatedScope1[category][index] = {};
        updatedScope1[category][index][name] = value;
        
        return {
          ...prev,
          environmentalMetrics: {
            ...prev.environmentalMetrics,
            ghgEmissions: {
              ...prev.environmentalMetrics?.ghgEmissions,
              scope1: updatedScope1
            }
          }
        };
      });
    } else {
      // Per campi diretti in scope1
      setFormValues((prev: any) => ({
        ...prev,
        environmentalMetrics: {
          ...prev.environmentalMetrics,
          ghgEmissions: {
            ...prev.environmentalMetrics?.ghgEmissions,
            scope1: {
              ...prev.environmentalMetrics?.ghgEmissions?.scope1,
              [name]: value
            }
          }
        }
      }));
    }
  };
  
  // Funzione per gestire i cambiamenti nei dati Scope 2
  const handleScope2Change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      environmentalMetrics: {
        ...prev.environmentalMetrics,
        ghgEmissions: {
          ...prev.environmentalMetrics?.ghgEmissions,
          scope2: {
            ...prev.environmentalMetrics?.ghgEmissions?.scope2,
            [name]: value
          }
        }
      }
    }));
  };
  
  // Funzione per gestire i cambiamenti nei dati Scope 3
  const handleScope3Change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, category?: string) => {
    const { name, value } = e.target;
    
    if (category) {
      // Per campi organizzati in categorie
      setFormValues((prev: any) => {
        const updatedScope3 = { ...prev.environmentalMetrics?.ghgEmissions?.scope3 || {} };
        if (!updatedScope3[category]) updatedScope3[category] = {};
        updatedScope3[category][name] = value;
        
        return {
          ...prev,
          environmentalMetrics: {
            ...prev.environmentalMetrics,
            ghgEmissions: {
              ...prev.environmentalMetrics?.ghgEmissions,
              scope3: updatedScope3
            }
          }
        };
      });
    } else {
      // Per campi diretti in scope3
      setFormValues((prev: any) => ({
        ...prev,
        environmentalMetrics: {
          ...prev.environmentalMetrics,
          ghgEmissions: {
            ...prev.environmentalMetrics?.ghgEmissions,
            scope3: {
              ...prev.environmentalMetrics?.ghgEmissions?.scope3,
              [name]: value
            }
          }
        }
      }));
    }
  };
  
  // Funzioni per aggiungere elementi a liste (veicoli, combustibili, ecc.)
  const addVehicle = () => {
    setFormValues((prev: any) => {
      const currentVehicles = prev.environmentalMetrics?.ghgEmissions?.scope1?.vehicles || [];
      return {
        ...prev,
        environmentalMetrics: {
          ...prev.environmentalMetrics,
          ghgEmissions: {
            ...prev.environmentalMetrics?.ghgEmissions,
            scope1: {
              ...prev.environmentalMetrics?.ghgEmissions?.scope1,
              vehicles: [...currentVehicles, { type: '', kilometers: '', fuelType: '', fuelConsumption: '' }]
            }
          }
        }
      };
    });
  };
  
  const addFuel = () => {
    setFormValues((prev: any) => {
      const currentFuels = prev.environmentalMetrics?.ghgEmissions?.scope1?.fuels || [];
      return {
        ...prev,
        environmentalMetrics: {
          ...prev.environmentalMetrics,
          ghgEmissions: {
            ...prev.environmentalMetrics?.ghgEmissions,
            scope1: {
              ...prev.environmentalMetrics?.ghgEmissions?.scope1,
              fuels: [...currentFuels, { type: '', quantity: '', unit: '', emissionFactor: '', gwp: '' }]
            }
          }
        }
      };
    });
  };

  const addBusinessTrip = () => {
    setFormValues((prev: any) => {
      const currentTrips = prev.environmentalMetrics?.ghgEmissions?.scope3?.businessTrips || [];
      return {
        ...prev,
        environmentalMetrics: {
          ...prev.environmentalMetrics,
          ghgEmissions: {
            ...prev.environmentalMetrics?.ghgEmissions,
            scope3: {
              ...prev.environmentalMetrics?.ghgEmissions?.scope3,
              businessTrips: [...currentTrips, { type: '', distance: '', unit: '', emissionFactor: '' }]
            }
          }
        }
      };
    });
  };
  
  // Funzioni per rimuovere elementi dalle liste
  const removeVehicle = (index: number) => {
    setFormValues((prev: any) => {
      const currentVehicles = [...(prev.environmentalMetrics?.ghgEmissions?.scope1?.vehicles || [])];
      currentVehicles.splice(index, 1);
      return {
        ...prev,
        environmentalMetrics: {
          ...prev.environmentalMetrics,
          ghgEmissions: {
            ...prev.environmentalMetrics?.ghgEmissions,
            scope1: {
              ...prev.environmentalMetrics?.ghgEmissions?.scope1,
              vehicles: currentVehicles
            }
          }
        }
      };
    });
  };
  
  const removeFuel = (index: number) => {
    setFormValues((prev: any) => {
      const currentFuels = [...(prev.environmentalMetrics?.ghgEmissions?.scope1?.fuels || [])];
      currentFuels.splice(index, 1);
      return {
        ...prev,
        environmentalMetrics: {
          ...prev.environmentalMetrics,
          ghgEmissions: {
            ...prev.environmentalMetrics?.ghgEmissions,
            scope1: {
              ...prev.environmentalMetrics?.ghgEmissions?.scope1,
              fuels: currentFuels
            }
          }
        }
      };
    });
  };

  const removeBusinessTrip = (index: number) => {
    setFormValues((prev: any) => {
      const currentTrips = [...(prev.environmentalMetrics?.ghgEmissions?.scope3?.businessTrips || [])];
      currentTrips.splice(index, 1);
      return {
        ...prev,
        environmentalMetrics: {
          ...prev.environmentalMetrics,
          ghgEmissions: {
            ...prev.environmentalMetrics?.ghgEmissions,
            scope3: {
              ...prev.environmentalMetrics?.ghgEmissions?.scope3,
              businessTrips: currentTrips
            }
          }
        }
      };
    });
  };

  // Recupera i valori attuali dell'oggetto ghgEmissions
  const ghgEmissions = formValues.environmentalMetrics?.ghgEmissions || {
    common: {},
    scope1: { fuels: [], vehicles: [] },
    scope2: {},
    scope3: { businessTrips: [] }
  };

  return (
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <Globe className="mr-2 h-5 w-5 text-blue-500" />
        <h3 className="text-xl font-semibold">Calcolo Dettagliato delle Emissioni GHG</h3>
      </div>
      
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-4">
          <div className="flex items-start">
            <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              In questa sezione puoi inserire i dati dettagliati relativi ai consumi energetici e alle emissioni di gas serra della tua impresa. 
              I dati saranno organizzati secondo le tre categorie di emissioni: Scope 1 (emissioni dirette), Scope 2 (emissioni indirette da energia acquistata) e Scope 3 (altre emissioni indirette).
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="common">Dati Comuni</TabsTrigger>
            <TabsTrigger value="scope1">Scope 1</TabsTrigger>
            <TabsTrigger value="scope2">Scope 2</TabsTrigger>
            <TabsTrigger value="scope3">Scope 3</TabsTrigger>
          </TabsList>

          {/* ========== TAB: DATI COMUNI ========== */}
          <TabsContent value="common" className="space-y-4 pt-4">
            <h4 className="font-medium text-lg">Informazioni Generali</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reportingPeriod">Periodo di riferimento</Label>
                <Select 
                  value={ghgEmissions.common?.reportingPeriod || ""}
                  onValueChange={(value) => handleCommonChange({ target: { name: 'reportingPeriod', value } } as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona un periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">Anno 2024</SelectItem>
                    <SelectItem value="2023">Anno 2023</SelectItem>
                    <SelectItem value="2022">Anno 2022</SelectItem>
                    <SelectItem value="Q1-2024">Q1 2024</SelectItem>
                    <SelectItem value="Q2-2024">Q2 2024</SelectItem>
                    <SelectItem value="Q3-2024">Q3 2024</SelectItem>
                    <SelectItem value="Q4-2023">Q4 2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="operationalUnit">Unità operativa o sede</Label>
                <Input
                  id="operationalUnit"
                  name="operationalUnit"
                  placeholder="Es. Sede centrale, Stabilimento A, ecc."
                  value={ghgEmissions.common?.operationalUnit || ""}
                  onChange={handleCommonChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyIdentifier">Identificativo dell'azienda</Label>
                <Input
                  id="companyIdentifier"
                  name="companyIdentifier"
                  placeholder="Nome o codice dell'azienda"
                  value={ghgEmissions.common?.companyIdentifier || ""}
                  onChange={handleCommonChange}
                />
              </div>
              
              <div>
                <Label htmlFor="calculationMethod">Metodo di calcolo adottato</Label>
                <Select 
                  value={ghgEmissions.common?.calculationMethod || ""}
                  onValueChange={(value) => handleCommonChange({ target: { name: 'calculationMethod', value } } as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona un metodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ghg-protocol">GHG Protocol</SelectItem>
                    <SelectItem value="iso-14064">ISO 14064</SelectItem>
                    <SelectItem value="ipcc">IPCC Guidelines</SelectItem>
                    <SelectItem value="custom">Metodo personalizzato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Note e commenti sul metodo di rilevazione</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Inserisci eventuali note sul metodo di rilevazione dei dati..."
                value={ghgEmissions.common?.notes || ""}
                onChange={handleCommonChange}
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <Label htmlFor="documentationUrl">Link a documentazione o allegati</Label>
              <Input
                id="documentationUrl"
                name="documentationUrl"
                placeholder="URL a documenti o fogli di calcolo"
                value={ghgEmissions.common?.documentationUrl || ""}
                onChange={handleCommonChange}
              />
            </div>
          </TabsContent>

          {/* ========== TAB: SCOPE 1 ========== */}
          <TabsContent value="scope1" className="space-y-4 pt-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md mb-4">
              <div className="flex items-start">
                <Info className="mt-0.5 mr-2 h-4 w-4 text-amber-500" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Lo Scope 1 comprende tutte le emissioni dirette da fonti di proprietà o controllate dall'impresa,
                  come combustibili fossili bruciati in loco, veicoli aziendali e eventuali perdite di gas refrigeranti.
                </p>
              </div>
            </div>

            <h4 className="font-medium text-lg flex items-center">
              <Factory className="mr-2 h-4 w-4" />
              Consumi energetici interni e combustione
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="internalEnergyTotal">Quantità totale di energia generata internamente (MWh)</Label>
                <Input
                  id="internalEnergyTotal"
                  name="internalEnergyTotal"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope1?.internalEnergyTotal || ""}
                  onChange={handleScope1Change}
                />
              </div>
              
              <div>
                <Label htmlFor="energyType">Tipologia principale di energia generata</Label>
                <Select 
                  value={ghgEmissions.scope1?.energyType || ""}
                  onValueChange={(value) => handleScope1Change({ target: { name: 'energyType', value } } as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona tipologia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fossil">Energia da combustibili fossili</SelectItem>
                    <SelectItem value="renewable">Energia da fonti rinnovabili</SelectItem>
                    <SelectItem value="mixed">Mix energetico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Lista di combustibili */}
            <div className="space-y-2 border p-4 rounded-md">
              <div className="flex justify-between items-center">
                <h5 className="font-medium">Dati specifici per combustibile</h5>
                <Button variant="outline" size="sm" onClick={addFuel}>
                  <Plus className="h-4 w-4 mr-1" /> Aggiungi combustibile
                </Button>
              </div>
              
              {(ghgEmissions.scope1?.fuels || []).length === 0 && (
                <p className="text-sm text-gray-500 italic">Nessun combustibile aggiunto</p>
              )}
              
              {(ghgEmissions.scope1?.fuels || []).map((fuel: any, index: number) => (
                <div key={index} className="border p-3 rounded-md bg-gray-50 dark:bg-gray-900">
                  <div className="flex justify-between items-start mb-2">
                    <h6 className="font-medium">Combustibile #{index+1}</h6>
                    <Button variant="ghost" size="sm" onClick={() => removeFuel(index)} className="h-6 w-6 p-0 text-red-500">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <Label htmlFor={`fuel-type-${index}`} className="text-xs">Tipo</Label>
                      <Select 
                        value={fuel.type || ""}
                        onValueChange={(value) => handleScope1Change({ target: { name: 'type', value } } as any, 'fuels', index)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="natural-gas">Gas naturale</SelectItem>
                          <SelectItem value="diesel">Gasolio</SelectItem>
                          <SelectItem value="petrol">Benzina</SelectItem>
                          <SelectItem value="lpg">GPL</SelectItem>
                          <SelectItem value="coal">Carbone</SelectItem>
                          <SelectItem value="other">Altro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`fuel-quantity-${index}`} className="text-xs">Quantità</Label>
                      <Input
                        id={`fuel-quantity-${index}`}
                        name="quantity"
                        type="number"
                        placeholder="0.0"
                        value={fuel.quantity || ""}
                        onChange={(e) => handleScope1Change(e, 'fuels', index)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`fuel-unit-${index}`} className="text-xs">Unità</Label>
                      <Select 
                        value={fuel.unit || ""}
                        onValueChange={(value) => handleScope1Change({ target: { name: 'unit', value } } as any, 'fuels', index)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Unità" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="liters">Litri</SelectItem>
                          <SelectItem value="kg">Kg</SelectItem>
                          <SelectItem value="m3">m³</SelectItem>
                          <SelectItem value="tons">Tonnellate</SelectItem>
                          <SelectItem value="mwh">MWh</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`fuel-ef-${index}`} className="text-xs">Fattore di emissione</Label>
                      <Input
                        id={`fuel-ef-${index}`}
                        name="emissionFactor"
                        placeholder="0.0"
                        value={fuel.emissionFactor || ""}
                        onChange={(e) => handleScope1Change(e, 'fuels', index)}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <Label htmlFor={`fuel-gwp-${index}`} className="text-xs">Valore GWP adottato</Label>
                    <Input
                      id={`fuel-gwp-${index}`}
                      name="gwp"
                      placeholder="Es. 1 per CO2, 28 per CH4, 265 per N2O"
                      value={fuel.gwp || ""}
                      onChange={(e) => handleScope1Change(e, 'fuels', index)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <h4 className="font-medium text-lg flex items-center">
              <Car className="mr-2 h-4 w-4" />
              Flotta Auto Aziendale
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalVehicles">Numero totale di veicoli</Label>
                <Input
                  id="totalVehicles"
                  name="totalVehicles"
                  type="number"
                  placeholder="0"
                  value={ghgEmissions.scope1?.totalVehicles || ""}
                  onChange={handleScope1Change}
                />
              </div>
              
              <div>
                <Label htmlFor="totalVehicleEmissions">Emissioni totali della flotta (tCO2eq)</Label>
                <Input
                  id="totalVehicleEmissions"
                  name="totalVehicleEmissions"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope1?.totalVehicleEmissions || ""}
                  onChange={handleScope1Change}
                />
              </div>
            </div>

            {/* Lista di veicoli */}
            <div className="space-y-2 border p-4 rounded-md">
              <div className="flex justify-between items-center">
                <h5 className="font-medium">Dettaglio veicoli</h5>
                <Button variant="outline" size="sm" onClick={addVehicle}>
                  <Plus className="h-4 w-4 mr-1" /> Aggiungi veicolo
                </Button>
              </div>
              
              {(ghgEmissions.scope1?.vehicles || []).length === 0 && (
                <p className="text-sm text-gray-500 italic">Nessun veicolo aggiunto</p>
              )}
              
              {(ghgEmissions.scope1?.vehicles || []).map((vehicle: any, index: number) => (
                <div key={index} className="border p-3 rounded-md bg-gray-50 dark:bg-gray-900">
                  <div className="flex justify-between items-start mb-2">
                    <h6 className="font-medium">Veicolo #{index+1}</h6>
                    <Button variant="ghost" size="sm" onClick={() => removeVehicle(index)} className="h-6 w-6 p-0 text-red-500">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <Label htmlFor={`vehicle-type-${index}`} className="text-xs">Categoria</Label>
                      <Select 
                        value={vehicle.type || ""}
                        onValueChange={(value) => handleScope1Change({ target: { name: 'type', value } } as any, 'vehicles', index)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="car">Auto</SelectItem>
                          <SelectItem value="van">Furgone</SelectItem>
                          <SelectItem value="truck">Camion</SelectItem>
                          <SelectItem value="bus">Bus</SelectItem>
                          <SelectItem value="other">Altro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`vehicle-kilometers-${index}`} className="text-xs">Km percorsi</Label>
                      <Input
                        id={`vehicle-kilometers-${index}`}
                        name="kilometers"
                        type="number"
                        placeholder="0"
                        value={vehicle.kilometers || ""}
                        onChange={(e) => handleScope1Change(e, 'vehicles', index)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`vehicle-fuelType-${index}`} className="text-xs">Carburante</Label>
                      <Select 
                        value={vehicle.fuelType || ""}
                        onValueChange={(value) => handleScope1Change({ target: { name: 'fuelType', value } } as any, 'vehicles', index)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Carburante" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="petrol">Benzina</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="lpg">GPL</SelectItem>
                          <SelectItem value="electric">Elettrico</SelectItem>
                          <SelectItem value="hybrid">Ibrido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`vehicle-consumption-${index}`} className="text-xs">Consumo (l/100km)</Label>
                      <Input
                        id={`vehicle-consumption-${index}`}
                        name="fuelConsumption"
                        type="number"
                        placeholder="0.0"
                        value={vehicle.fuelConsumption || ""}
                        onChange={(e) => handleScope1Change(e, 'vehicles', index)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <h4 className="font-medium text-lg flex items-center">
              <Factory className="mr-2 h-4 w-4" />
              Altri Processi Diretti
            </h4>
            
            <div>
              <Label htmlFor="otherDirectProcesses">Descrizione dei processi</Label>
              <Textarea
                id="otherDirectProcesses"
                name="otherDirectProcesses"
                placeholder="Descrivi eventuali altri processi industriali che comportano emissioni dirette (es. processi chimici, fumi di combustione, ecc.)"
                value={ghgEmissions.scope1?.otherDirectProcesses || ""}
                onChange={handleScope1Change}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="otherDirectEmissions">Emissioni stimate (tCO2eq)</Label>
                <Input
                  id="otherDirectEmissions"
                  name="otherDirectEmissions"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope1?.otherDirectEmissions || ""}
                  onChange={handleScope1Change}
                />
              </div>
              
              <div>
                <Label htmlFor="otherDirectCalculationMethod">Metodo di calcolo utilizzato</Label>
                <Input
                  id="otherDirectCalculationMethod"
                  name="otherDirectCalculationMethod"
                  placeholder="Es. misurazione diretta, stima basata su fattori di emissione, ecc."
                  value={ghgEmissions.scope1?.otherDirectCalculationMethod || ""}
                  onChange={handleScope1Change}
                />
              </div>
            </div>
          </TabsContent>

          {/* ========== TAB: SCOPE 2 ========== */}
          <TabsContent value="scope2" className="space-y-4 pt-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-4">
              <div className="flex items-start">
                <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Lo Scope 2 comprende le emissioni indirette derivanti dalla generazione di elettricità, vapore, riscaldamento o raffreddamento acquistati e consumati dall'impresa.
                </p>
              </div>
            </div>

            <h4 className="font-medium text-lg flex items-center">
              <Bolt className="mr-2 h-4 w-4" />
              Consumo di Energia Elettrica
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="electricityPurchased">Quantità di energia elettrica acquistata (MWh)</Label>
                <Input
                  id="electricityPurchased"
                  name="electricityPurchased"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope2?.electricityPurchased || ""}
                  onChange={handleScope2Change}
                />
                <p className="text-xs text-gray-500 mt-1">Dato ricavabile dalle bollette elettriche</p>
              </div>
              
              <div>
                <Label htmlFor="electricitySupplier">Identificazione del fornitore</Label>
                <Input
                  id="electricitySupplier"
                  name="electricitySupplier"
                  placeholder="Nome del fornitore di energia elettrica"
                  value={ghgEmissions.scope2?.electricitySupplier || ""}
                  onChange={handleScope2Change}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="renewablePercentage">Percentuale da fonti rinnovabili (%)</Label>
                <Input
                  id="renewablePercentage"
                  name="renewablePercentage"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={ghgEmissions.scope2?.renewablePercentage || ""}
                  onChange={handleScope2Change}
                />
                <p className="text-xs text-gray-500 mt-1">Se noto dal mix energetico del fornitore</p>
              </div>
              
              <div>
                <Label htmlFor="electricityEmissionFactor">Fattore di emissione (tCO2eq/MWh)</Label>
                <Input
                  id="electricityEmissionFactor"
                  name="electricityEmissionFactor"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope2?.electricityEmissionFactor || ""}
                  onChange={handleScope2Change}
                />
              </div>
            </div>

            <Separator className="my-4" />

            <h4 className="font-medium text-lg">Altri Servizi Energetici Acquistati</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="purchasedHeat">Consumo di calore acquistato (MWh)</Label>
                <Input
                  id="purchasedHeat"
                  name="purchasedHeat"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope2?.purchasedHeat || ""}
                  onChange={handleScope2Change}
                />
              </div>
              
              <div>
                <Label htmlFor="purchasedCooling">Consumo di refrigerazione acquistata (MWh)</Label>
                <Input
                  id="purchasedCooling"
                  name="purchasedCooling"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope2?.purchasedCooling || ""}
                  onChange={handleScope2Change}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heatEmissionFactor">Fattore di emissione calore (tCO2eq/MWh)</Label>
                <Input
                  id="heatEmissionFactor"
                  name="heatEmissionFactor"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope2?.heatEmissionFactor || ""}
                  onChange={handleScope2Change}
                />
              </div>
              
              <div>
                <Label htmlFor="coolingEmissionFactor">Fattore di emissione refrigerazione (tCO2eq/MWh)</Label>
                <Input
                  id="coolingEmissionFactor"
                  name="coolingEmissionFactor"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope2?.coolingEmissionFactor || ""}
                  onChange={handleScope2Change}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="scope2CalculationMethod">Metodo di calcolo utilizzato</Label>
              <Select 
                value={ghgEmissions.scope2?.scope2CalculationMethod || ""}
                onValueChange={(value) => handleScope2Change({ target: { name: 'scope2CalculationMethod', value } } as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona metodo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="location-based">Location-based (fattori di emissione medi della rete)</SelectItem>
                  <SelectItem value="market-based">Market-based (fattori specifici del fornitore)</SelectItem>
                  <SelectItem value="hybrid">Metodo ibrido</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Il metodo location-based utilizza fattori di emissione medi della rete, mentre il metodo market-based considera gli accordi contrattuali con i fornitori
              </p>
            </div>
          </TabsContent>

          {/* ========== TAB: SCOPE 3 ========== */}
          <TabsContent value="scope3" className="space-y-4 pt-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md mb-4">
              <div className="flex items-start">
                <Info className="mt-0.5 mr-2 h-4 w-4 text-green-500" />
                <p className="text-sm text-green-800 dark:text-green-200">
                  Lo Scope 3 comprende tutte le altre emissioni indirette che avvengono nella catena del valore dell'impresa, 
                  incluse quelle a monte e a valle delle sue operazioni.
                </p>
              </div>
            </div>

            <h4 className="font-medium text-lg flex items-center">
              <Droplet className="mr-2 h-4 w-4" />
              Consumi di Acqua
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="waterConsumption">Quantità di acqua consumata (m³)</Label>
                <Input
                  id="waterConsumption"
                  name="waterConsumption"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope3?.water?.waterConsumption || ""}
                  onChange={(e) => handleScope3Change(e, 'water')}
                />
                <p className="text-xs text-gray-500 mt-1">Dato ricavabile dalle bollette idriche</p>
              </div>
              
              <div>
                <Label htmlFor="waterEmissionFactor">Fattore di emissione (tCO2eq/m³)</Label>
                <Input
                  id="waterEmissionFactor"
                  name="waterEmissionFactor"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope3?.water?.waterEmissionFactor || ""}
                  onChange={(e) => handleScope3Change(e, 'water')}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="waterStressArea">Prelievo in area a stress idrico (m³)</Label>
                <Input
                  id="waterStressArea"
                  name="waterStressArea"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope3?.water?.waterStressArea || ""}
                  onChange={(e) => handleScope3Change(e, 'water')}
                />
              </div>
              
              <div>
                <Label htmlFor="waterTreatment">Metodo di trattamento delle acque reflue</Label>
                <Input
                  id="waterTreatment"
                  name="waterTreatment"
                  placeholder="Es. depurazione interna, scarico in fognatura, ecc."
                  value={ghgEmissions.scope3?.water?.waterTreatment || ""}
                  onChange={(e) => handleScope3Change(e, 'water')}
                />
              </div>
            </div>

            <Separator className="my-4" />

            <h4 className="font-medium text-lg flex items-center">
              <Truck className="mr-2 h-4 w-4" />
              Trasporti e Viaggi
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalBusinessTravelEmissions">Emissioni totali da viaggi d'affari (tCO2eq)</Label>
                <Input
                  id="totalBusinessTravelEmissions"
                  name="totalBusinessTravelEmissions"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope3?.travel?.totalBusinessTravelEmissions || ""}
                  onChange={(e) => handleScope3Change(e, 'travel')}
                />
              </div>
              
              <div>
                <Label htmlFor="commutingEmissions">Emissioni da pendolarismo dipendenti (tCO2eq)</Label>
                <Input
                  id="commutingEmissions"
                  name="commutingEmissions"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope3?.travel?.commutingEmissions || ""}
                  onChange={(e) => handleScope3Change(e, 'travel')}
                />
              </div>
            </div>

            {/* Lista viaggi d'affari */}
            <div className="space-y-2 border p-4 rounded-md">
              <div className="flex justify-between items-center">
                <h5 className="font-medium">Dettaglio viaggi d'affari</h5>
                <Button variant="outline" size="sm" onClick={addBusinessTrip}>
                  <Plus className="h-4 w-4 mr-1" /> Aggiungi viaggio
                </Button>
              </div>
              
              {(ghgEmissions.scope3?.businessTrips || []).length === 0 && (
                <p className="text-sm text-gray-500 italic">Nessun viaggio aggiunto</p>
              )}
              
              {(ghgEmissions.scope3?.businessTrips || []).map((trip: any, index: number) => (
                <div key={index} className="border p-3 rounded-md bg-gray-50 dark:bg-gray-900">
                  <div className="flex justify-between items-start mb-2">
                    <h6 className="font-medium">Viaggio #{index+1}</h6>
                    <Button variant="ghost" size="sm" onClick={() => removeBusinessTrip(index)} className="h-6 w-6 p-0 text-red-500">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <Label htmlFor={`trip-type-${index}`} className="text-xs">Tipo trasporto</Label>
                      <Select 
                        value={trip.type || ""}
                        onValueChange={(value) => handleScope3Change({ target: { name: 'type', value } } as any, 'businessTrips')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo" />
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
                      <Label htmlFor={`trip-distance-${index}`} className="text-xs">Distanza</Label>
                      <Input
                        id={`trip-distance-${index}`}
                        name="distance"
                        type="number"
                        placeholder="0"
                        value={trip.distance || ""}
                        onChange={(e) => handleScope3Change(e, 'businessTrips')}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`trip-unit-${index}`} className="text-xs">Unità</Label>
                      <Select 
                        value={trip.unit || ""}
                        onValueChange={(value) => handleScope3Change({ target: { name: 'unit', value } } as any, 'businessTrips')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Unità" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="km">km</SelectItem>
                          <SelectItem value="miles">miglia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`trip-ef-${index}`} className="text-xs">Fattore di emissione</Label>
                      <Input
                        id={`trip-ef-${index}`}
                        name="emissionFactor"
                        placeholder="0.0"
                        value={trip.emissionFactor || ""}
                        onChange={(e) => handleScope3Change(e, 'businessTrips')}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <h4 className="font-medium text-lg flex items-center">
              <Package className="mr-2 h-4 w-4" />
              Approvvigionamenti e Fornitura di Materie Prime
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="purchasedGoodsServices">Valore beni e servizi acquistati (€)</Label>
                <Input
                  id="purchasedGoodsServices"
                  name="purchasedGoodsServices"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope3?.supply?.purchasedGoodsServices || ""}
                  onChange={(e) => handleScope3Change(e, 'supply')}
                />
              </div>
              
              <div>
                <Label htmlFor="purchasedGoodsEmissions">Emissioni stimate (tCO2eq)</Label>
                <Input
                  id="purchasedGoodsEmissions"
                  name="purchasedGoodsEmissions"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope3?.supply?.purchasedGoodsEmissions || ""}
                  onChange={(e) => handleScope3Change(e, 'supply')}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="supplyChainDescription">Descrizione della catena di fornitura</Label>
              <Textarea
                id="supplyChainDescription"
                name="supplyChainDescription"
                placeholder="Descrivi le principali componenti della catena di fornitura, inclusi trasporti in entrata, lavorazione materiali, ecc."
                value={ghgEmissions.scope3?.supply?.supplyChainDescription || ""}
                onChange={(e) => handleScope3Change(e, 'supply')}
                className="min-h-[100px]"
              />
            </div>

            <Separator className="my-4" />

            <h4 className="font-medium text-lg flex items-center">
              <Trash className="mr-2 h-4 w-4" />
              Rifiuti e Gestione dei Rifiuti
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalWaste">Quantità totale di rifiuti prodotti (tonnellate)</Label>
                <Input
                  id="totalWaste"
                  name="totalWaste"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope3?.waste?.totalWaste || ""}
                  onChange={(e) => handleScope3Change(e, 'waste')}
                />
              </div>
              
              <div>
                <Label htmlFor="hazardousWaste">Di cui rifiuti pericolosi (tonnellate)</Label>
                <Input
                  id="hazardousWaste"
                  name="hazardousWaste"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope3?.waste?.hazardousWaste || ""}
                  onChange={(e) => handleScope3Change(e, 'waste')}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wasteRecycled">Rifiuti destinati al riciclo (tonnellate)</Label>
                <Input
                  id="wasteRecycled"
                  name="wasteRecycled"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope3?.waste?.wasteRecycled || ""}
                  onChange={(e) => handleScope3Change(e, 'waste')}
                />
              </div>
              
              <div>
                <Label htmlFor="wasteDisposal">Rifiuti destinati allo smaltimento (tonnellate)</Label>
                <Input
                  id="wasteDisposal"
                  name="wasteDisposal"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope3?.waste?.wasteDisposal || ""}
                  onChange={(e) => handleScope3Change(e, 'waste')}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="wasteEmissionFactor">Fattore di emissione medio (tCO2eq/tonnellata)</Label>
              <Input
                id="wasteEmissionFactor"
                name="wasteEmissionFactor"
                type="number"
                placeholder="0.0"
                value={ghgEmissions.scope3?.waste?.wasteEmissionFactor || ""}
                onChange={(e) => handleScope3Change(e, 'waste')}
              />
            </div>

            <Separator className="my-4" />

            <h4 className="font-medium text-lg">Altri Servizi e Attività</h4>
            
            <div>
              <Label htmlFor="otherScope3Activities">Descrizione di altre attività rilevanti</Label>
              <Textarea
                id="otherScope3Activities"
                name="otherScope3Activities"
                placeholder="Descrivi altre attività che generano emissioni di Scope 3, come trasporto prodotti finiti, uso dei prodotti venduti, ecc."
                value={ghgEmissions.scope3?.otherScope3Activities || ""}
                onChange={handleScope3Change}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="otherScope3Emissions">Emissioni stimate (tCO2eq)</Label>
                <Input
                  id="otherScope3Emissions"
                  name="otherScope3Emissions"
                  type="number"
                  placeholder="0.0"
                  value={ghgEmissions.scope3?.otherScope3Emissions || ""}
                  onChange={handleScope3Change}
                />
              </div>
              
              <div>
                <Label htmlFor="scope3CalculationMethod">Metodo di calcolo utilizzato</Label>
                <Input
                  id="scope3CalculationMethod"
                  name="scope3CalculationMethod"
                  placeholder="Es. fattori di emissione, analisi ciclo di vita, ecc."
                  value={ghgEmissions.scope3?.scope3CalculationMethod || ""}
                  onChange={handleScope3Change}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
          <h4 className="font-medium text-lg flex items-center">
            <Check className="mr-2 h-4 w-4 text-green-500" />
            Riepilogo Emissioni GHG
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Scope 1 - Emissioni Dirette</h5>
              <p className="text-2xl font-bold">{ghgEmissions.scope1?.totalDirectEmissions || "0"} <span className="text-sm font-normal">tCO2eq</span></p>
            </div>

            <div className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Scope 2 - Emissioni Indirette (Energia)</h5>
              <p className="text-2xl font-bold">{ghgEmissions.scope2?.totalIndirectEmissions || "0"} <span className="text-sm font-normal">tCO2eq</span></p>
            </div>

            <div className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Scope 3 - Altre Emissioni Indirette</h5>
              <p className="text-2xl font-bold">{ghgEmissions.scope3?.totalScope3Emissions || "0"} <span className="text-sm font-normal">tCO2eq</span></p>
            </div>
          </div>
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default GHGEmissionsCalculator;
