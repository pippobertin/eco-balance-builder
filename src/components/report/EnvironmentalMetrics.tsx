
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
  Globe
} from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import GHGEmissionsCalculator from './GHGEmissionsCalculator';

interface EnvironmentalMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Metriche Base - Ambiente</h2>
      
      {/* B3 - Energia ed emissioni di gas a effetto serra - Dettagliato */}
      <GHGEmissionsCalculator 
        formValues={formValues} 
        setFormValues={setFormValues} 
      />
      
      {/* B3 - Energia ed emissioni di gas a effetto serra - Semplificato */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Leaf className="mr-2 h-5 w-5 text-green-500" />
          <h3 className="text-xl font-semibold">B3 - Energia ed emissioni di gas a effetto serra (Dati Aggregati)</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-4">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Secondo la guida, il consumo energetico deve essere riportato in termini di energia finale, intesa come quantità di energia fornita all'impresa (es. MWh di energia elettrica acquistati). Le emissioni di gas serra devono essere calcolate seguendo il GHG Protocol.
              </p>
            </div>
          </div>
          
          <h4 className="font-medium text-lg">Consumo energetico</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalEnergyConsumption">Consumo totale di energia (MWh)</Label>
              <Input
                id="totalEnergyConsumption"
                name="totalEnergyConsumption"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.totalEnergyConsumption || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="fossilFuelConsumption">Da combustibili fossili (MWh)</Label>
              <Input
                id="fossilFuelConsumption"
                name="fossilFuelConsumption"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.fossilFuelConsumption || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="renewableElectricity">Energia elettrica da fonti rinnovabili (MWh)</Label>
              <Input
                id="renewableElectricity"
                name="renewableElectricity"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.renewableElectricity || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="nonRenewableElectricity">Energia elettrica da fonti non rinnovabili (MWh)</Label>
              <Input
                id="nonRenewableElectricity"
                name="nonRenewableElectricity"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.nonRenewableElectricity || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <h4 className="font-medium text-lg">Emissioni di gas a effetto serra</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ghgScope1">Emissioni GHG di Ambito 1 (tCO2eq)</Label>
              <Input
                id="ghgScope1"
                name="ghgScope1"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.ghgScope1 || ""}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                Ambito 1: Emissioni dirette da fonti di proprietà o controllate dall'impresa
              </p>
            </div>
            
            <div>
              <Label htmlFor="ghgScope2">Emissioni GHG di Ambito 2 (tCO2eq)</Label>
              <Input
                id="ghgScope2"
                name="ghgScope2"
                type="number"
                placeholder="0.0"
                value={formValues.environmentalMetrics?.ghgScope2 || ""}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                Ambito 2: Emissioni indirette derivanti dall'energia consumata dall'impresa
              </p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="ghgScope3">Emissioni GHG di Ambito 3 (opzionale) (tCO2eq)</Label>
            <Input
              id="ghgScope3"
              name="ghgScope3"
              type="number"
              placeholder="0.0"
              value={formValues.environmentalMetrics?.ghgScope3 || ""}
              onChange={handleChange}
            />
            <p className="text-sm text-gray-500 mt-1">
              Ambito 3: Altre emissioni indirette nella catena del valore (beni e servizi acquistati, trasporti, utilizzo dei prodotti venduti, ecc.)
            </p>
          </div>
        </div>
      </GlassmorphicCard>
      
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
                Riportare solo le sostanze inquinanti che sei tenuto per legge a comunicare alle autorità competenti (ad es. secondo la Industrial Emissions Directive) o che già comunichi in base a un sistema di gestione ambientale come l'EMAS.
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="pollutants">Sostanze inquinanti emesse con relative quantità</Label>
            <Textarea
              id="pollutants"
              name="pollutants"
              placeholder="Formato suggerito: Inquinante | Emissioni (kg) | Mezzo di rilascio (aria, acqua, suolo)
Esempio: Cadmio e suoi composti | 10 | Acqua"
              value={formValues.environmentalMetrics?.pollutants || ""}
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
