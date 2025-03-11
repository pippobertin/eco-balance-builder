
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, Info } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

type SupplyChainMetricsProps = {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const SupplyChainMetrics = React.forwardRef<HTMLDivElement, SupplyChainMetricsProps>(
  ({ formValues, handleChange }, ref) => {
    return (
      <GlassmorphicCard>
        <div className="flex items-center mb-4" ref={ref}>
          <Link className="mr-2 h-5 w-5 text-purple-500" />
          <h3 className="text-xl font-semibold">B11 - Lavoratori nella catena del valore, comunità e consumatori</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md mb-4 bg-blue-100">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-600">
                L'impresa può indicare se dispone di un processo per identificare se ci sono lavoratori nella catena del valore, comunità interessate o consumatori e utilizzatori finali che sono interessati o possono essere interessati da impatti negativi relativi alle operazioni dell'impresa.
              </p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="supplyChainImpactProcess">Processo di identificazione degli impatti sulla catena del valore</Label>
            <Textarea 
              id="supplyChainImpactProcess" 
              name="supplyChainImpactProcess" 
              placeholder="Descrivi il processo per identificare se ci sono lavoratori nella catena del valore, comunità interessate o consumatori e utilizzatori finali che sono o possono essere interessati da impatti negativi relativi alle operazioni dell'impresa." 
              value={formValues.socialMetrics?.supplyChainImpactProcess || ""} 
              onChange={handleChange} 
              className="min-h-[150px]" 
            />
          </div>
          
          <div>
            <Label htmlFor="identifiedImpacts">Impatti identificati</Label>
            <Textarea 
              id="identifiedImpacts" 
              name="identifiedImpacts" 
              placeholder="Se identificati, descrivi i tipi di impatti, compresi i luoghi in cui si verificano e i gruppi che ne sono interessati." 
              value={formValues.socialMetrics?.identifiedImpacts || ""} 
              onChange={handleChange} 
              className="min-h-[150px]" 
            />
          </div>
        </div>
      </GlassmorphicCard>
    );
  }
);

SupplyChainMetrics.displayName = "SupplyChainMetrics";

export default SupplyChainMetrics;
