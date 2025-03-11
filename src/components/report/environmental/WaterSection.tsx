
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Droplets, Info } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

interface WaterSectionProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const WaterSection: React.FC<WaterSectionProps> = ({
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
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <Droplets className="mr-2 h-5 w-5 text-blue-500" />
        <h3 className="text-xl font-semibold">B6 - Acqua</h3>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 rounded-md mb-4 bg-blue-100">
          <div className="flex items-start">
            <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
            <p className="text-sm text-slate-600">
              Indica il prelievo idrico totale, e il consumo idrico (differenza tra prelievo e scarico). 
              I dati sono espressi in metri cubi (m³).
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="waterUsage">Prelievo idrico totale (m³)</Label>
            <Input 
              id="waterUsage" 
              name="waterUsage" 
              type="number" 
              placeholder="0.0" 
              value={formValues.environmentalMetrics?.waterUsage || ""} 
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
          </div>
          
          <div>
            <Label htmlFor="waterStressAreas">Prelievo idrico in aree a elevato stress idrico (m³)</Label>
            <Input 
              id="waterStressAreas" 
              name="waterStressAreas" 
              type="number" 
              placeholder="0.0" 
              value={formValues.environmentalMetrics?.waterStressAreas || ""} 
              onChange={handleChange} 
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="waterDetails">Dettagli sulla gestione dell'acqua (opzionale)</Label>
          <Textarea 
            id="waterDetails" 
            name="waterDetails" 
            placeholder="Fornisci dettagli sulla gestione dell'acqua e sulle pratiche di risparmio idrico" 
            value={formValues.environmentalMetrics?.waterDetails || ""} 
            onChange={handleChange} 
            className="min-h-[120px]" 
          />
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default WaterSection;
