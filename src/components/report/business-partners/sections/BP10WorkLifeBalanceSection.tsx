
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
  maleParentalLeaveEligible?: number;
  femaleParentalLeaveEligible?: number;
  maleParentalLeaveUsed?: number;
  femaleParentalLeaveUsed?: number;
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
          Indicare i dati relativi ai congedi parentali nell'impresa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 p-4 bg-gray-50 rounded-md">
            <div className="space-y-2">
              <Label htmlFor="maleParentalLeaveEligible">
                Uomini idonei al congedo parentale
              </Label>
              <Input
                id="maleParentalLeaveEligible"
                type="number"
                min="0"
                placeholder="Inserisci il numero"
                value={sectionData.maleParentalLeaveEligible ?? ''}
                onChange={(e) => handleInputChange('maleParentalLeaveEligible', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="femaleParentalLeaveEligible">
                Donne idonee al congedo parentale
              </Label>
              <Input
                id="femaleParentalLeaveEligible"
                type="number"
                min="0"
                placeholder="Inserisci il numero"
                value={sectionData.femaleParentalLeaveEligible ?? ''}
                onChange={(e) => handleInputChange('femaleParentalLeaveEligible', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maleParentalLeaveUsed">
                Uomini che hanno usufruito del congedo
              </Label>
              <Input
                id="maleParentalLeaveUsed"
                type="number"
                min="0"
                placeholder="Inserisci il numero"
                value={sectionData.maleParentalLeaveUsed ?? ''}
                onChange={(e) => handleInputChange('maleParentalLeaveUsed', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="femaleParentalLeaveUsed">
                Donne che hanno usufruito del congedo
              </Label>
              <Input
                id="femaleParentalLeaveUsed"
                type="number"
                min="0"
                placeholder="Inserisci il numero"
                value={sectionData.femaleParentalLeaveUsed ?? ''}
                onChange={(e) => handleInputChange('femaleParentalLeaveUsed', e.target.value)}
              />
            </div>
          </div>
          
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

export default BP10WorkLifeBalanceSection;
