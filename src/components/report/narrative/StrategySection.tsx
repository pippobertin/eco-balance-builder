
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BriefcaseBusiness } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import SaveButton from './components/SaveButton';
import SectionAutoSaveIndicator from '../environmental/components/SectionAutoSaveIndicator';
import { useStrategyData } from './hooks/strategy/useStrategyData';
import { useStrategyLoad } from './hooks/strategy/useStrategyLoad';
import { useStrategySave } from './hooks/strategy/useStrategySave';

interface StrategySectionProps {
  reportId: string;
}

const StrategySection: React.FC<StrategySectionProps> = ({ reportId }) => {
  const { 
    formData, 
    setFormData, 
    isLoading, 
    setIsLoading, 
    lastSaved, 
    setLastSaved, 
    needsSaving, 
    setNeedsSaving 
  } = useStrategyData(reportId);
  
  // Load data
  useStrategyLoad(reportId, setFormData, setIsLoading, setLastSaved, setNeedsSaving);
  
  // Get save function
  const { saveData, isSaving } = useStrategySave(reportId, formData, setLastSaved);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setNeedsSaving(true);
  };

  if (isLoading) {
    return <div className="text-center py-6">Caricamento dati in corso...</div>;
  }

  return (
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <BriefcaseBusiness className="mr-2 h-5 w-5 text-indigo-500" />
        <h3 className="text-xl font-semibold">N1 - Strategia: modello aziendale e iniziative di sostenibilità</h3>
      </div>
      
      <SectionAutoSaveIndicator 
        className="mb-4" 
        lastSaved={lastSaved}
        needsSaving={needsSaving} 
      />
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="productsServices">Gruppi significativi di prodotti e/o servizi offerti</Label>
          <Textarea
            id="productsServices"
            name="productsServices"
            placeholder="Descrivi i principali prodotti e servizi offerti dalla tua impresa"
            value={formData.productsServices}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>
        
        <div>
          <Label htmlFor="markets">Mercati significativi in cui opera l'impresa</Label>
          <Textarea
            id="markets"
            name="markets"
            placeholder="Descrivi i mercati principali (B2B, commercio all'ingrosso, commercio al dettaglio, paesi)"
            value={formData.markets}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>
        
        <div>
          <Label htmlFor="businessRelations">Principali relazioni commerciali</Label>
          <Textarea
            id="businessRelations"
            name="businessRelations"
            placeholder="Descrivi i principali fornitori, clienti, canali di distribuzione e consumatori"
            value={formData.businessRelations}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>
        
        <div>
          <Label htmlFor="sustainabilityStrategy">Elementi chiave della strategia legati alla sostenibilità</Label>
          <Textarea
            id="sustainabilityStrategy"
            name="sustainabilityStrategy"
            placeholder="Descrivi gli elementi chiave della strategia aziendale che riguardano o influenzano le questioni di sostenibilità (se applicabile)"
            value={formData.sustainabilityStrategy}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>

        <div className="flex justify-start">
          <SaveButton 
            onClick={async () => {
              const success = await saveData();
              if (success) {
                setNeedsSaving(false);
              }
            }} 
            isLoading={isSaving} 
          />
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default StrategySection;
