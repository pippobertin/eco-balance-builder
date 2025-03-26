import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBP2Data } from './useBP2Data';
import { SaveButton } from '../../common';
import { InfoIcon } from 'lucide-react';
import { SaveIndicator } from './components';

interface BP2GenderDiversityProps {
  reportId: string;
}

const BP2GenderDiversity: React.FC<BP2GenderDiversityProps> = ({ reportId }) => {
  const { formData, setFormData, isLoading, saveData, lastSaved, needsSaving } = useBP2Data(reportId);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    setFormData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  // Calculate gender diversity index when member counts change
  useEffect(() => {
    if (formData.maleGovernanceMembers !== undefined || 
        formData.femaleGovernanceMembers !== undefined || 
        formData.otherGenderGovernanceMembers !== undefined) {
      
      const maleCount = formData.maleGovernanceMembers || 0;
      const femaleCount = formData.femaleGovernanceMembers || 0;
      const otherCount = formData.otherGenderGovernanceMembers || 0;
      
      const total = maleCount + femaleCount + otherCount;
      
      if (total > 0) {
        // Calculate percentage of non-male members
        const nonMalePercentage = ((femaleCount + otherCount) / total) * 100;
        
        setFormData(prev => ({
          ...prev,
          genderDiversityIndex: nonMalePercentage / 100 // Store as decimal
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          genderDiversityIndex: 0
        }));
      }
    }
  }, [formData.maleGovernanceMembers, formData.femaleGovernanceMembers, formData.otherGenderGovernanceMembers]);

  // Handle save button click
  const handleSave = async () => {
    console.log("BP2: Starting save process");
    setIsSaving(true);
    try {
      await saveData();
      console.log("BP2: Save completed successfully");
      
      // Keep isSaving true for a moment after save completes
      // This ensures the indicator shows the saved state properly
      setTimeout(() => {
        setIsSaving(false);
        console.log("BP2: Save process finished, isSaving set to false");
      }, 1000); // Longer delay to ensure the indicator has time to update
    } catch (error) {
      console.error("BP2: Error during save:", error);
      setIsSaving(false);
    }
  };

  useEffect(() => {
    console.log("BP2GenderDiversity state updated:", { 
      isLoading, 
      isSaving, 
      needsSaving, 
      lastSaved: lastSaved ? lastSaved.toISOString() : null 
    });
  }, [isLoading, isSaving, needsSaving, lastSaved]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-700 p-1 rounded">BP2</span>
              Diversità di genere negli organi di governance
            </CardTitle>
            <CardDescription>
              Inserisci il numero di membri degli organi di governance suddivisi per genere.
            </CardDescription>
          </div>
          <SaveIndicator 
            isLoading={isLoading}
            isSaving={isSaving}
            needsSaving={needsSaving}
            lastSaved={lastSaved}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-2 p-3 bg-blue-50 text-blue-700 rounded-md">
            <InfoIcon className="h-5 w-5 mt-0.5" />
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
                  ? `${(formData.genderDiversityIndex * 100).toFixed(1)}%` 
                  : '-'}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <SaveButton
              onClick={handleSave}
              isLoading={isSaving}
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
