
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AutoSaveIndicator from '../components/AutoSaveIndicator';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useSectionData } from '../hooks/useSectionData';

interface BP3GHGReductionTargetsProps {
  reportId: string;
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

interface BP3FormData {
  hasGhgReductionTargets: boolean;
  ghgReductionBaselineYear?: number;
  ghgReductionTargetYear?: number;
  ghgReductionTargetScope1?: number;
  ghgReductionTargetScope2?: number;
  ghgReductionTargetScope3?: number;
}

const BP3GHGReductionTargetsSection: React.FC<BP3GHGReductionTargetsProps> = ({ 
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
  } = useSectionData<BP3FormData>({
    reportId,
    tableName: 'bp3_ghg_targets',
    initialData: {
      hasGhgReductionTargets: false
    }
  });

  // Aggiorna il formValues globale quando i dati della sezione cambiano
  React.useEffect(() => {
    setFormValues(prevValues => ({
      ...prevValues,
      bp3GhgTargets: sectionData
    }));
  }, [sectionData, setFormValues]);

  const handleCheckboxChange = () => {
    setSectionData(prev => ({
      ...prev,
      hasGhgReductionTargets: !prev.hasGhgReductionTargets
    }));
  };

  const handleInputChange = (field: keyof BP3FormData, value: string) => {
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
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP3</span>
          Obiettivi riduzione emissioni GHG
        </CardTitle>
        <CardDescription>
          Indicare se l'impresa ha fissato obiettivi di riduzione delle emissioni di gas serra.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-md">
            <Checkbox 
              id="hasGhgReductionTargets" 
              checked={sectionData.hasGhgReductionTargets}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="hasGhgReductionTargets" className="font-medium">
              L'impresa ha fissato obiettivi di riduzione delle emissioni di gas serra
            </Label>
          </div>
          
          {sectionData.hasGhgReductionTargets && (
            <div className="space-y-4 p-4 border rounded-md">
              {/* Qui andrebbero gli altri campi del form - per brevità mostro solo un esempio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ghgReductionBaselineYear">
                    Anno di riferimento
                  </Label>
                  <Input
                    id="ghgReductionBaselineYear"
                    type="number"
                    min="1900"
                    max="2100"
                    placeholder="Es. 2019"
                    value={sectionData.ghgReductionBaselineYear ?? ''}
                    onChange={(e) => handleInputChange('ghgReductionBaselineYear', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ghgReductionTargetYear">
                    Anno obiettivo
                  </Label>
                  <Input
                    id="ghgReductionTargetYear"
                    type="number"
                    min="1900"
                    max="2100"
                    placeholder="Es. 2030"
                    value={sectionData.ghgReductionTargetYear ?? ''}
                    onChange={(e) => handleInputChange('ghgReductionTargetYear', e.target.value)}
                  />
                </div>
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

export default BP3GHGReductionTargetsSection;
