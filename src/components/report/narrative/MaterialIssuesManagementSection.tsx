
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import SaveButton from './components/SaveButton';
import SectionAutoSaveIndicator from '../environmental/components/SectionAutoSaveIndicator';
import { useIssuesManagementData } from './hooks/issues-management/useIssuesManagementData';
import { useIssuesManagementLoad } from './hooks/issues-management/useIssuesManagementLoad';
import { useIssuesManagementSave } from './hooks/issues-management/useIssuesManagementSave';

interface MaterialIssuesManagementSectionProps {
  reportId: string;
}

const MaterialIssuesManagementSection: React.FC<MaterialIssuesManagementSectionProps> = ({ reportId }) => {
  const { formData, setFormData, isLoading, setIsLoading, lastSaved, setLastSaved } = useIssuesManagementData(reportId);
  
  // Load data
  useIssuesManagementLoad(reportId, setFormData, setIsLoading, setLastSaved);
  
  // Get save function
  const { saveData, isSaving } = useIssuesManagementSave(reportId, formData, setLastSaved);

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
        <FileText className="mr-2 h-5 w-5 text-indigo-500" />
        <h3 className="text-xl font-semibold">N3 - Gestione delle questioni rilevanti di sostenibilità</h3>
      </div>
      
      <SectionAutoSaveIndicator className="mb-4" lastSaved={lastSaved} />
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="policiesActions">Politiche e azioni adottate</Label>
          <Textarea
            id="policiesActions"
            name="policiesActions"
            placeholder="Descrivi le politiche o azioni adottate per prevenire, mitigare e/o rimediare ad impatti negativi"
            value={formData.policiesActions}
            onChange={handleChange}
            className="min-h-[120px]"
          />
        </div>
        
        <div>
          <Label htmlFor="policiesDescription">Descrizione delle politiche</Label>
          <Textarea
            id="policiesDescription"
            name="policiesDescription"
            placeholder="Se sono state adottate politiche, descrivi: obiettivi, ambito di applicazione, portatori di interesse coinvolti, riferimenti a principi/iniziative di terzi, obiettivi di monitoraggio"
            value={formData.policiesDescription}
            onChange={handleChange}
            className="min-h-[120px]"
          />
        </div>
        
        <div>
          <Label htmlFor="actionsDescription">Descrizione delle azioni</Label>
          <Textarea
            id="actionsDescription"
            name="actionsDescription"
            placeholder="Se sono state intraprese azioni, descrivi: azioni chiave intraprese nell'anno di riferimento, ambito di applicazione, orizzonte temporale, obiettivi di monitoraggio"
            value={formData.actionsDescription}
            onChange={handleChange}
            className="min-h-[120px]"
          />
        </div>
        
        <div>
          <Label htmlFor="energyEfficiencyActions">Azioni per l'efficienza energetica</Label>
          <Textarea
            id="energyEfficiencyActions"
            name="energyEfficiencyActions"
            placeholder="Descrivi le azioni intraprese per migliorare l'efficienza energetica e ridurre le emissioni di gas serra (se rilevante)"
            value={formData.energyEfficiencyActions}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>
        
        <div>
          <Label htmlFor="stakeholdersImpacts">Impatti sui portatori di interesse nella catena del valore</Label>
          <Textarea
            id="stakeholdersImpacts"
            name="stakeholdersImpacts"
            placeholder="Se rilevante, descrivi le politiche e azioni adottate per gestire gli impatti sui lavoratori nella catena del valore, consumatori e comunità interessate"
            value={formData.stakeholdersImpacts}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>
        
        <div>
          <Label htmlFor="antiCorruptionMeasures">Misure anti-corruzione</Label>
          <Textarea
            id="antiCorruptionMeasures"
            name="antiCorruptionMeasures"
            placeholder="Se rilevante, descrivi le misure adottate per prevenire episodi di corruzione (separazione delle funzioni, formazione dipendenti, azioni per affrontare violazioni)"
            value={formData.antiCorruptionMeasures}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>

        <div className="flex justify-end">
          <SaveButton onClick={saveData} isLoading={isSaving} />
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default MaterialIssuesManagementSection;
