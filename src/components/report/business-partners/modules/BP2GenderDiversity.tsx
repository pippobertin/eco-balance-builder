
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBP2Data } from '../hooks/bp2';
import { SaveButton, SectionAutoSaveIndicator } from '../common';
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

  // Modifichiamo il tipo di ritorno per adattarsi a Promise<void>
  const handleSaveClick = async (): Promise<void> => {
    await saveData();
  };

  const calculateDiversityIndex = () => {
    const maleMembers = formData.maleGovernanceMembers || 0;
    const femaleMembers = formData.femaleGovernanceMembers || 0;
    const otherMembers = formData.otherGenderGovernanceMembers || 0;
    
    const totalMembers = maleMembers + femaleMembers + otherMembers;
    
    if (totalMembers === 0) return 0;
    
    // Calcola l'indice di diversità: percentuale di membri non maschi
    const diversityIndex = ((femaleMembers + otherMembers) / totalMembers) * 100;
    return Number(diversityIndex.toFixed(2));
  };

  // Aggiorna l'indice di diversità quando cambiano i membri
  React.useEffect(() => {
    const diversityIndex = calculateDiversityIndex();
    if (diversityIndex !== formData.genderDiversityIndex) {
      setFormData(prev => ({
        ...prev,
        genderDiversityIndex: diversityIndex
      }));
    }
  }, [
    formData.maleGovernanceMembers,
    formData.femaleGovernanceMembers,
    formData.otherGenderGovernanceMembers
  ]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP2</span>
          Diversità di genere nella governance
        </CardTitle>
        <CardDescription>
          Indicare la composizione per genere degli organi di governance dell'impresa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-2 p-3 bg-blue-50 text-blue-700 rounded-md">
            <Info className="h-5 w-5 mt-0.5" />
            <p className="text-sm">
              Inserire il numero di membri degli organi di governance per ciascun genere. L'indice di diversità sarà calcolato automaticamente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maleGovernanceMembers">Membri uomini</Label>
              <Input
                id="maleGovernanceMembers"
                type="number"
                min="0"
                value={formData.maleGovernanceMembers ?? ''}
                onChange={(e) => handleInputChange('maleGovernanceMembers', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="femaleGovernanceMembers">Membri donne</Label>
              <Input
                id="femaleGovernanceMembers"
                type="number"
                min="0"
                value={formData.femaleGovernanceMembers ?? ''}
                onChange={(e) => handleInputChange('femaleGovernanceMembers', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="otherGenderGovernanceMembers">Membri altri generi</Label>
              <Input
                id="otherGenderGovernanceMembers"
                type="number"
                min="0"
                value={formData.otherGenderGovernanceMembers ?? ''}
                onChange={(e) => handleInputChange('otherGenderGovernanceMembers', e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <Label className="text-lg font-medium">Indice di diversità di genere</Label>
            <p className="text-3xl font-bold mt-2">
              {formData.genderDiversityIndex?.toFixed(2) || '0.00'}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Percentuale di membri non maschi negli organi di governance
            </p>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <SectionAutoSaveIndicator
              lastSaved={lastSaved}
              needsSaving={needsSaving}
            />
            <SaveButton
              onClick={handleSaveClick}
              isLoading={isLoading}
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
