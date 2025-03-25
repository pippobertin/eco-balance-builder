
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { BP8FormData } from './hooks/types';
import SaveButton from './components/SaveButton';
import SectionAutoSaveIndicator from './components/SectionAutoSaveIndicator';

interface BP8ComplianceProcessesProps {
  formData: BP8FormData;
  setFormData: (data: BP8FormData) => void;
  saveData: () => Promise<boolean>;
  isLoading: boolean;
  lastSaved: Date | null;
  needsSaving: boolean;
}

const BP8ComplianceProcesses: React.FC<BP8ComplianceProcessesProps> = ({
  formData,
  setFormData,
  saveData,
  isLoading,
  lastSaved,
  needsSaving
}) => {
  const handleCheckboxChange = (field: keyof BP8FormData) => {
    setFormData({
      ...formData,
      [field]: !formData[field]
    });
  };

  const handleTextareaChange = (field: keyof BP8FormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          BP8 - Processi per monitorare la conformità e meccanismi per affrontare le violazioni
        </CardTitle>
        <div className="flex items-center gap-2">
          <SectionAutoSaveIndicator 
            needsSaving={needsSaving} 
            lastSaved={lastSaved} 
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox 
              id="hasComplianceProcesses" 
              checked={formData.hasComplianceProcesses || false}
              onCheckedChange={() => handleCheckboxChange('hasComplianceProcesses')}
            />
            <Label htmlFor="hasComplianceProcesses">
              L'impresa dispone di processi per monitorare il rispetto degli standard internazionali
            </Label>
          </div>
          
          {formData.hasComplianceProcesses && (
            <div>
              <Label htmlFor="complianceProcessesDetails">Dettagli sui processi di monitoraggio</Label>
              <Textarea 
                id="complianceProcessesDetails" 
                placeholder="Descrivi i processi per monitorare il rispetto delle Linee guida dell'OCSE per le imprese multinazionali e dei Principi guida delle Nazioni Unite su imprese e diritti umani, compresi i meccanismi di gestione delle lamentele e dei reclami." 
                value={formData.complianceProcessesDetails || ''} 
                onChange={(e) => handleTextareaChange('complianceProcessesDetails', e.target.value)} 
                className="min-h-[150px]" 
              />
            </div>
          )}

          <div className="flex justify-end mt-4">
            <SaveButton
              onClick={saveData}
              isLoading={isLoading}
              className="ml-auto"
            >
              Salva dati BP8
            </SaveButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BP8ComplianceProcesses;
