import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { BP7FormData } from './hooks/types';
import { SaveButton } from './components/SaveButton';
import { SectionAutoSaveIndicator } from './components/SectionAutoSaveIndicator';

interface BP7PolicyAlignmentProps {
  formData: BP7FormData;
  setFormData: (data: BP7FormData) => void;
  saveData: () => Promise<boolean>;
  isLoading: boolean;
  lastSaved: Date | null;
  needsSaving: boolean;
}

const BP7PolicyAlignment: React.FC<BP7PolicyAlignmentProps> = ({
  formData,
  setFormData,
  saveData,
  isLoading,
  lastSaved,
  needsSaving
}) => {
  const handleCheckboxChange = (field: keyof BP7FormData) => {
    setFormData({
      ...formData,
      [field]: !formData[field]
    });
  };

  const handleTextareaChange = (field: keyof BP7FormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          BP7 - Allineamento con gli strumenti riconosciuti a livello internazionale
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
              id="hasPoliciesAligned" 
              checked={formData.hasPoliciesAligned || false}
              onCheckedChange={() => handleCheckboxChange('hasPoliciesAligned')}
            />
            <Label htmlFor="hasPoliciesAligned">
              Le politiche relative alla forza lavoro sono allineate con gli strumenti pertinenti riconosciuti a livello internazionale
            </Label>
          </div>
          
          {formData.hasPoliciesAligned && (
            <div>
              <Label htmlFor="alignedInstruments">Strumenti pertinenti riconosciuti</Label>
              <Textarea 
                id="alignedInstruments" 
                placeholder="Specifica con quali strumenti pertinenti riconosciuti a livello internazionale sono allineate le politiche, compresi i Principi guida delle Nazioni Unite su imprese e diritti umani." 
                value={formData.alignedInstruments || ''} 
                onChange={(e) => handleTextareaChange('alignedInstruments', e.target.value)} 
                className="min-h-[120px]" 
              />
            </div>
          )}

          <div className="flex justify-end mt-4">
            <SaveButton
              onClick={saveData}
              isLoading={isLoading}
              className="ml-auto"
            >
              Salva dati BP7
            </SaveButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BP7PolicyAlignment;
