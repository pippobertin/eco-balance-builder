
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useBP5Data } from '../hooks/bp5';
import { SaveButton, SectionAutoSaveIndicator } from '../components';
import { Info, CloudLightning } from 'lucide-react';

interface BP5PhysicalClimateRisksProps {
  reportId: string;
}

const BP5PhysicalClimateRisks: React.FC<BP5PhysicalClimateRisksProps> = ({ reportId }) => {
  const { formData, setFormData, isLoading, saveData, lastSaved, needsSaving } = useBP5Data(reportId);

  const handleCheckboxChange = () => {
    setFormData(prev => ({
      ...prev,
      hasPhysicalClimateRisks: !prev.hasPhysicalClimateRisks
    }));
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    setFormData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleTextChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value || undefined
    }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <CloudLightning className="h-5 w-5 text-yellow-700" />
          </div>
          <div>
            <CardTitle>BP5 - Rischi fisici legati al clima</CardTitle>
            <CardDescription>
              Indicare se l'impresa è esposta a rischi fisici legati al clima e, in caso affermativo, i dettagli dell'esposizione.
            </CardDescription>
          </div>
        </div>
        <SectionAutoSaveIndicator
          lastSaved={lastSaved}
          needsSaving={needsSaving}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-2 p-3 bg-blue-50 text-blue-700 rounded-md">
            <Info className="h-5 w-5 mt-0.5" />
            <p className="text-sm">
              I rischi fisici legati al clima includono eventi meteorologici estremi, innalzamento del livello del mare, siccità, inondazioni, ecc.
            </p>
          </div>

          <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-md">
            <Checkbox 
              id="hasPhysicalClimateRisks" 
              checked={formData.hasPhysicalClimateRisks}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="hasPhysicalClimateRisks" className="font-medium">
              L'impresa è esposta a rischi fisici legati al clima
            </Label>
          </div>
          
          {formData.hasPhysicalClimateRisks && (
            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="font-medium">Dettagli dei rischi fisici legati al clima</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assetsAtRiskAmount">
                    Valore dei beni a rischio (€)
                  </Label>
                  <Input
                    id="assetsAtRiskAmount"
                    type="number"
                    min="0"
                    value={formData.assetsAtRiskAmount ?? ''}
                    onChange={(e) => handleInputChange('assetsAtRiskAmount', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assetsAtRiskPercentage">
                    Percentuale dei beni a rischio (%)
                  </Label>
                  <Input
                    id="assetsAtRiskPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.assetsAtRiskPercentage ?? ''}
                    onChange={(e) => handleInputChange('assetsAtRiskPercentage', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adaptationCoverage">
                    Copertura delle misure di adattamento (%)
                  </Label>
                  <Input
                    id="adaptationCoverage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.adaptationCoverage ?? ''}
                    onChange={(e) => handleInputChange('adaptationCoverage', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="revenueAtRiskPercentage">
                    Percentuale dei ricavi a rischio (%)
                  </Label>
                  <Input
                    id="revenueAtRiskPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.revenueAtRiskPercentage ?? ''}
                    onChange={(e) => handleInputChange('revenueAtRiskPercentage', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="riskAssetsLocation">
                  Localizzazione degli asset a rischio
                </Label>
                <Textarea
                  id="riskAssetsLocation"
                  placeholder="Descrivere dove sono localizzati i beni esposti a rischi climatici..."
                  value={formData.riskAssetsLocation || ''}
                  onChange={(e) => handleTextChange('riskAssetsLocation', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="realEstateEnergyEfficiency">
                  Efficienza energetica degli immobili
                </Label>
                <Textarea
                  id="realEstateEnergyEfficiency"
                  placeholder="Descrivere l'efficienza energetica degli immobili dell'impresa..."
                  value={formData.realEstateEnergyEfficiency || ''}
                  onChange={(e) => handleTextChange('realEstateEnergyEfficiency', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          
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

export default BP5PhysicalClimateRisks;
