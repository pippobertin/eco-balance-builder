import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Leaf, 
  Droplets, 
  Wind, 
  Recycle,
  TreeDeciduous,
  Info,
  Globe,
  Plus,
  Trash2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import GHGEmissionsCalculator from './GHGEmissionsCalculator';

interface PollutantEntry {
  pollutant: string;
  quantity: string;
  unit: string;
  medium: string;
  source: string;
  notes: string;
}

interface EnvironmentalMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const COMMON_POLLUTANTS = [
  "Ossidi di azoto (NOx)",
  "Ossidi di zolfo (SOx)",
  "Particolato (PM10)",
  "Particolato (PM2.5)",
  "Composti organici volatili (VOC)",
  "Monossido di carbonio (CO)",
  "Ammoniaca (NH3)",
  "Metalli pesanti - Piombo",
  "Metalli pesanti - Mercurio",
  "Metalli pesanti - Cadmio",
  "Metalli pesanti - Cromo",
  "Benzene",
  "Idrocarburi policiclici aromatici (IPA)",
  "Altro"
];

const EMISSION_MEDIUMS = [
  "Aria",
  "Acqua",
  "Suolo"
];

const MEASUREMENT_UNITS = [
  "kg/anno",
  "ton/anno",
  "g/anno",
  "mg/l",
  "µg/m³",
  "mg/kg"
];

