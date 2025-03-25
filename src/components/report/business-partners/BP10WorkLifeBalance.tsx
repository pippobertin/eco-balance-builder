
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';
import { BP10FormData } from './hooks/types';
import SaveButton from './components/SaveButton';
import SectionAutoSaveIndicator from './components/SectionAutoSaveIndicator';

interface BP10WorkLifeBalanceProps {
  formData: BP10FormData;
  setFormData: (data: BP10FormData) => void;
  saveData: () => Promise<boolean>;
  isLoading: boolean;
  lastSaved: Date | null;
  needsSaving: boolean;
}

const BP10WorkLifeBalance: React.FC<BP10WorkLifeBalanceProps> = ({
  formData,
  setFormData,
  saveData,
  isLoading,
  lastSaved,
  needsSaving
}) => {
  const handleInputChange = (field: keyof BP10FormData, value: number | undefined) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          BP10 - Equilibrio tra vita professionale e vita privata
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
          <div className="p-4 rounded-md mb-4 bg-gray-100">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-600">
                Il congedo per motivi familiari comprende il congedo di maternità, di paternità, parentale e per i prestatori di assistenza.
              </p>
            </div>
          </div>
          
          <h4 className="font-medium text-lg">Dipendenti con diritto al congedo per motivi familiari</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maleFamilyLeaveEligible">Dipendenti di genere maschile con diritto (%)</Label>
              <Input 
                id="maleFamilyLeaveEligible" 
                type="number" 
                placeholder="0.0" 
                value={formData.maleFamilyLeaveEligible || ''} 
                onChange={(e) => handleInputChange('maleFamilyLeaveEligible', e.target.value ? parseFloat(e.target.value) : undefined)} 
              />
            </div>
            
            <div>
              <Label htmlFor="femaleFamilyLeaveEligible">Dipendenti di genere femminile con diritto (%)</Label>
              <Input 
                id="femaleFamilyLeaveEligible" 
                type="number" 
                placeholder="0.0" 
                value={formData.femaleFamilyLeaveEligible || ''} 
                onChange={(e) => handleInputChange('femaleFamilyLeaveEligible', e.target.value ? parseFloat(e.target.value) : undefined)} 
              />
            </div>
          </div>
          
          <h4 className="font-medium text-lg">Dipendenti che hanno usufruito del congedo per motivi familiari</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maleFamilyLeaveUsed">Dipendenti di genere maschile che ne hanno usufruito (%)</Label>
              <Input 
                id="maleFamilyLeaveUsed" 
                type="number" 
                placeholder="0.0" 
                value={formData.maleFamilyLeaveUsed || ''} 
                onChange={(e) => handleInputChange('maleFamilyLeaveUsed', e.target.value ? parseFloat(e.target.value) : undefined)} 
              />
            </div>
            
            <div>
              <Label htmlFor="femaleFamilyLeaveUsed">Dipendenti di genere femminile che ne hanno usufruito (%)</Label>
              <Input 
                id="femaleFamilyLeaveUsed" 
                type="number" 
                placeholder="0.0" 
                value={formData.femaleFamilyLeaveUsed || ''} 
                onChange={(e) => handleInputChange('femaleFamilyLeaveUsed', e.target.value ? parseFloat(e.target.value) : undefined)} 
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <SaveButton
              onClick={saveData}
              isLoading={isLoading}
              className="ml-auto"
            >
              Salva dati BP10
            </SaveButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BP10WorkLifeBalance;
