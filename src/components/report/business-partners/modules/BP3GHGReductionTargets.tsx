
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBP3Data } from '../hooks/bp3';
import { SaveButton, SectionAutoSaveIndicator } from '../components';
import { InfoCircle } from 'lucide-react';

interface BP3GHGReductionTargetsProps {
  reportId: string;
}

const BP3GHGReductionTargets: React.FC<BP3GHGReductionTargetsProps> = ({ reportId }) => {
  const { formData, setFormData, isLoading, saveData, lastSaved, needsSaving } = useBP3Data(reportId);

  const handleCheckboxChange = () => {
    setFormData(prev => ({
      ...prev,
      hasGhgReductionTargets: !prev.hasGhgReductionTargets
    }));
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    setFormData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP3</span>
          Obiettivi di riduzione dei gas serra
        </CardTitle>
        <CardDescription>
          Indicare se l'impresa ha obiettivi di riduzione delle emissioni di gas serra e, in caso affermativo, i dettagli degli obiettivi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-2 p-3 bg-blue-50 text-blue-700 rounded-md">
            <InfoCircle className="h-5 w-5 mt-0.5" />
            <p className="text-sm">
              Gli obiettivi di riduzione delle emissioni di gas serra dovrebbero essere specifici, misurabili e definiti nel tempo.
            </p>
          </div>

          <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-md">
            <Checkbox 
              id="hasGhgReductionTargets" 
              checked={formData.hasGhgReductionTargets}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="hasGhgReductionTargets" className="font-medium">
              L'impresa ha stabilito obiettivi di riduzione delle emissioni di gas serra
            </Label>
          </div>
          
          {formData.hasGhgReductionTargets && (
            <div className="space-y-6 p-4 border rounded-md">
              <h3 className="font-medium">Dettagli degli obiettivi di riduzione</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ghgReductionTargetScope1">
                    Obiettivo di riduzione Scope 1 (%)
                  </Label>
                  <Input
                    id="ghgReductionTargetScope1"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.ghgReductionTargetScope1 ?? ''}
                    onChange={(e) => handleInputChange('ghgReductionTargetScope1', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ghgReductionTargetScope2">
                    Obiettivo di riduzione Scope 2 (%)
                  </Label>
                  <Input
                    id="ghgReductionTargetScope2"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.ghgReductionTargetScope2 ?? ''}
                    onChange={(e) => handleInputChange('ghgReductionTargetScope2', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ghgReductionTargetScope3">
                    Obiettivo di riduzione Scope 3 (%)
                  </Label>
                  <Input
                    id="ghgReductionTargetScope3"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.ghgReductionTargetScope3 ?? ''}
                    onChange={(e) => handleInputChange('ghgReductionTargetScope3', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="ghgReductionBaselineYear">
                    Anno di riferimento (baseline)
                  </Label>
                  <Input
                    id="ghgReductionBaselineYear"
                    type="number"
                    min="1900"
                    max="2100"
                    value={formData.ghgReductionBaselineYear ?? ''}
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
                    min="2020"
                    max="2100"
                    value={formData.ghgReductionTargetYear ?? ''}
                    onChange={(e) => handleInputChange('ghgReductionTargetYear', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-4 border-t">
            <SectionAutoSaveIndicator
              lastSaved={lastSaved}
              needsSaving={needsSaving}
            />
            <SaveButton
              onClick={saveData}
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

export default BP3GHGReductionTargets;
