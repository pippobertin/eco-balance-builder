import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { BP4FormData } from './hooks/types';
import { SaveButton } from './components/SaveButton';
import { SectionAutoSaveIndicator } from './components/SectionAutoSaveIndicator';

interface BP4TransitionPlanProps {
  formData: BP4FormData;
  setFormData: (data: BP4FormData) => void;
  saveData: () => Promise<boolean>;
  isLoading: boolean;
  lastSaved: Date | null;
  needsSaving: boolean;
}

const BP4TransitionPlan: React.FC<BP4TransitionPlanProps> = ({
  formData,
  setFormData,
  saveData,
  isLoading,
  lastSaved,
  needsSaving
}) => {
  const handleCheckboxChange = (field: keyof BP4FormData) => {
    setFormData({
      ...formData,
      [field]: !formData[field]
    });
  };

  const handleTextareaChange = (field: keyof BP4FormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          BP4 - Piano di transizione per la mitigazione dei cambiamenti climatici
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
              id="hasTransitionPlan" 
              checked={formData.hasTransitionPlan || false}
              onCheckedChange={() => handleCheckboxChange('hasTransitionPlan')}
            />
            <Label htmlFor="hasTransitionPlan">
              L'impresa ha adottato un piano di transizione per la mitigazione dei cambiamenti climatici
            </Label>
          </div>
          
          {formData.hasTransitionPlan && (
            <div>
              <Label htmlFor="transitionPlanDetails">Dettagli del piano di transizione</Label>
              <Textarea 
                id="transitionPlanDetails" 
                placeholder="Spiega come gli obiettivi di riduzione delle emissioni di gas a effetto serra siano compatibili con la limitazione del riscaldamento globale a 1,5°C, in linea con l'Accordo di Parigi." 
                value={formData.transitionPlanDetails || ''} 
                onChange={(e) => handleTextareaChange('transitionPlanDetails', e.target.value)} 
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
              Salva dati BP4
            </SaveButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BP4TransitionPlan;
