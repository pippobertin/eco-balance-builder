
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Leaf, 
  Droplets, 
  Wind, 
  Tornado, 
  Recycle,
  TreeDeciduous 
} from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

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
      
      {/* B3 - Energia ed emissioni di gas a effetto serra */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Leaf className="mr-2 h-5 w-5 text-green-500" />
          <h3 className="text-xl font-semibold">B3 - Energia ed emissioni di gas a effetto serra</h3>
        </div>
        
        <div className="space-y-4">
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
            </div>
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
          <div>
            <Label htmlFor="pollutants">Sostanze inquinanti emesse con relative quantità</Label>
            <Textarea
              id="pollutants"
              name="pollutants"
              placeholder="Descrivi le sostanze inquinanti emesse nell'aria, nell'acqua e nel suolo e le rispettive quantità."
              value={formValues.environmentalMetrics?.pollutants || ""}
              onChange={handleChange}
              className="min-h-[120px]"
            />
            <p className="text-sm text-gray-500 mt-2">
              Indica le sostanze inquinanti che sei tenuto per legge a comunicare alle autorità competenti o che già comunichi in base a un sistema di gestione ambientale.
            </p>
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
          
          <Separator className="my-4" />
          
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
            <p className="text-sm text-gray-500 mt-2">
              Calcolato come differenza tra il prelievo idrico e lo scarico di acqua dai processi produttivi.
            </p>
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
              <Label htmlFor="recyclableContentProducts">Tassi di contenuto riciclabile nei prodotti e imballaggi (%)</Label>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalNonHazardousWaste">Produzione totale annua di rifiuti non pericolosi (kg/ton)</Label>
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
              <Label htmlFor="totalHazardousWaste">Produzione totale annua di rifiuti pericolosi (kg/ton)</Label>
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
          
          <div>
            <Label htmlFor="totalWasteRecycledReused">Totale dei rifiuti annui destinati al riciclo o al riutilizzo (kg/ton)</Label>
            <Input
              id="totalWasteRecycledReused"
              name="totalWasteRecycledReused"
              type="number"
              placeholder="0.0"
              value={formValues.environmentalMetrics?.totalWasteRecycledReused || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default EnvironmentalMetrics;
