
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Target } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

interface MaterialIssuesSectionProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const MaterialIssuesSection: React.FC<MaterialIssuesSectionProps> = ({ 
  formValues, 
  handleChange 
}) => {
  return (
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <Target className="mr-2 h-5 w-5 text-indigo-500" />
        <h3 className="text-xl font-semibold">N2 - Questioni rilevanti di sostenibilità</h3>
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Descrivi le questioni di sostenibilità rilevanti risultanti dalla valutazione della materialità, illustrando:
          <br />- come ciascuna questione impatta sulle persone o sull'ambiente
          <br />- gli effetti reali e potenziali sulla situazione patrimoniale-finanziaria e sul risultato finanziario
          <br />- gli effetti reali e potenziali sulle attività e sulla strategia dell'impresa
        </p>
        
        <div>
          <Label htmlFor="materialIssuesDescription">Questioni di sostenibilità materiali</Label>
          <Textarea
            id="materialIssuesDescription"
            name="materialIssuesDescription"
            placeholder="Descrivi le questioni di sostenibilità rilevanti identificate attraverso l'analisi di materialità"
            value={formValues.narrativePATMetrics?.materialIssuesDescription || ""}
            onChange={handleChange}
            className="min-h-[150px]"
          />
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default MaterialIssuesSection;
