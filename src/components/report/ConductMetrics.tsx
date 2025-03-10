
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, ShieldAlert } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

interface ConductMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const ConductMetrics: React.FC<ConductMetricsProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      conductMetrics: {
        ...prev.conductMetrics,
        [name]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Metriche Base - Condotta delle Imprese</h2>
      
      {/* B12 - Condanne e sanzioni per corruzione attiva e passiva */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Building2 className="mr-2 h-5 w-5 text-purple-500" />
          <h3 className="text-xl font-semibold">B12 - Condanne e sanzioni per corruzione attiva e passiva</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="corruptionConvictionsNumber">Numero di condanne per corruzione nel periodo di riferimento</Label>
              <Input
                id="corruptionConvictionsNumber"
                name="corruptionConvictionsNumber"
                type="number"
                placeholder="0"
                value={formValues.conductMetrics?.corruptionConvictionsNumber || ""}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="corruptionSanctionsAmount">Importo totale delle sanzioni per corruzione (€)</Label>
              <Input
                id="corruptionSanctionsAmount"
                name="corruptionSanctionsAmount"
                type="number"
                placeholder="0.0"
                value={formValues.conductMetrics?.corruptionSanctionsAmount || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="corruptionDetails">Dettagli sulle condanne e sanzioni (opzionale)</Label>
            <Textarea
              id="corruptionDetails"
              name="corruptionDetails"
              placeholder="Fornisci dettagli aggiuntivi sulle condanne e sanzioni per corruzione, se applicabile."
              value={formValues.conductMetrics?.corruptionDetails || ""}
              onChange={handleChange}
              className="min-h-[120px]"
            />
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default ConductMetrics;
