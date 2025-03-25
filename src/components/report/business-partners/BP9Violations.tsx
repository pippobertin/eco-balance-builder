import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { BP9FormData } from './hooks/types';
import { SaveButton } from './components/SaveButton';
import { SectionAutoSaveIndicator } from './components/SectionAutoSaveIndicator';

interface BP9ViolationsProps {
  formData: BP9FormData;
  setFormData: (data: BP9FormData) => void;
  saveData: () => Promise<boolean>;
  isLoading: boolean;
  lastSaved: Date | null;
  needsSaving: boolean;
}

const BP9Violations: React.FC<BP9ViolationsProps> = ({
  formData,
  setFormData,
  saveData,
  isLoading,
  lastSaved,
  needsSaving
}) => {
  const handleCheckboxChange = (field: keyof BP9FormData) => {
    setFormData({
      ...formData,
      [field]: !formData[field]
    });
  };

  const handleTextareaChange = (field: keyof BP9FormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          BP9 - Violazione delle Linee guida dell'OCSE o dei Principi guida delle Nazioni Unite
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
              id="hasViolations" 
              checked={formData.hasViolations || false}
              onCheckedChange={() => handleCheckboxChange('hasViolations')}
            />
            <Label htmlFor="hasViolations">
              Si sono verificate violazioni nell'anno di riferimento
            </Label>
          </div>
          
          {formData.hasViolations && (
            <div>
              <Label htmlFor="violationsDetails">Dettagli sulle violazioni</Label>
              <Textarea 
                id="violationsDetails" 
                placeholder="Descrivi le violazioni dei Principi guida delle Nazioni Unite su imprese e diritti umani, della Dichiarazione dell'ILO sui principi e i diritti fondamentali nel lavoro o delle Linee guida dell'OCSE per le imprese multinazionali in relazione alla propria forza lavoro." 
                value={formData.violationsDetails || ''} 
                onChange={(e) => handleTextareaChange('violationsDetails', e.target.value)} 
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
              Salva dati BP9
            </SaveButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BP9Violations;
