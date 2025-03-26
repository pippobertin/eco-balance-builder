
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AutoSaveIndicator from '../components/AutoSaveIndicator';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useSectionData } from '../hooks/useSectionData';

interface BP10WorkLifeBalanceProps {
  reportId: string;
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

interface BP10FormData {
  maleFamilyLeaveEligible?: number;
  femaleFamilyLeaveEligible?: number;
  maleFamilyLeaveUsed?: number;
  femaleFamilyLeaveUsed?: number;
}

const BP10WorkLifeBalanceSection: React.FC<BP10WorkLifeBalanceProps> = ({ 
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
  } = useSectionData<BP10FormData>({
    reportId,
    tableName: 'bp10_work_life_balance',
    initialData: {}
  });

  // Aggiorna il formValues globale quando i dati della sezione cambiano
  React.useEffect(() => {
    setFormValues(prevValues => ({
      ...prevValues,
      bp10WorkLifeBalance: sectionData
    }));
  }, [sectionData, setFormValues]);

  const handleInputChange = (field: keyof BP10FormData, value: string) => {
    let parsedValue: number | undefined = undefined;
    
    if (value !== '') {
      parsedValue = parseFloat(value);
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
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP10</span>
          Equilibrio vita-lavoro
        </CardTitle>
        <CardDescription>
          Indicare i dati relativi ai congedi familiari nell'impresa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 p-4 bg-gray-50 rounded-md">
            <div className="space-y-2">
              <Label htmlFor="maleFamilyLeaveEligible">
                Uomini idonei al congedo familiare
              </Label>
              <Input
                id="maleFamilyLeaveEligible"
                type="number"
                min="0"
                placeholder="Inserisci il numero"
                value={sectionData.maleFamilyLeaveEligible ?? ''}
                onChange={(e) => handleInputChange('maleFamilyLeaveEligible', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="femaleFamilyLeaveEligible">
                Donne idonee al congedo familiare
              </Label>
              <Input
                id="femaleFamilyLeaveEligible"
                type="number"
                min="0"
                placeholder="Inserisci il numero"
                value={sectionData.femaleFamilyLeaveEligible ?? ''}
                onChange={(e) => handleInputChange('femaleFamilyLeaveEligible', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maleFamilyLeaveUsed">
                Uomini che hanno usufruito del congedo
              </Label>
              <Input
                id="maleFamilyLeaveUsed"
                type="number"
                min="0"
                placeholder="Inserisci il numero"
                value={sectionData.maleFamilyLeaveUsed ?? ''}
                onChange={(e) => handleInputChange('maleFamilyLeaveUsed', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="femaleFamilyLeaveUsed">
                Donne che hanno usufruito del congedo
              </Label>
              <Input
                id="femaleFamilyLeaveUsed"
                type="number"
                min="0"
                placeholder="Inserisci il numero"
                value={sectionData.femaleFamilyLeaveUsed ?? ''}
                onChange={(e) => handleInputChange('femaleFamilyLeaveUsed', e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="w-2/3">
              <AutoSaveIndicator
                lastSaved={lastSaved}
                needsSaving={needsSaving}
                isLoading={isSaving}
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

export default BP10WorkLifeBalanceSection;
