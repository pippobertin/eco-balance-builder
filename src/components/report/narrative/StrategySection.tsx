
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BriefcaseBusiness } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

interface StrategySectionProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const StrategySection: React.FC<StrategySectionProps> = ({ 
  formValues, 
  handleChange 
}) => {
  return (
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <BriefcaseBusiness className="mr-2 h-5 w-5 text-indigo-500" />
        <h3 className="text-xl font-semibold">N1 - Strategia: modello aziendale e iniziative di sostenibilità</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="productsServices">Gruppi significativi di prodotti e/o servizi offerti</Label>
          <Textarea
            id="productsServices"
            name="productsServices"
            placeholder="Descrivi i principali prodotti e servizi offerti dalla tua impresa"
            value={formValues.narrativePATMetrics?.productsServices || ""}
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
            value={formValues.narrativePATMetrics?.markets || ""}
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
            value={formValues.narrativePATMetrics?.businessRelations || ""}
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
            value={formValues.narrativePATMetrics?.sustainabilityStrategy || ""}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default StrategySection;
