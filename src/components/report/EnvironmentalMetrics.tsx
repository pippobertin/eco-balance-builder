import React, { useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Leaf, Wind, Droplets, Factory, Recycle, BatteryCharging, Info } from 'lucide-react';
import GHGEmissionsCalculator from './GHGEmissionsCalculator';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

interface EnvironmentalMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  initialField?: string;
}

const EnvironmentalMetrics: React.FC<EnvironmentalMetricsProps> = ({
  formValues,
  setFormValues,
  initialField
}) => {
  // Add refs for scrolling to specific sections
  const emissionsRef = useRef<HTMLDivElement>(null);
  const energyRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const pollutionRef = useRef<HTMLDivElement>(null);
  const biodiversityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the initial field if provided
    if (initialField) {
      if (initialField === 'emissions' && emissionsRef.current) {
        emissionsRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'energy' && energyRef.current) {
        energyRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'resources' && resourcesRef.current) {
        resourcesRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'pollution' && pollutionRef.current) {
        pollutionRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'biodiversity' && biodiversityRef.current) {
        biodiversityRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialField]);

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

  const handleRadioChange = (name: string, value: string) => {
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
      
      {/* Gas a effetto serra */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4" ref={emissionsRef}>
          <Factory className="mr-2 h-5 w-5 text-red-500" />
          <h3 className="text-xl font-semibold">B3 - Emissioni di gas a effetto serra (GHG)</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md mb-4 bg-red-200">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-600">
                Le emissioni di gas serra (GHG) sono espresse in tonnellate di CO2 equivalente (CO2e).
              </p>
            </div>
          </div>

          <GHGEmissionsCalculator formValues={formValues} setFormValues={setFormValues} />
          
          <div>
            <Label htmlFor="ghgEmissionsScope1">Emissioni Scope 1 (tonnellate CO2e)</Label>
            <Input id="ghgEmissionsScope1" name="ghgEmissionsScope1" type="number" placeholder="0.0" value={formValues.environmentalMetrics?.ghgEmissionsScope1 || ""} onChange={handleChange} />
          </div>
          
          <div>
            <Label htmlFor="ghgEmissionsScope2">Emissioni Scope 2 (tonnellate CO2e)</Label>
            <Input id="ghgEmissionsScope2" name="ghgEmissionsScope2" type="number" placeholder="0.0" value={formValues.environmentalMetrics?.ghgEmissionsScope2 || ""} onChange={handleChange} />
          </div>
          
          <div>
            <Label htmlFor="ghgEmissionsScope3">Emissioni Scope 3 (tonnellate CO2e)</Label>
            <Input id="ghgEmissionsScope3" name="ghgEmissionsScope3" type="number" placeholder="0.0" value={formValues.environmentalMetrics?.ghgEmissionsScope3 || ""} onChange={handleChange} />
          </div>
          
          <div>
            <Label htmlFor="ghgEmissionsDetails">Dettagli sulle emissioni (opzionale)</Label>
            <Textarea id="ghgEmissionsDetails" name="ghgEmissionsDetails" placeholder="Fornisci dettagli aggiuntivi sulle emissioni di gas serra, se applicabile." value={formValues.environmentalMetrics?.ghgEmissionsDetails || ""} onChange={handleChange} className="min-h-[120px]" />
          </div>
        </div>
      </GlassmorphicCard>
      
      {/* Energy */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4" ref={energyRef}>
          <BatteryCharging className="mr-2 h-5 w-5 text-yellow-500" />
          <h3 className="text-xl font-semibold">B4 - Energia</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md mb-4 bg-yellow-100">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-600">
                L'energia è espressa in megajoule (MJ).
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalEnergyConsumption">Consumo energetico totale (MJ)</Label>
              <Input id="totalEnergyConsumption" name="totalEnergyConsumption" type="number" placeholder="0.0" value={formValues.environmentalMetrics?.totalEnergyConsumption || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="renewableEnergyConsumption">Consumo di energia rinnovabile (MJ)</Label>
              <Input id="renewableEnergyConsumption" name="renewableEnergyConsumption" type="number" placeholder="0.0" value={formValues.environmentalMetrics?.renewableEnergyConsumption || ""} onChange={handleChange} />
            </div>
          </div>
          
          <div>
            <Label htmlFor="energyConsumptionDetails">Dettagli sul consumo energetico (opzionale)</Label>
            <Textarea id="energyConsumptionDetails" name="energyConsumptionDetails" placeholder="Fornisci dettagli aggiuntivi sul consumo energetico, se applicabile." value={formValues.environmentalMetrics?.energyConsumptionDetails || ""} onChange={handleChange} className="min-h-[120px]" />
          </div>
        </div>
      </GlassmorphicCard>
      
      {/* Resources */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4" ref={resourcesRef}>
          <Recycle className="mr-2 h-5 w-5 text-green-500" />
          <h3 className="text-xl font-semibold">B5 - Materiali, acqua e uso del suolo</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md mb-4 bg-green-100">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-600">
                I materiali sono espressi in chilogrammi (kg), l'acqua in metri cubi (m³) e l'uso del suolo in metri quadri (m²).
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="materialsConsumption">Consumo di materiali (kg)</Label>
              <Input id="materialsConsumption" name="materialsConsumption" type="number" placeholder="0.0" value={formValues.environmentalMetrics?.materialsConsumption || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="waterConsumption">Consumo di acqua (m³)</Label>
              <Input id="waterConsumption" name="waterConsumption" type="number" placeholder="0.0" value={formValues.environmentalMetrics?.waterConsumption || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="landUse">Uso del suolo (m²)</Label>
              <Input id="landUse" name="landUse" type="number" placeholder="0.0" value={formValues.environmentalMetrics?.landUse || ""} onChange={handleChange} />
            </div>
          </div>
          
          <div>
            <Label htmlFor="resourceConsumptionDetails">Dettagli sul consumo di risorse (opzionale)</Label>
            <Textarea id="resourceConsumptionDetails" name="resourceConsumptionDetails" placeholder="Fornisci dettagli aggiuntivi sul consumo di risorse, se applicabile." value={formValues.environmentalMetrics?.resourceConsumptionDetails || ""} onChange={handleChange} className="min-h-[120px]" />
          </div>
        </div>
      </GlassmorphicCard>
      
      {/* Pollution */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4" ref={pollutionRef}>
          <Wind className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-semibold">B6 - Inquinamento</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md mb-4 bg-blue-100">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-600">
                L'inquinamento è espresso in chilogrammi (kg).
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="airPollution">Inquinamento atmosferico (kg)</Label>
              <Input id="airPollution" name="airPollution" type="number" placeholder="0.0" value={formValues.environmentalMetrics?.airPollution || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="waterPollution">Inquinamento idrico (kg)</Label>
              <Input id="waterPollution" name="waterPollution" type="number" placeholder="0.0" value={formValues.environmentalMetrics?.waterPollution || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="soilPollution">Inquinamento del suolo (kg)</Label>
              <Input id="soilPollution" name="soilPollution" type="number" placeholder="0.0" value={formValues.environmentalMetrics?.soilPollution || ""} onChange={handleChange} />
            </div>
          </div>
          
          <div>
            <Label htmlFor="pollutionDetails">Dettagli sull'inquinamento (opzionale)</Label>
            <Textarea id="pollutionDetails" name="pollutionDetails" placeholder="Fornisci dettagli aggiuntivi sull'inquinamento, se applicabile." value={formValues.environmentalMetrics?.pollutionDetails || ""} onChange={handleChange} className="min-h-[120px]" />
          </div>
        </div>
      </GlassmorphicCard>
      
      {/* Biodiversity */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4" ref={biodiversityRef}>
          <Leaf className="mr-2 h-5 w-5 text-emerald-500" />
          <h3 className="text-xl font-semibold">B7 - Biodiversità e ecosistemi</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md mb-4 bg-emerald-100">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-600">
                La biodiversità è espressa in ettari (ha).
              </p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="landImpactedByBusiness">Superficie totale (ettari) di aree protette e ad alta biodiversità interessate dalle attività dell'organizzazione</Label>
            <Input id="landImpactedByBusiness" name="landImpactedByBusiness" type="number" placeholder="0.0" value={formValues.environmentalMetrics?.landImpactedByBusiness || ""} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="biodiversityDetails">Dettagli sulla biodiversità (opzionale)</Label>
            <Textarea id="biodiversityDetails" name="biodiversityDetails" placeholder="Fornisci dettagli aggiuntivi sulla biodiversità, se applicabile." value={formValues.environmentalMetrics?.biodiversityDetails || ""} onChange={handleChange} className="min-h-[120px]" />
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default EnvironmentalMetrics;
