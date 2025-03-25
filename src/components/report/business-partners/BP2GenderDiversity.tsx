import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BP2FormData } from './hooks/types';
import { SaveButton } from './components/SaveButton';
import { SectionAutoSaveIndicator } from './components/SectionAutoSaveIndicator';

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
  const handleInputChange = (field: keyof BP2FormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value === '' ? undefined : Number(value)
    });
  };

  const calculateDiversityIndex = (): number => {
    const totalMembers = 
      (formData.maleGovernanceMembers || 0) + 
      (formData.femaleGovernanceMembers || 0) + 
      (formData.otherGenderGovernanceMembers || 0);
      
    if (totalMembers === 0) return 0;
    
    // Calculate diversity index based on female percentage
    const femalePercentage = ((formData.femaleGovernanceMembers || 0) / totalMembers) * 100;
    return parseFloat(femalePercentage.toFixed(2));
  };

  // Update diversity index when gender components change
  React.useEffect(() => {
    const diversityIndex = calculateDiversityIndex();
    if (diversityIndex !== formData.genderDiversityIndex) {
      setFormData({
        ...formData,
        genderDiversityIndex: diversityIndex
      });
    }
  }, [formData.maleGovernanceMembers, formData.femaleGovernanceMembers, formData.otherGenderGovernanceMembers]);

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          BP2 - Diversità di Genere nei Membri degli Organi di Governance
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
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maleGovernanceMembers">Membri maschi</Label>
              <Input 
                id="maleGovernanceMembers"
                type="number"
                min="0"
                value={formData.maleGovernanceMembers || ''}
                onChange={(e) => handleInputChange('maleGovernanceMembers', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="femaleGovernanceMembers">Membri femmine</Label>
              <Input 
                id="femaleGovernanceMembers"
                type="number"
                min="0"
                value={formData.femaleGovernanceMembers || ''}
                onChange={(e) => handleInputChange('femaleGovernanceMembers', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="otherGenderGovernanceMembers">Altri generi</Label>
              <Input 
                id="otherGenderGovernanceMembers"
                type="number"
                min="0"
                value={formData.otherGenderGovernanceMembers || ''}
                onChange={(e) => handleInputChange('otherGenderGovernanceMembers', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="genderDiversityIndex">Indice di diversità di genere (%)</Label>
            <Input 
              id="genderDiversityIndex"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.genderDiversityIndex?.toFixed(2) || ''}
              readOnly
              className="mt-1 bg-gray-100"
            />
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
