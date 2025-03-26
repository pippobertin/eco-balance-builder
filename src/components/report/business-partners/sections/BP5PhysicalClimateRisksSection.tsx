
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AutoSaveIndicator from '../components/AutoSaveIndicator';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useSectionData } from '../hooks/useSectionData';

interface BP5PhysicalClimateRisksProps {
  reportId: string;
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

interface BP5FormData {
  hasPhysicalClimateRisks: boolean;
  assetsAtRiskAmount?: number;
  assetsAtRiskPercentage?: number;
  adaptationCoverage?: number;
  revenueAtRiskPercentage?: number;
}

const BP5PhysicalClimateRisksSection: React.FC<BP5PhysicalClimateRisksProps> = ({ 
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
  } = useSectionData<BP5FormData>({
    reportId,
    tableName: 'bp5_physical_risks',
    initialData: {
      hasPhysicalClimateRisks: false
    }
  });

  // Aggiorna il formValues globale quando i dati della sezione cambiano
  React.useEffect(() => {
    setFormValues(prevValues => ({
      ...prevValues,
      bp5PhysicalRisks: sectionData
    }));
  }, [sectionData, setFormValues]);
  
  const handleCheckboxChange = () => {
    setSectionData(prev => ({
      ...prev,
      hasPhysicalClimateRisks: !prev.hasPhysicalClimateRisks
    }));
  };

  const handleInputChange = (field: keyof BP5FormData, value: string) => {
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
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP5</span>
          Rischi fisici legati al clima
        </CardTitle>
        <CardDescription>
          Indicare se l'impresa è esposta a rischi fisici legati al clima.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-md">
            <Checkbox 
              id="hasPhysicalClimateRisks" 
              checked={sectionData.hasPhysicalClimateRisks}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="hasPhysicalClimateRisks" className="font-medium">
              L'impresa è esposta a rischi fisici legati al clima
            </Label>
          </div>
          
          {sectionData.hasPhysicalClimateRisks && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
              <div className="space-y-2">
                <Label htmlFor="assetsAtRiskPercentage">
                  Percentuale di asset a rischio (%)
                </Label>
                <Input
                  id="assetsAtRiskPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="Inserisci la percentuale"
                  value={sectionData.assetsAtRiskPercentage ?? ''}
                  onChange={(e) => handleInputChange('assetsAtRiskPercentage', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="revenueAtRiskPercentage">
                  Percentuale di ricavi a rischio (%)
                </Label>
                <Input
                  id="revenueAtRiskPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="Inserisci la percentuale"
                  value={sectionData.revenueAtRiskPercentage ?? ''}
                  onChange={(e) => handleInputChange('revenueAtRiskPercentage', e.target.value)}
                />
              </div>
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

export default BP5PhysicalClimateRisksSection;
