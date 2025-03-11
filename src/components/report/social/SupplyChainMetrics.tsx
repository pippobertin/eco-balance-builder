
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HeartHandshake, Info } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

interface SupplyChainMetricsProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  ref?: React.RefObject<HTMLDivElement>;
}

const SupplyChainMetrics: React.FC<SupplyChainMetricsProps> = React.forwardRef<HTMLDivElement, SupplyChainMetricsProps>(
  ({ formValues, handleChange }, ref) => {
    return (
      <GlassmorphicCard>
        <div className="flex items-center mb-4" ref={ref}>
          <HeartHandshake className="mr-2 h-5 w-5 text-orange-500" />
          <h3 className="text-xl font-semibold">B11 - Lavoratori nella catena del valore, comunità e consumatori</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="supplyChainImpactProcess">Processo di identificazione degli impatti sulla catena del valore</Label>
            <Textarea id="supplyChainImpactProcess" name="supplyChainImpactProcess" placeholder="Descrivi il processo per identificare se ci sono lavoratori nella catena del valore, comunità interessate o consumatori e utilizzatori finali che sono o possono essere interessati da impatti negativi relativi alle operazioni dell'impresa." value={formValues.socialMetrics?.supplyChainImpactProcess || ""} onChange={handleChange} className="min-h-[150px]" />
          </div>
          
          <div>
            <Label htmlFor="identifiedImpacts">Impatti identificati</Label>
            <Textarea id="identifiedImpacts" name="identifiedImpacts" placeholder="Se identificati, descrivi i tipi di impatti, compresi i luoghi in cui si verificano e i gruppi che ne sono interessati." value={formValues.socialMetrics?.identifiedImpacts || ""} onChange={handleChange} className="min-h-[150px]" />
          </div>
        </div>
      </GlassmorphicCard>
    );
  }
);

SupplyChainMetrics.displayName = "SupplyChainMetrics";

export default SupplyChainMetrics;
