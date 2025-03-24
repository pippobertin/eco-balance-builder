
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import SaveButton from './components/SaveButton';
import SectionAutoSaveIndicator from '../environmental/components/SectionAutoSaveIndicator';
import { useGovernanceData } from './hooks/governance/useGovernanceData';
import { useGovernanceLoad } from './hooks/governance/useGovernanceLoad';
import { useGovernanceSave } from './hooks/governance/useGovernanceSave';

interface GovernanceSectionProps {
  reportId: string;
}

const GovernanceSection: React.FC<GovernanceSectionProps> = ({ reportId }) => {
  const { 
    formData, 
    setFormData, 
    isLoading, 
    setIsLoading, 
    lastSaved, 
    setLastSaved, 
    needsSaving, 
    setNeedsSaving 
  } = useGovernanceData(reportId);
  
  // Load data
  useGovernanceLoad(reportId, setFormData, setIsLoading, setLastSaved, setNeedsSaving);
  
  // Get save function
  const { saveData, isSaving } = useGovernanceSave(reportId, formData, setLastSaved);

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
        <Building className="mr-2 h-5 w-5 text-indigo-500" />
        <h3 className="text-xl font-semibold">N5 - Governance: responsabilità in materia di sostenibilità</h3>
      </div>
      
      <SectionAutoSaveIndicator 
        className="mb-4" 
        lastSaved={lastSaved}
        needsSaving={needsSaving} 
      />
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="sustainabilityGovernance">Governance e responsabilità sulla sostenibilità</Label>
          <Textarea
            id="sustainabilityGovernance"
            name="sustainabilityGovernance"
            placeholder="Descrivi la governance e le responsabilità in relazione alle questioni di sostenibilità (ruoli e responsabilità del più alto organo di governance o persone incaricate)"
            value={formData.sustainabilityGovernance}
            onChange={handleChange}
            className="min-h-[120px]"
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

export default GovernanceSection;
