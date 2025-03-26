
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBP2Data } from '../hooks/bp2';
import { SaveButton, SectionAutoSaveIndicator } from '../components';
import { Info } from 'lucide-react';

interface BP2GenderDiversityProps {
  reportId: string;
}

const BP2GenderDiversity: React.FC<BP2GenderDiversityProps> = ({ reportId }) => {
  const { formData, setFormData, isLoading, saveData, lastSaved, needsSaving } = useBP2Data(reportId);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    setFormData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  // Calculate gender diversity index when member counts change
  React.useEffect(() => {
    if (formData.maleGovernanceMembers !== undefined || 
        formData.femaleGovernanceMembers !== undefined || 
        formData.otherGenderGovernanceMembers !== undefined) {
      
      const maleCount = formData.maleGovernanceMembers || 0;
      const femaleCount = formData.femaleGovernanceMembers || 0;
      const otherCount = formData.otherGenderGovernanceMembers || 0;
      
      const total = maleCount + femaleCount + otherCount;
      
      if (total > 0) {
        // Calculate percentage of non-male members
        const nonMalePercentage = (femaleCount + otherCount) / total;
        
        setFormData(prev => ({
          ...prev,
          genderDiversityIndex: nonMalePercentage
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          genderDiversityIndex: 0
        }));
      }
    }
  }, [formData.maleGovernanceMembers, formData.femaleGovernanceMembers, formData.otherGenderGovernanceMembers]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP2</span>
          Diversità di genere negli organi di governance
        </CardTitle>
        <CardDescription>
          Inserisci il numero di membri degli organi di governance suddivisi per genere.
        </CardDescription>
        <SectionAutoSaveIndicator
          lastSaved={lastSaved}
          needsSaving={needsSaving}
          isLoading={isLoading}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-2 p-3 bg-blue-50 text-blue-700 rounded-md">
            <Info className="h-5 w-5 mt-0.5" />
            <p className="text-sm">
              Gli organi di governance includono il consiglio di amministrazione, il collegio sindacale e altri organi di controllo.
              L'indice di diversità di genere viene calcolato automaticamente come percentuale di membri non-maschili.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maleGovernanceMembers">
                Membri maschili
              </Label>
              <Input
                id="maleGovernanceMembers"
                type="number"
                min="0"
                value={formData.maleGovernanceMembers ?? ''}
                onChange={(e) => handleInputChange('maleGovernanceMembers', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="femaleGovernanceMembers">
                Membri femminili
              </Label>
              <Input
                id="femaleGovernanceMembers"
                type="number"
                min="0"
                value={formData.femaleGovernanceMembers ?? ''}
                onChange={(e) => handleInputChange('femaleGovernanceMembers', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="otherGenderGovernanceMembers">
                Membri di altri generi
              </Label>
              <Input
                id="otherGenderGovernanceMembers"
                type="number"
                min="0"
                value={formData.otherGenderGovernanceMembers ?? ''}
                onChange={(e) => handleInputChange('otherGenderGovernanceMembers', e.target.value)}
              />
            </div>
          </div>
          
          <div className="p-4 border rounded-md bg-gray-50">
            <div className="flex justify-between items-center">
              <Label htmlFor="genderDiversityIndex" className="font-medium">
                Indice di diversità di genere
              </Label>
              <span className="text-lg font-semibold">
                {formData.genderDiversityIndex !== undefined 
                  ? `${(formData.genderDiversityIndex * 100).toFixed(0)}%` 
                  : '-'}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <SaveButton
              onClick={saveData}
              isLoading={isLoading}
              disabled={isLoading || !needsSaving}
            >
              Salva
            </SaveButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BP2GenderDiversity;
