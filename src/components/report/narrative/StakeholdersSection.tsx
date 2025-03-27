
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import SaveButton from './components/SaveButton';
import SectionAutoSaveIndicator from '../environmental/components/SectionAutoSaveIndicator';
import { useStakeholdersData } from './hooks/stakeholders/useStakeholdersData';
import { useStakeholdersLoad } from './hooks/stakeholders/useStakeholdersLoad';
import { useStakeholdersSave } from './hooks/stakeholders/useStakeholdersSave';

interface StakeholdersSectionProps {
  reportId: string;
}

const StakeholdersSection: React.FC<StakeholdersSectionProps> = ({ reportId }) => {
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
  } = useStakeholdersData(reportId);
  
  // Load data
  useStakeholdersLoad(reportId, setFormData, setInitialFormData, setIsLoading, setLastSaved, setNeedsSaving);
  
  // Get save function
  const { saveData, isSaving } = useStakeholdersSave(reportId, formData, setLastSaved, setInitialFormData, setNeedsSaving);

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
        <Users className="mr-2 h-5 w-5 text-indigo-500" />
        <h3 className="text-xl font-semibold">N4 - Principali portatori di interessi</h3>
      </div>
      
      <SectionAutoSaveIndicator 
        className="mb-4" 
        lastSaved={lastSaved}
        needsSaving={needsSaving} 
      />
      
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

export default StakeholdersSection;
