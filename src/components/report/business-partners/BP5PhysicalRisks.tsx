
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { BP5FormData } from './hooks/types';
import SaveButton from './components/SaveButton';
import SectionAutoSaveIndicator from './components/SectionAutoSaveIndicator';

interface BP5PhysicalRisksProps {
  formData: BP5FormData;
  setFormData: (data: BP5FormData) => void;
  saveData: () => Promise<boolean>;
  isLoading: boolean;
  lastSaved: Date | null;
  needsSaving: boolean;
}

const BP5PhysicalRisks: React.FC<BP5PhysicalRisksProps> = ({
  formData,
  setFormData,
  saveData,
  isLoading,
  lastSaved,
  needsSaving
}) => {
  const handleCheckboxChange = (field: keyof BP5FormData) => {
    setFormData({
      ...formData,
      [field]: !formData[field]
    });
  };

  const handleInputChange = (field: keyof BP5FormData, value: number | string | undefined) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          BP5 - Rischi fisici legati al clima
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
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox 
              id="hasPhysicalClimateRisks" 
              checked={formData.hasPhysicalClimateRisks || false}
              onCheckedChange={() => handleCheckboxChange('hasPhysicalClimateRisks')}
            />
            <Label htmlFor="hasPhysicalClimateRisks">
              L'impresa è esposta a rischi fisici legati al clima
            </Label>
          </div>
          
          {formData.hasPhysicalClimateRisks && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assetsAtRiskAmount">Valore degli attivi a rischio (€)</Label>
                  <Input 
                    id="assetsAtRiskAmount" 
                    type="number" 
                    placeholder="0.0" 
                    value={formData.assetsAtRiskAmount || ''} 
                    onChange={(e) => handleInputChange('assetsAtRiskAmount', e.target.value ? parseFloat(e.target.value) : undefined)} 
                  />
                </div>
                
                <div>
                  <Label htmlFor="assetsAtRiskPercentage">Percentuale degli attivi a rischio (%)</Label>
                  <Input 
                    id="assetsAtRiskPercentage" 
                    type="number" 
                    placeholder="0.0" 
                    value={formData.assetsAtRiskPercentage || ''} 
                    onChange={(e) => handleInputChange('assetsAtRiskPercentage', e.target.value ? parseFloat(e.target.value) : undefined)} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adaptationCoverage">Copertura dei piani di adattamento (%)</Label>
                  <Input 
                    id="adaptationCoverage" 
                    type="number" 
                    placeholder="0.0" 
                    value={formData.adaptationCoverage || ''} 
                    onChange={(e) => handleInputChange('adaptationCoverage', e.target.value ? parseFloat(e.target.value) : undefined)} 
                  />
                </div>
                
                <div>
                  <Label htmlFor="revenueAtRiskPercentage">Percentuale di fatturato a rischio (%)</Label>
                  <Input 
                    id="revenueAtRiskPercentage" 
                    type="number" 
                    placeholder="0.0" 
                    value={formData.revenueAtRiskPercentage || ''} 
                    onChange={(e) => handleInputChange('revenueAtRiskPercentage', e.target.value ? parseFloat(e.target.value) : undefined)} 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="riskAssetsLocation">Località degli attivi esposti a rischi fisici</Label>
                <Input 
                  id="riskAssetsLocation" 
                  type="text" 
                  placeholder="Inserisci le località" 
                  value={formData.riskAssetsLocation || ''} 
                  onChange={(e) => handleInputChange('riskAssetsLocation', e.target.value)} 
                />
              </div>
              
              <div>
                <Label htmlFor="realEstateEnergyEfficiency">Efficienza energetica degli immobili</Label>
                <Input 
                  id="realEstateEnergyEfficiency" 
                  type="text" 
                  placeholder="Descrivi l'efficienza energetica" 
                  value={formData.realEstateEnergyEfficiency || ''} 
                  onChange={(e) => handleInputChange('realEstateEnergyEfficiency', e.target.value)} 
                />
              </div>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <SaveButton
              onClick={saveData}
              isLoading={isLoading}
              className="ml-auto"
            >
              Salva dati BP5
            </SaveButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BP5PhysicalRisks;
