import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { BP11FormData } from './hooks/types';
import { SaveButton } from './components/SaveButton';
import { SectionAutoSaveIndicator } from './components/SectionAutoSaveIndicator';

interface BP11ApprenticesProps {
  formData: BP11FormData;
  setFormData: (data: BP11FormData) => void;
  saveData: () => Promise<boolean>;
  isLoading: boolean;
  lastSaved: Date | null;
  needsSaving: boolean;
}

const BP11Apprentices: React.FC<BP11ApprenticesProps> = ({
  formData,
  setFormData,
  saveData,
  isLoading,
  lastSaved,
  needsSaving
}) => {
  const handleCheckboxChange = (field: keyof BP11FormData) => {
    setFormData({
      ...formData,
      [field]: !formData[field]
    });
  };

  const handleInputChange = (field: keyof BP11FormData, value: number | undefined) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          BP11 - Numero di apprendisti
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
              id="hasApprentices" 
              checked={formData.hasApprentices || false}
              onCheckedChange={() => handleCheckboxChange('hasApprentices')}
            />
            <Label htmlFor="hasApprentices">
              L'impresa ha avuto apprendisti nel periodo di riferimento
            </Label>
          </div>
          
          {formData.hasApprentices && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="apprenticesNumber">Numero di apprendisti</Label>
                <Input 
                  id="apprenticesNumber" 
                  type="number" 
                  placeholder="0" 
                  value={formData.apprenticesNumber || ''} 
                  onChange={(e) => handleInputChange('apprenticesNumber', e.target.value ? parseInt(e.target.value) : undefined)} 
                />
              </div>
              
              <div>
                <Label htmlFor="apprenticesPercentage">Percentuale sul totale dei dipendenti (%)</Label>
                <Input 
                  id="apprenticesPercentage" 
                  type="number" 
                  placeholder="0.0" 
                  value={formData.apprenticesPercentage || ''} 
                  onChange={(e) => handleInputChange('apprenticesPercentage', e.target.value ? parseFloat(e.target.value) : undefined)} 
                />
              </div>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <SaveButton
              onClick={saveData}
              isLoading={isLoading}
              className="ml-auto"
            >
              Salva dati BP11
            </SaveButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BP11Apprentices;
