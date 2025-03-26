
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';
import { SaveButton, SectionAutoSaveIndicator } from '../components';
import { useSectionData } from '../hooks/useSectionData';

interface BP10WorkLifeBalanceProps {
  reportId: string;
}

interface BP10FormData {
  maleParentalLeaveEligible?: number;
  femaleParentalLeaveEligible?: number;
  maleParentalLeaveUsed?: number;
  femaleParentalLeaveUsed?: number;
}

const BP10WorkLifeBalance: React.FC<BP10WorkLifeBalanceProps> = ({ reportId }) => {
  const {
    data: formData,
    setData: setFormData,
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

  const handleInputChange = (field: keyof BP10FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? undefined : Number(e.target.value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP10</span>
          Equilibrio vita-lavoro e congedi parentali
        </CardTitle>
        <CardDescription>
          Indicare i dati sui congedi parentali, suddivisi per genere.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-2 p-3 bg-blue-50 text-blue-700 rounded-md">
            <Info className="h-5 w-5 mt-0.5" />
            <p className="text-sm">
              I dati sui congedi parentali sono indicativi dell'equilibrio tra vita lavorativa e vita privata offerto dall'impresa.
            </p>
          </div>

          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-medium">Lavoratori aventi diritto al congedo parentale</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maleParentalLeaveEligible">Uomini aventi diritto</Label>
                <Input
                  id="maleParentalLeaveEligible"
                  type="number"
                  placeholder="Numero di uomini"
                  value={formData.maleParentalLeaveEligible ?? ''}
                  onChange={handleInputChange('maleParentalLeaveEligible')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="femaleParentalLeaveEligible">Donne aventi diritto</Label>
                <Input
                  id="femaleParentalLeaveEligible"
                  type="number"
                  placeholder="Numero di donne"
                  value={formData.femaleParentalLeaveEligible ?? ''}
                  onChange={handleInputChange('femaleParentalLeaveEligible')}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-medium">Lavoratori che hanno usufruito del congedo parentale</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maleParentalLeaveUsed">Uomini che hanno usufruito</Label>
                <Input
                  id="maleParentalLeaveUsed"
                  type="number"
                  placeholder="Numero di uomini"
                  value={formData.maleParentalLeaveUsed ?? ''}
                  onChange={handleInputChange('maleParentalLeaveUsed')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="femaleParentalLeaveUsed">Donne che hanno usufruito</Label>
                <Input
                  id="femaleParentalLeaveUsed"
                  type="number"
                  placeholder="Numero di donne"
                  value={formData.femaleParentalLeaveUsed ?? ''}
                  onChange={handleInputChange('femaleParentalLeaveUsed')}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <SectionAutoSaveIndicator
              lastSaved={lastSaved}
              needsSaving={needsSaving}
              isLoading={isSaving}
            />
            <SaveButton
              onClick={async () => {
                await saveData(formData);
              }}
              isLoading={isLoading || isSaving}
            >
              Salva
            </SaveButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BP10WorkLifeBalance;
