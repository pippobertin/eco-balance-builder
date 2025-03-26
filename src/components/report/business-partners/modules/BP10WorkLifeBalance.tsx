
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';
import { SaveButton, SectionAutoSaveIndicator } from '../components';
import { useBP10Data } from '../hooks/bp10';

interface BP10WorkLifeBalanceProps {
  reportId: string;
}

const BP10WorkLifeBalance: React.FC<BP10WorkLifeBalanceProps> = ({ reportId }) => {
  const {
    formData,
    setFormData,
    isLoading,
    isSaving,
    lastSaved,
    needsSaving,
    saveData
  } = useBP10Data(reportId);

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
          Equilibrio vita-lavoro e congedi familiari
        </CardTitle>
        <CardDescription>
          Indicare i dati sui congedi familiari, suddivisi per genere.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-2 p-3 bg-blue-50 text-blue-700 rounded-md">
            <Info className="h-5 w-5 mt-0.5" />
            <p className="text-sm">
              I dati sui congedi familiari sono indicativi dell'equilibrio tra vita lavorativa e vita privata offerto dall'impresa.
            </p>
          </div>

          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-medium">Lavoratori aventi diritto al congedo familiare</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maleFamilyLeaveEligible">Uomini aventi diritto</Label>
                <Input
                  id="maleFamilyLeaveEligible"
                  type="number"
                  placeholder="Numero di uomini"
                  value={formData.maleFamilyLeaveEligible ?? ''}
                  onChange={handleInputChange('maleFamilyLeaveEligible')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="femaleFamilyLeaveEligible">Donne aventi diritto</Label>
                <Input
                  id="femaleFamilyLeaveEligible"
                  type="number"
                  placeholder="Numero di donne"
                  value={formData.femaleFamilyLeaveEligible ?? ''}
                  onChange={handleInputChange('femaleFamilyLeaveEligible')}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-medium">Lavoratori che hanno usufruito del congedo familiare</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maleFamilyLeaveUsed">Uomini che hanno usufruito</Label>
                <Input
                  id="maleFamilyLeaveUsed"
                  type="number"
                  placeholder="Numero di uomini"
                  value={formData.maleFamilyLeaveUsed ?? ''}
                  onChange={handleInputChange('maleFamilyLeaveUsed')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="femaleFamilyLeaveUsed">Donne che hanno usufruito</Label>
                <Input
                  id="femaleFamilyLeaveUsed"
                  type="number"
                  placeholder="Numero di donne"
                  value={formData.femaleFamilyLeaveUsed ?? ''}
                  onChange={handleInputChange('femaleFamilyLeaveUsed')}
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
                return await saveData();
              }}
              isLoading={isSaving}
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
