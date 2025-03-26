
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBP10Data } from '../hooks/bp10';
import { SaveButton, SectionAutoSaveIndicator } from '../components';
import { Info } from 'lucide-react';

interface BP10WorkLifeBalanceProps {
  reportId: string;
}

const BP10WorkLifeBalance: React.FC<BP10WorkLifeBalanceProps> = ({ reportId }) => {
  const { formData, setFormData, isLoading, saveData, lastSaved, needsSaving } = useBP10Data(reportId);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    setFormData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const calculateUsageRateMale = () => {
    if (!formData.maleFamilyLeaveEligible || formData.maleFamilyLeaveEligible === 0) return 0;
    return ((formData.maleFamilyLeaveUsed || 0) / formData.maleFamilyLeaveEligible) * 100;
  };

  const calculateUsageRateFemale = () => {
    if (!formData.femaleFamilyLeaveEligible || formData.femaleFamilyLeaveEligible === 0) return 0;
    return ((formData.femaleFamilyLeaveUsed || 0) / formData.femaleFamilyLeaveEligible) * 100;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP10</span>
          Equilibrio vita-lavoro
        </CardTitle>
        <CardDescription>
          Fornire informazioni sull'utilizzo dei congedi familiari e parentali da parte dei dipendenti.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-2 p-3 bg-blue-50 text-blue-700 rounded-md">
            <Info className="h-5 w-5 mt-0.5" />
            <p className="text-sm">
              I congedi familiari e parentali sono importanti strumenti di equilibrio vita-lavoro. Fornire i dati sul numero di dipendenti idonei e quanti hanno effettivamente utilizzato questi congedi.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="font-medium">Congedi familiari e parentali per genere</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 border rounded-md">
                <h4 className="font-medium text-blue-600">Dipendenti uomini</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="maleFamilyLeaveEligible">
                    Numero di dipendenti uomini idonei al congedo
                  </Label>
                  <Input
                    id="maleFamilyLeaveEligible"
                    type="number"
                    min="0"
                    value={formData.maleFamilyLeaveEligible ?? ''}
                    onChange={(e) => handleInputChange('maleFamilyLeaveEligible', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maleFamilyLeaveUsed">
                    Numero di dipendenti uomini che hanno utilizzato il congedo
                  </Label>
                  <Input
                    id="maleFamilyLeaveUsed"
                    type="number"
                    min="0"
                    max={formData.maleFamilyLeaveEligible ?? undefined}
                    value={formData.maleFamilyLeaveUsed ?? ''}
                    onChange={(e) => handleInputChange('maleFamilyLeaveUsed', e.target.value)}
                  />
                </div>
                
                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                  <div className="text-sm text-gray-500">Tasso di utilizzo:</div>
                  <div className="text-lg font-bold">{calculateUsageRateMale().toFixed(1)}%</div>
                </div>
              </div>
              
              <div className="space-y-4 p-4 border rounded-md">
                <h4 className="font-medium text-pink-600">Dipendenti donne</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="femaleFamilyLeaveEligible">
                    Numero di dipendenti donne idonee al congedo
                  </Label>
                  <Input
                    id="femaleFamilyLeaveEligible"
                    type="number"
                    min="0"
                    value={formData.femaleFamilyLeaveEligible ?? ''}
                    onChange={(e) => handleInputChange('femaleFamilyLeaveEligible', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="femaleFamilyLeaveUsed">
                    Numero di dipendenti donne che hanno utilizzato il congedo
                  </Label>
                  <Input
                    id="femaleFamilyLeaveUsed"
                    type="number"
                    min="0"
                    max={formData.femaleFamilyLeaveEligible ?? undefined}
                    value={formData.femaleFamilyLeaveUsed ?? ''}
                    onChange={(e) => handleInputChange('femaleFamilyLeaveUsed', e.target.value)}
                  />
                </div>
                
                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                  <div className="text-sm text-gray-500">Tasso di utilizzo:</div>
                  <div className="text-lg font-bold">{calculateUsageRateFemale().toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <SectionAutoSaveIndicator
              lastSaved={lastSaved}
              needsSaving={needsSaving}
            />
            <SaveButton
              onClick={async () => {
                await saveData();
              }}
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

export default BP10WorkLifeBalance;
