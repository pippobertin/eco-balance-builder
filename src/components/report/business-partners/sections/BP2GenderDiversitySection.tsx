
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AutoSaveIndicator from '../components/AutoSaveIndicator';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useSectionData } from '../hooks/useSectionData';

interface BP2GenderDiversityProps {
  reportId: string;
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

interface BP2FormData {
  maleGovernanceMembers?: number;
  femaleGovernanceMembers?: number;
  otherGenderGovernanceMembers?: number;
  genderDiversityIndex?: number;
}

const BP2GenderDiversitySection: React.FC<BP2GenderDiversityProps> = ({ 
  reportId, 
  formValues, 
  setFormValues 
}) => {
  const {
    data: sectionData,
    setData: setSectionData,
    isLoading,
    isSaving,
    lastSaved,
    needsSaving,
    saveData
  } = useSectionData<BP2FormData>({
    reportId,
    tableName: 'bp2_gender_diversity',
    initialData: {
      maleGovernanceMembers: undefined,
      femaleGovernanceMembers: undefined,
      otherGenderGovernanceMembers: undefined,
      genderDiversityIndex: undefined
    }
  });
  
  // Calcola l'indice di diversità quando cambiano i dati del form
  useEffect(() => {
    const { maleGovernanceMembers, femaleGovernanceMembers, otherGenderGovernanceMembers } = sectionData;
    
    const total = (maleGovernanceMembers || 0) + (femaleGovernanceMembers || 0) + (otherGenderGovernanceMembers || 0);
    
    if (total > 0) {
      // Percentuale di membri femminili nella governance
      const diversityIndex = ((femaleGovernanceMembers || 0) / total) * 100;
      
      setSectionData(prev => ({
        ...prev,
        genderDiversityIndex: Math.round(diversityIndex * 100) / 100 // Arrotonda a 2 decimali
      }));
    } else {
      setSectionData(prev => ({
        ...prev,
        genderDiversityIndex: undefined
      }));
    }
  }, [
    sectionData.maleGovernanceMembers, 
    sectionData.femaleGovernanceMembers, 
    sectionData.otherGenderGovernanceMembers
  ]);

  // Aggiorna il formValues globale quando i dati della sezione cambiano
  useEffect(() => {
    setFormValues(prevValues => ({
      ...prevValues,
      bp2GenderDiversity: sectionData
    }));
  }, [sectionData, setFormValues]);

  const handleInputChange = (field: keyof BP2FormData, value: string) => {
    let parsedValue: number | undefined = undefined;
    
    if (value !== '') {
      parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) parsedValue = undefined;
    }
    
    setSectionData(prev => ({
      ...prev,
      [field]: parsedValue
    }));
  };

  const handleSave = async () => {
    await saveData(sectionData);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP2</span>
          Diversità di genere nella governance
        </CardTitle>
        <CardDescription>
          Indicare la composizione per genere dell'organo di governance dell'impresa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maleGovernanceMembers">
                Membri maschili
              </Label>
              <Input
                id="maleGovernanceMembers"
                type="number"
                min="0"
                placeholder="Inserisci il numero"
                value={sectionData.maleGovernanceMembers ?? ''}
                onChange={(e) => handleInputChange('maleGovernanceMembers', e.target.value)}
                disabled={isLoading || isSaving}
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
                placeholder="Inserisci il numero"
                value={sectionData.femaleGovernanceMembers ?? ''}
                onChange={(e) => handleInputChange('femaleGovernanceMembers', e.target.value)}
                disabled={isLoading || isSaving}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="otherGenderGovernanceMembers">
                Membri altro genere
              </Label>
              <Input
                id="otherGenderGovernanceMembers"
                type="number"
                min="0"
                placeholder="Inserisci il numero"
                value={sectionData.otherGenderGovernanceMembers ?? ''}
                onChange={(e) => handleInputChange('otherGenderGovernanceMembers', e.target.value)}
                disabled={isLoading || isSaving}
              />
            </div>
          </div>
          
          {sectionData.genderDiversityIndex !== undefined && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <Label className="block mb-2">Indice di diversità di genere (% femminile)</Label>
              <div className="text-2xl font-semibold">{sectionData.genderDiversityIndex}%</div>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="w-2/3">
              <AutoSaveIndicator
                lastSaved={lastSaved}
                needsSaving={needsSaving}
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={isLoading || isSaving}
              className="ml-auto"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Salvataggio..." : "Salva"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BP2GenderDiversitySection;
