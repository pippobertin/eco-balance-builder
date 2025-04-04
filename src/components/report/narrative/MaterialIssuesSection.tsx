import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Target } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import SaveButton from './components/SaveButton';
import SectionAutoSaveIndicator from '../environmental/components/SectionAutoSaveIndicator';
import { useMaterialIssuesData } from './hooks/material-issues/useMaterialIssuesData';
import { useMaterialIssuesLoad } from './hooks/material-issues/useMaterialIssuesLoad';
import { useMaterialIssuesSave } from './hooks/material-issues/useMaterialIssuesSave';

interface MaterialIssuesSectionProps {
  reportId: string;
}

const MaterialIssuesSection: React.FC<MaterialIssuesSectionProps> = ({ reportId }) => {
  const { 
    formData, 
    setFormData, 
    initialFormData,
    setInitialFormData,
    isLoading, 
    setIsLoading, 
    lastSaved, 
    setLastSaved, 
    needsSaving, 
    setNeedsSaving 
  } = useMaterialIssuesData(reportId);
  
  // Load data
  useMaterialIssuesLoad(reportId, setFormData, setInitialFormData, setIsLoading, setLastSaved, setNeedsSaving);
  
  // Get save function
  const { saveData, isSaving } = useMaterialIssuesSave(reportId, formData, setLastSaved, setInitialFormData, setNeedsSaving);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  if (isLoading) {
    return <div className="text-center py-6">Caricamento dati in corso...</div>;
  }

  return (
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <Target className="mr-2 h-5 w-5 text-indigo-500" />
        <h3 className="text-xl font-semibold">N2 - Questioni rilevanti di sostenibilità</h3>
      </div>
      
      <SectionAutoSaveIndicator 
        className="mb-4" 
        lastSaved={lastSaved}
        needsSaving={needsSaving} 
      />
      
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
            value={formData.materialIssuesDescription}
            onChange={handleChange}
            className="min-h-[150px]"
          />
        </div>

        <div className="flex justify-start">
          <SaveButton 
            onClick={async () => {
              await saveData();
            }} 
            isLoading={isSaving} 
          />
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default MaterialIssuesSection;
