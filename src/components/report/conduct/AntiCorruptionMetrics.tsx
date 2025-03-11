
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Info } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

type AntiCorruptionMetricsProps = {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const AntiCorruptionMetrics = React.forwardRef<HTMLDivElement, AntiCorruptionMetricsProps>(
  ({ formValues, handleChange }, ref) => {
    return (
      <GlassmorphicCard>
        <div className="flex items-center mb-4" ref={ref}>
          <Building2 className="mr-2 h-5 w-5 text-purple-500" />
          <h3 className="text-xl font-semibold">B12 - Condanne e sanzioni per corruzione attiva e passiva</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md mb-4 bg-blue-100">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-600">
                In caso di condanne e sanzioni nel periodo di riferimento, indicare il numero di condanne 
                e l'importo totale delle sanzioni pagate per la violazione delle leggi sull'anti-corruzione 
                attiva e passiva.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="antiCorruptionConvictions">Numero di condanne per corruzione</Label>
              <Input 
                id="antiCorruptionConvictions" 
                name="antiCorruptionConvictions" 
                type="number" 
                placeholder="0" 
                value={formValues.conductMetrics?.antiCorruptionConvictions || ""} 
                onChange={handleChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="antiCorruptionSanctions">Importo totale delle sanzioni per corruzione (€)</Label>
              <Input 
                id="antiCorruptionSanctions" 
                name="antiCorruptionSanctions" 
                type="number" 
                placeholder="0.00" 
                value={formValues.conductMetrics?.antiCorruptionSanctions || ""} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="antiCorruptionDetails">Dettagli sulle condanne e sanzioni (opzionale)</Label>
            <Textarea 
              id="antiCorruptionDetails" 
              name="antiCorruptionDetails" 
              placeholder="Fornisci dettagli aggiuntivi sulle condanne e sanzioni per corruzione, se applicabile." 
              value={formValues.conductMetrics?.antiCorruptionDetails || ""} 
              onChange={handleChange} 
              className="min-h-[100px]" 
            />
          </div>
        </div>
      </GlassmorphicCard>
    );
  }
);

AntiCorruptionMetrics.displayName = "AntiCorruptionMetrics";

export default AntiCorruptionMetrics;
