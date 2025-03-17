
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Factory, BatteryCharging, Info } from 'lucide-react';
import GHGEmissionsCalculator from '../GHGEmissionsCalculator';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

interface EmissionsEnergySectionProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void);
}

const EmissionsEnergySection: React.FC<EmissionsEnergySectionProps> = ({
  formValues,
  setFormValues
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Check if setFormValues is a function that accepts an event directly (for location-specific metrics)
    if (typeof setFormValues === 'function' && setFormValues.length === 1) {
      setFormValues(e);
    } else {
      // This is the standard approach for global metrics
      const { name, value } = e.target;
      (setFormValues as React.Dispatch<React.SetStateAction<any>>)((prev: any) => ({
        ...prev,
        environmentalMetrics: {
          ...prev.environmentalMetrics,
          [name]: value
        }
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Gas a effetto serra */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Factory className="mr-2 h-5 w-5 text-red-500" />
          <h3 className="text-xl font-semibold">B3 - Emissioni di gas a effetto serra (GHG) e Energia</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md mb-4 bg-red-200">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-600">
                Le emissioni di gas serra (GHG) sono espresse in tonnellate di CO2 equivalente (CO2e).
                L'energia è espressa in megawattora (MWh).
              </p>
            </div>
          </div>

          <GHGEmissionsCalculator formValues={formValues} setFormValues={setFormValues} />
          
          {/* Energy Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="energyConsumption">Consumo energetico totale (MWh)</Label>
              <Input 
                id="energyConsumption" 
                name="energyConsumption" 
                type="number" 
                placeholder="0.0" 
                value={formValues.environmentalMetrics?.energyConsumption || ""} 
                onChange={handleChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="fossilFuelEnergy">Energia da combustibili fossili (MWh)</Label>
              <Input 
                id="fossilFuelEnergy" 
                name="fossilFuelEnergy" 
                type="number" 
                placeholder="0.0" 
                value={formValues.environmentalMetrics?.fossilFuelEnergy || ""} 
                onChange={handleChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="renewableEnergy">Energia da fonti rinnovabili (MWh)</Label>
              <Input 
                id="renewableEnergy" 
                name="renewableEnergy" 
                type="number" 
                placeholder="0.0" 
                value={formValues.environmentalMetrics?.renewableEnergy || ""} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalScope1Emissions">Emissioni Scope 1 (tonnellate CO2e)</Label>
              <Input 
                id="totalScope1Emissions" 
                name="totalScope1Emissions" 
                type="number" 
                placeholder="0.0" 
                value={formValues.environmentalMetrics?.totalScope1Emissions || ""} 
                onChange={handleChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="totalScope2Emissions">Emissioni Scope 2 (tonnellate CO2e)</Label>
              <Input 
                id="totalScope2Emissions" 
                name="totalScope2Emissions" 
                type="number" 
                placeholder="0.0" 
                value={formValues.environmentalMetrics?.totalScope2Emissions || ""} 
                onChange={handleChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="totalScope3Emissions">Emissioni Scope 3 (tonnellate CO2e)</Label>
              <Input 
                id="totalScope3Emissions" 
                name="totalScope3Emissions" 
                type="number" 
                placeholder="0.0" 
                value={formValues.environmentalMetrics?.totalScope3Emissions || ""} 
                onChange={handleChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="totalScopeEmissions">Emissioni Totali (tonnellate CO2e)</Label>
              <Input 
                id="totalScopeEmissions" 
                name="totalScopeEmissions" 
                type="number" 
                placeholder="0.0" 
                value={formValues.environmentalMetrics?.totalScopeEmissions || ""} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="energyEmissionsDetails">Dettagli su energia ed emissioni (opzionale)</Label>
            <Textarea 
              id="energyEmissionsDetails" 
              name="energyEmissionsDetails" 
              placeholder="Fornisci dettagli aggiuntivi su energia ed emissioni di gas serra, se applicabile." 
              value={formValues.environmentalMetrics?.energyEmissionsDetails || ""} 
              onChange={handleChange} 
              className="min-h-[120px]" 
            />
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default EmissionsEnergySection;
