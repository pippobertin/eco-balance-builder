
import React, { useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, ShieldAlert, Info } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

interface ConductMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  initialField?: string;
}

const ConductMetrics: React.FC<ConductMetricsProps> = ({
  formValues,
  setFormValues,
  initialField
}) => {
  // Reference to scroll to initial field if provided
  const corruptionConvictionsRef = useRef<HTMLDivElement>(null);
  const complianceStandardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the initial field if provided
    if (initialField) {
      if (initialField === 'corruptionConvictions' && corruptionConvictionsRef.current) {
        corruptionConvictionsRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'complianceStandards' && complianceStandardsRef.current) {
        complianceStandardsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialField]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      conductMetrics: {
        ...prev.conductMetrics,
        [name]: value
      }
    }));
  };

  return <div className="space-y-6">
      <h2 className="text-2xl font-bold">Metriche Base - Condotta delle Imprese</h2>
      
      {/* B12 - Condanne e sanzioni per corruzione attiva e passiva */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4" ref={corruptionConvictionsRef}>
          <Building2 className="mr-2 h-5 w-5 text-purple-500" />
          <h3 className="text-xl font-semibold">B12 - Condanne e sanzioni per corruzione attiva e passiva</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md mb-4 bg-indigo-400">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-50">
                Le condanne si riferiscono a qualsiasi sentenza di un tribunale penale nei confronti di un individuo o dell'impresa in relazione a un reato connesso alla corruzione. Le sanzioni pecuniarie sono quelle imposte da un tribunale, una commissione o altra autorità governativa.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="corruptionConvictionsNumber">Numero di condanne per corruzione nel periodo di riferimento</Label>
              <Input id="corruptionConvictionsNumber" name="corruptionConvictionsNumber" type="number" placeholder="0" value={formValues.conductMetrics?.corruptionConvictionsNumber || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="corruptionSanctionsAmount">Importo totale delle sanzioni per corruzione (€)</Label>
              <Input id="corruptionSanctionsAmount" name="corruptionSanctionsAmount" type="number" placeholder="0.0" value={formValues.conductMetrics?.corruptionSanctionsAmount || ""} onChange={handleChange} />
            </div>
          </div>
          
          <div>
            <Label htmlFor="corruptionDetails">Dettagli sulle condanne e sanzioni (opzionale)</Label>
            <Textarea id="corruptionDetails" name="corruptionDetails" placeholder="Fornisci dettagli aggiuntivi sulle condanne e sanzioni per corruzione, se applicabile." value={formValues.conductMetrics?.corruptionDetails || ""} onChange={handleChange} className="min-h-[120px]" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="antiCorruptionPolicies">Politiche anti-corruzione in vigore</Label>
              <Textarea id="antiCorruptionPolicies" name="antiCorruptionPolicies" placeholder="Descrivi le politiche anti-corruzione in vigore nell'impresa." value={formValues.conductMetrics?.antiCorruptionPolicies || ""} onChange={handleChange} className="min-h-[100px]" />
            </div>
            
            <div>
              <Label htmlFor="antiCorruptionTraining">Formazione anti-corruzione per i dipendenti</Label>
              <Textarea id="antiCorruptionTraining" name="antiCorruptionTraining" placeholder="Descrivi le attività di formazione anti-corruzione svolte nel periodo di riferimento." value={formValues.conductMetrics?.antiCorruptionTraining || ""} onChange={handleChange} className="min-h-[100px]" />
            </div>
          </div>
        </div>
      </GlassmorphicCard>
      
      {/* Compliance con altri standard di condotta */}
      <GlassmorphicCard>
        <div className="flex items-center mb-4" ref={complianceStandardsRef}>
          <ShieldAlert className="mr-2 h-5 w-5 text-yellow-500" />
          <h3 className="text-xl font-semibold">Compliance con standard di condotta</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md mb-4 bg-indigo-400">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-50">
                Questa sezione è opzionale ma consigliata per fornire informazioni più complete sulla condotta dell'impresa, in particolare riguardo all'allineamento con principi e standard internazionali.
              </p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="complianceStandards">Standard di compliance adottati</Label>
            <Textarea id="complianceStandards" name="complianceStandards" placeholder="Indica se l'impresa aderisce a standard come le Linee guida dell'OCSE per le imprese multinazionali o i Principi guida delle Nazioni Unite su imprese e diritti umani." value={formValues.conductMetrics?.complianceStandards || ""} onChange={handleChange} className="min-h-[120px]" />
          </div>
          
          <div>
            <Label htmlFor="complianceMonitoring">Processi di monitoraggio della compliance</Label>
            <Textarea id="complianceMonitoring" name="complianceMonitoring" placeholder="Descrivi i processi in essere per monitorare la compliance e i meccanismi per gestire lamentele e reclami." value={formValues.conductMetrics?.complianceMonitoring || ""} onChange={handleChange} className="min-h-[120px]" />
          </div>
          
          <div>
            <Label htmlFor="reportedViolations">Violazioni segnalate nell'anno di riferimento</Label>
            <Textarea id="reportedViolations" name="reportedViolations" placeholder="Indica se si sono verificate violazioni dei principi e delle linee guida internazionali in relazione alla propria forza lavoro." value={formValues.conductMetrics?.reportedViolations || ""} onChange={handleChange} className="min-h-[120px]" />
          </div>
        </div>
      </GlassmorphicCard>
    </div>;
};

export default ConductMetrics;
