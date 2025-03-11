
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

interface GovernanceSectionProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const GovernanceSection: React.FC<GovernanceSectionProps> = ({ 
  formValues, 
  handleChange 
}) => {
  return (
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <Building className="mr-2 h-5 w-5 text-indigo-500" />
        <h3 className="text-xl font-semibold">N5 - Governance: responsabilità in materia di sostenibilità</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="sustainabilityGovernance">Governance e responsabilità sulla sostenibilità</Label>
          <Textarea
            id="sustainabilityGovernance"
            name="sustainabilityGovernance"
            placeholder="Descrivi la governance e le responsabilità in relazione alle questioni di sostenibilità (ruoli e responsabilità del più alto organo di governance o persone incaricate)"
            value={formValues.narrativePATMetrics?.sustainabilityGovernance || ""}
            onChange={handleChange}
            className="min-h-[120px]"
          />
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default GovernanceSection;
