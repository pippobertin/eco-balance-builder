
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import SaveButton from './components/SaveButton';
import SectionAutoSaveIndicator from '../environmental/components/SectionAutoSaveIndicator';
import { useStakeholdersData, useStakeholdersLoad, useStakeholdersSave } from './hooks';
import { useReport } from '@/context/ReportContext';

interface StakeholdersSectionProps {
  reportId: string;
}

const StakeholdersSection: React.FC<StakeholdersSectionProps> = ({ reportId }) => {
  const { formData, setFormData, isLoading, setIsLoading, isSaving, lastSaved } = useStakeholdersData(reportId);
  const { needsSaving } = useReport();
  const { saveData } = useStakeholdersSave(reportId, formData);

  // Load data
  useStakeholdersLoad(reportId, setFormData, setIsLoading);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return <div className="text-center py-6">Caricamento dati in corso...</div>;
  }

  return (
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <Users className="mr-2 h-5 w-5 text-indigo-500" />
        <h3 className="text-xl font-semibold">N4 - Principali portatori di interessi</h3>
      </div>
      
      <SectionAutoSaveIndicator className="mb-4"/>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="keyStakeholders">Categorie di portatori di interessi</Label>
          <Textarea
            id="keyStakeholders"
            name="keyStakeholders"
            placeholder="Descrivi le categorie e i singoli portatori di interessi significativi per la tua impresa"
            value={formData.keyStakeholders}
            onChange={handleChange}
            className="min-h-[120px]"
          />
        </div>
        
        <div>
          <Label htmlFor="stakeholderEngagement">Metodi di coinvolgimento dei portatori di interessi</Label>
          <Textarea
            id="stakeholderEngagement"
            name="stakeholderEngagement"
            placeholder="Descrivi i canali di comunicazione e le modalità di coinvolgimento dei portatori di interessi"
            value={formData.stakeholderEngagement}
            onChange={handleChange}
            className="min-h-[120px]"
          />
        </div>

        <div className="flex justify-end">
          <SaveButton onClick={saveData} isLoading={isSaving} />
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default StakeholdersSection;
