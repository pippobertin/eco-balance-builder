
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wind, Info } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

interface PollutionSectionProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const PollutionSection: React.FC<PollutionSectionProps> = ({
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
        <Wind className="mr-2 h-5 w-5 text-blue-500" />
        <h3 className="text-xl font-semibold">B4 - Inquinamento</h3>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 rounded-md mb-4 bg-blue-100">
          <div className="flex items-start">
            <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
            <p className="text-sm text-slate-600">
              Indica le sostanze inquinanti emesse nell'aria, nell'acqua e nel suolo nel corso delle attività, 
              che sei tenuto per legge a comunicare alle autorità competenti o che già comunichi in base a un 
              sistema di gestione ambientale.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="airPollution">Inquinamento atmosferico (kg)</Label>
            <Input 
              id="airPollution" 
              name="airPollution" 
              type="number" 
              placeholder="0.0" 
              value={formValues.environmentalMetrics?.airPollution || ""} 
              onChange={handleChange} 
            />
          </div>
          
          <div>
            <Label htmlFor="waterPollution">Inquinamento idrico (kg)</Label>
            <Input 
              id="waterPollution" 
              name="waterPollution" 
              type="number" 
              placeholder="0.0" 
              value={formValues.environmentalMetrics?.waterPollution || ""} 
              onChange={handleChange} 
            />
          </div>
          
          <div>
            <Label htmlFor="soilPollution">Inquinamento del suolo (kg)</Label>
            <Input 
              id="soilPollution" 
              name="soilPollution" 
              type="number" 
              placeholder="0.0" 
              value={formValues.environmentalMetrics?.soilPollution || ""} 
              onChange={handleChange} 
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="pollutionDetails">Dettagli sull'inquinamento (opzionale)</Label>
          <Textarea 
            id="pollutionDetails" 
            name="pollutionDetails" 
            placeholder="Fornisci dettagli sulle sostanze inquinanti e sui sistemi di gestione ambientale adottati." 
            value={formValues.environmentalMetrics?.pollutionDetails || ""} 
            onChange={handleChange} 
            className="min-h-[120px]" 
          />
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default PollutionSection;
