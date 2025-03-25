
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BP2FormData } from './hooks/types';
import SaveButton from './components/SaveButton';
import SectionAutoSaveIndicator from './components/SectionAutoSaveIndicator';

interface BP2GenderDiversityProps {
  formData: BP2FormData;
  setFormData: (data: BP2FormData) => void;
  saveData: () => Promise<boolean>;
  isLoading: boolean;
  lastSaved: Date | null;
  needsSaving: boolean;
}

const BP2GenderDiversity: React.FC<BP2GenderDiversityProps> = ({
  formData,
  setFormData,
  saveData,
  isLoading,
  lastSaved,
  needsSaving
}) => {
  const handleInputChange = (field: keyof BP2FormData, value: number | undefined) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          BP2 - Indice di diversità di genere negli organi di governance
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maleGovernanceMembers">Membri di genere maschile</Label>
              <Input 
                id="maleGovernanceMembers" 
                type="number" 
                placeholder="0" 
                value={formData.maleGovernanceMembers || ''} 
                onChange={(e) => handleInputChange('maleGovernanceMembers', e.target.value ? parseInt(e.target.value) : undefined)} 
              />
            </div>
            
            <div>
              <Label htmlFor="femaleGovernanceMembers">Membri di genere femminile</Label>
              <Input 
                id="femaleGovernanceMembers" 
                type="number" 
                placeholder="0" 
                value={formData.femaleGovernanceMembers || ''} 
                onChange={(e) => handleInputChange('femaleGovernanceMembers', e.target.value ? parseInt(e.target.value) : undefined)} 
              />
            </div>
            
            <div>
              <Label htmlFor="otherGenderGovernanceMembers">Membri di altri generi</Label>
              <Input 
                id="otherGenderGovernanceMembers" 
                type="number" 
                placeholder="0" 
                value={formData.otherGenderGovernanceMembers || ''} 
                onChange={(e) => handleInputChange('otherGenderGovernanceMembers', e.target.value ? parseInt(e.target.value) : undefined)} 
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="genderDiversityIndex">Indice di diversità di genere (%)</Label>
            <Input 
              id="genderDiversityIndex" 
              type="number" 
              placeholder="0.0" 
              value={formData.genderDiversityIndex || ''} 
              onChange={(e) => handleInputChange('genderDiversityIndex', e.target.value ? parseFloat(e.target.value) : undefined)} 
            />
            <p className="text-sm text-gray-500 mt-1">
              Percentuale di membri non appartenenti al genere prevalente nell'organo di governance
            </p>
          </div>

          <div className="flex justify-end mt-4">
            <SaveButton
              onClick={saveData}
              isLoading={isLoading}
              className="ml-auto"
            >
              Salva dati BP2
            </SaveButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BP2GenderDiversity;