const EnvironmentalMetrics: React.FC<EnvironmentalMetricsProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      environmentalMetrics: {
        ...prev.environmentalMetrics,
        [name]: value
      }
    }));
  };

  const handlePollutantChange = (index: number, field: keyof PollutantEntry, value: string) => {
    setFormValues((prev: any) => {
      const updatedPollutants = [...(prev.environmentalMetrics.pollutantEntries || [])];
      updatedPollutants[index] = {
        ...updatedPollutants[index],
        [field]: value
      };
      return {
        ...prev,
        environmentalMetrics: {
          ...prev.environmentalMetrics,
          pollutantEntries: updatedPollutants
        }
      };
    });
  };

  const addPollutantEntry = () => {
    setFormValues((prev: any) => ({
      ...prev,
      environmentalMetrics: {
        ...prev.environmentalMetrics,
        pollutantEntries: [
          ...(prev.environmentalMetrics.pollutantEntries || []),
          { pollutant: "", quantity: "", unit: "", medium: "", source: "", notes: "" }
        ]
      }
    }));
  };

  const removePollutantEntry = (index: number) => {
    setFormValues((prev: any) => {
      const updatedPollutants = [...(prev.environmentalMetrics.pollutantEntries || [])];
      updatedPollutants.splice(index, 1);
      return {
        ...prev,
        environmentalMetrics: {
          ...prev.environmentalMetrics,
          pollutantEntries: updatedPollutants
        }
      };
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Metriche Base - Ambiente</h2>
      
      {/* B3 - Energia ed emissioni di gas a effetto serra - Dettagliato */}
      <GHGEmissionsCalculator 
        formValues={formValues} 
        setFormValues={setFormValues} 
      />
      
      {/* B4 - Inquinamento di aria, acqua e suolo */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Wind className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-semibold">B4 - Inquinamento di aria, acqua e suolo</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-4">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Seleziona gli inquinanti dall'elenco predefinito o aggiungi inquinanti personalizzati. Per ciascun inquinante, specifica la quantità, l'unità di misura, il mezzo di rilascio e altre informazioni rilevanti.
              </p>
            </div>
          </div>

          {/* Pollutant Entries */}
          <div className="space-y-6">
            {(formValues.environmentalMetrics?.pollutantEntries || []).map((entry: PollutantEntry, index: number) => (
              <div key={index} className="p-4 border rounded-lg space-y-4 bg-white/50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Inquinante #{index + 1}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePollutantEntry(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo di inquinante</Label>
                    <Select
                      value={entry.pollutant}
                      onValueChange={(value) => handlePollutantChange(index, 'pollutant', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona inquinante" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMON_POLLUTANTS.map((pollutant) => (
                          <SelectItem key={pollutant} value={pollutant}>
                            {pollutant}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Mezzo di rilascio</Label>
                    <Select
                      value={entry.medium}
                      onValueChange={(value) => handlePollutantChange(index, 'medium', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona mezzo" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMISSION_MEDIUMS.map((medium) => (
                          <SelectItem key={medium} value={medium}>
                            {medium}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Quantità</Label>
                    <Input
                      type="number"
                      value={entry.quantity}
                      onChange={(e) => handlePollutantChange(index, 'quantity', e.target.value)}
                      placeholder="Inserisci la quantità"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Unità di misura</Label>
                    <Select
                      value={entry.unit}
                      onValueChange={(value) => handlePollutantChange(index, 'unit', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona unità" />
                      </SelectTrigger>
                      <SelectContent>
                        {MEASUREMENT_UNITS.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Fonte di emissione</Label>
                    <Input
                      value={entry.source}
                      onChange={(e) => handlePollutantChange(index, 'source', e.target.value)}
                      placeholder="Es: Processo produttivo, Caldaia, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Note aggiuntive</Label>
                    <Input
                      value={entry.notes}
                      onChange={(e) => handlePollutantChange(index, 'notes', e.target.value)}
                      placeholder="Eventuali note o dettagli"
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addPollutantEntry}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Aggiungi inquinante
            </Button>
          </div>

          <Separator className="my-6" />

          {/* Additional free-form pollutants section */}
          <div>
            <Label htmlFor="additionalPollutants">Altri inquinanti non presenti nell'elenco</Label>
            <Textarea
              id="additionalPollutants"
              name="additionalPollutants"
              placeholder="Inserisci qui eventuali altri inquinanti non presenti nell'elenco predefinito, specificando quantità e dettagli nel formato che preferisci."
              value={formValues.environmentalMetrics?.additionalPollutants || ""}
              onChange={handleChange}
              className="min-h-[120px]"
            />
          </div>
          
          <div>
            <Label htmlFor="pollutantsDocumentUrl">URL del documento contenente informazioni sulle emissioni inquinanti (opzionale)</Label>
            <Input
              id="pollutantsDocumentUrl"
              name="pollutantsDocumentUrl"
              type="url"
              placeholder="https://example.com/document"
              value={formValues.environmentalMetrics?.pollutantsDocumentUrl || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </GlassmorphicCard>
      
      {/* B5 - Biodiversità */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <TreeDeciduous className="mr-2 h-5 w-5 text-green-600" />
          <h3 className="text-xl font-semibold">B5 - Biodiversità</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-4">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Per "aree sensibili sotto il profilo della biodiversità" si intendono le aree protette a livello europeo o internazionale, come quelle appartenenti alla rete Natura 2000, i siti del patrimonio mondiale dell'UNESCO e le principali aree di biodiversità (KBA).
              </p>
            </div>
          </div>
          
          <h4 className="font-medium text-lg">Siti in aree sensibili</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="biodiversitySitesCount">Numero di siti in aree sensibili sotto il profilo della biodiversità</Label>
              <Input
                id="biodiversitySitesCount"
                name="biodiversitySitesCount"
                type="number"
                placeholder="0"
                value={formValues.environmentalMetrics?.biodiversitySitesCount || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="biodiversitySitesArea">Area totale dei siti (ettari)</Label>
              <Input
                id="biodiversitySitesArea"
                name="biodiversitySitesArea"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.biodiversitySitesArea || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="biodiversitySitesLocations">Posizione dei siti (Paese - Nome del sito)</Label>
            <Textarea
              id="biodiversitySitesLocations"
              name="biodiversitySitesLocations"
              placeholder="Esempio: Italia - Parco Nazionale delle Dolomiti"
              value={formValues.environmentalMetrics?.biodiversitySitesLocations || ""}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
          
          <Separator className="my-4" />
          
          <h4 className="font-medium text-lg">Uso del suolo</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalLandUse">Uso totale del suolo (ettari)</Label>
              <Input
                id="totalLandUse"
                name="totalLandUse"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.totalLandUse || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="totalSealedArea">Superficie totale impermeabilizzata (ettari)</Label>
              <Input
                id="totalSealedArea"
                name="totalSealedArea"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.totalSealedArea || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalNatureOrientedAreaOnsite">Superficie totale orientata alla natura nel sito (ettari)</Label>
              <Input
                id="totalNatureOrientedAreaOnsite"
                name="totalNatureOrientedAreaOnsite"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.totalNatureOrientedAreaOnsite || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="totalNatureOrientedAreaOffsite">Superficie totale orientata alla natura fuori dal sito (ettari)</Label>
              <Input
                id="totalNatureOrientedAreaOffsite"
                name="totalNatureOrientedAreaOffsite"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.totalNatureOrientedAreaOffsite || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </GlassmorphicCard>
      
      {/* B6 - Acqua */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Droplets className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-semibold">B6 - Acqua</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-4">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Il prelievo idrico si riferisce alla quantità di acqua prelevata da qualsiasi fonte. Il consumo idrico è calcolato come differenza tra il prelievo e lo scarico. Per determinare se l'impresa opera in un'area ad elevato stress idrico, consultare le autorità idriche regionali o strumenti come il WRI's Aqueduct Water Risk Atlas.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalWaterWithdrawal">Prelievo idrico totale (m³)</Label>
              <Input
                id="totalWaterWithdrawal"
                name="totalWaterWithdrawal"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.totalWaterWithdrawal || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="waterWithdrawalStressAreas">Prelievo idrico in aree ad elevato stress idrico (m³)</Label>
              <Input
                id="waterWithdrawalStressAreas"
                name="waterWithdrawalStressAreas"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.waterWithdrawalStressAreas || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="waterDischarge">Scarico idrico (m³)</Label>
              <Input
                id="waterDischarge"
                name="waterDischarge"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.waterDischarge || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="waterConsumption">Consumo idrico (m³)</Label>
              <Input
                id="waterConsumption"
                name="waterConsumption"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.waterConsumption || ""}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                Calcolato come differenza tra il prelievo idrico e lo scarico di acqua
              </p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="rainwaterHarvested">Acqua piovana raccolta e utilizzata (m³, opzionale)</Label>
            <Input
              id="rainwaterHarvested"
              name="rainwaterHarvested"
              type="number"
              placeholder="0.0"
              value={formValues.environmentalMetrics?.rainwaterHarvested || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </GlassmorphicCard>
      
      {/* B7 - Uso delle risorse, economia circolare e gestione dei rifiuti */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Recycle className="mr-2 h-5 w-5 text-green-500" />
          <h3 className="text-xl font-semibold">B7 - Uso delle risorse, economia circolare e gestione dei rifiuti</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-4">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                I principi dell'economia circolare includono: eliminare gli sprechi e l'inquinamento, circolare i prodotti e i materiali al loro massimo valore, e rigenerare la natura. Il contenuto riciclato è il rapporto tra materiali riciclati utilizzati e peso totale dei materiali.
              </p>
            </div>
          </div>
          
          <h4 className="font-medium text-lg">Economia circolare nei prodotti</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recycledContentProducts">Contenuto riciclato nei prodotti e imballaggi (%)</Label>
              <Input
                id="recycledContentProducts"
                name="recycledContentProducts"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.recycledContentProducts || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="recyclableContentProducts">Contenuto riciclabile nei prodotti e imballaggi (%)</Label>
              <Input
                id="recyclableContentProducts"
                name="recyclableContentProducts"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.recyclableContentProducts || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <h4 className="font-medium text-lg">Gestione dei rifiuti</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalNonHazardousWaste">Rifiuti non pericolosi totali (kg/ton)</Label>
              <Input
                id="totalNonHazardousWaste"
                name="totalNonHazardousWaste"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.totalNonHazardousWaste || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="totalHazardousWaste">Rifiuti pericolosi totali (kg/ton)</Label>
              <Input
                id="totalHazardousWaste"
                name="totalHazardousWaste"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.totalHazardousWaste || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalWasteRecycledReused">Rifiuti destinati al riciclo o al riutilizzo (kg/ton)</Label>
              <Input
                id="totalWasteRecycledReused"
                name="totalWasteRecycledReused"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.totalWasteRecycledReused || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="totalWasteDisposal">Rifiuti destinati allo smaltimento (kg/ton)</Label>
              <Input
                id="totalWasteDisposal"
                name="totalWasteDisposal"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.totalWasteDisposal || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="wasteTypes">Dettaglio tipi di rifiuti (opzionale)</Label>
            <Textarea
              id="wasteTypes"
              name="wasteTypes"
              placeholder="Esempio: Carta/cartone | 500 | Riciclo
Batterie esauste (pericoloso) | 20 | Smaltimento"
              value={formValues.environmentalMetrics?.wasteTypes || ""}
              onChange={handleChange}
              className="min-h-[120px]"
            />
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default EnvironmentalMetrics;
