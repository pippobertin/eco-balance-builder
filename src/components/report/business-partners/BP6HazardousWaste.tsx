
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { BP6FormData } from './hooks/types';
import SaveButton from './components/SaveButton';
import SectionAutoSaveIndicator from './components/SectionAutoSaveIndicator';

interface BP6HazardousWasteProps {
  formData: BP6FormData;
  setFormData: (data: BP6FormData) => void;
  saveData: () => Promise<boolean>;
  isLoading: boolean;
  lastSaved: Date | null;
  needsSaving: boolean;
}

const BP6HazardousWaste: React.FC<BP6HazardousWasteProps> = ({
  formData,
  setFormData,
  saveData,
  isLoading,
  lastSaved,
  needsSaving
}) => {
  const handleCheckboxChange = (field: keyof BP6FormData) => {
    setFormData({
      ...formData,
      [field]: !formData[field]
    });
  };

  const handleInputChange = (field: keyof BP6FormData, value: number | undefined) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          BP6 - Indice rifiuti pericolosi e/o radioattivi
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
              id="hasHazardousWaste" 
              checked={formData.hasHazardousWaste || false}
              onCheckedChange={() => handleCheckboxChange('hasHazardousWaste')}
            />
            <Label htmlFor="hasHazardousWaste">
              L'impresa genera rifiuti pericolosi e/o radioattivi
            </Label>
          </div>
          
          {formData.hasHazardousWaste && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hazardousWasteTotal">Quantità totale di rifiuti pericolosi (tonnellate)</Label>
                <Input 
                  id="hazardousWasteTotal" 
                  type="number" 
                  placeholder="0.0" 
                  value={formData.hazardousWasteTotal || ''} 
                  onChange={(e) => handleInputChange('hazardousWasteTotal', e.target.value ? parseFloat(e.target.value) : undefined)} 
                />
              </div>
              
              <div>
                <Label htmlFor="radioactiveWasteTotal">Quantità totale di rifiuti radioattivi (tonnellate)</Label>
                <Input 
                  id="radioactiveWasteTotal" 
                  type="number" 
                  placeholder="0.0" 
                  value={formData.radioactiveWasteTotal || ''} 
                  onChange={(e) => handleInputChange('radioactiveWasteTotal', e.target.value ? parseFloat(e.target.value) : undefined)} 
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
              Salva dati BP6
            </SaveButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BP6HazardousWaste;
