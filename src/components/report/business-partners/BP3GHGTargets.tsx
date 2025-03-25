
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { BP3FormData } from './hooks/types';
import SaveButton from './components/SaveButton';
import SectionAutoSaveIndicator from './components/SectionAutoSaveIndicator';

interface BP3GHGTargetsProps {
  formData: BP3FormData;
  setFormData: (data: BP3FormData) => void;
  saveData: () => Promise<boolean>;
  isLoading: boolean;
  lastSaved: Date | null;
  needsSaving: boolean;
}

const BP3GHGTargets: React.FC<BP3GHGTargetsProps> = ({
  formData,
  setFormData,
  saveData,
  isLoading,
  lastSaved,
  needsSaving
}) => {
  const handleCheckboxChange = (field: keyof BP3FormData) => {
    setFormData({
      ...formData,
      [field]: !formData[field]
    });
  };

  const handleInputChange = (field: keyof BP3FormData, value: number | undefined) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          BP3 - Obiettivo di riduzione delle emissioni di gas a effetto serra
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
              id="hasGhgReductionTargets" 
              checked={formData.hasGhgReductionTargets || false}
              onCheckedChange={() => handleCheckboxChange('hasGhgReductionTargets')}
            />
            <Label htmlFor="hasGhgReductionTargets">
              L'impresa ha fissato obiettivi di riduzione delle emissioni di gas a effetto serra
            </Label>
          </div>
          
          {formData.hasGhgReductionTargets && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ghgReductionTargetScope1">Obiettivo di riduzione per Ambito 1 (%)</Label>
                  <Input 
                    id="ghgReductionTargetScope1" 
                    type="number" 
                    placeholder="0.0" 
                    value={formData.ghgReductionTargetScope1 || ''} 
                    onChange={(e) => handleInputChange('ghgReductionTargetScope1', e.target.value ? parseFloat(e.target.value) : undefined)} 
                  />
                </div>
                
                <div>
                  <Label htmlFor="ghgReductionTargetScope2">Obiettivo di riduzione per Ambito 2 (%)</Label>
                  <Input 
                    id="ghgReductionTargetScope2" 
                    type="number" 
                    placeholder="0.0" 
                    value={formData.ghgReductionTargetScope2 || ''} 
                    onChange={(e) => handleInputChange('ghgReductionTargetScope2', e.target.value ? parseFloat(e.target.value) : undefined)} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ghgReductionTargetScope3">Obiettivo di riduzione per Ambito 3 (%, opzionale)</Label>
                  <Input 
                    id="ghgReductionTargetScope3" 
                    type="number" 
                    placeholder="0.0" 
                    value={formData.ghgReductionTargetScope3 || ''} 
                    onChange={(e) => handleInputChange('ghgReductionTargetScope3', e.target.value ? parseFloat(e.target.value) : undefined)} 
                  />
                </div>
                
                <div>
                  <Label htmlFor="ghgReductionTargetYear">Anno target</Label>
                  <Input 
                    id="ghgReductionTargetYear" 
                    type="number" 
                    placeholder="2030" 
                    value={formData.ghgReductionTargetYear || ''} 
                    onChange={(e) => handleInputChange('ghgReductionTargetYear', e.target.value ? parseInt(e.target.value) : undefined)} 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="ghgReductionBaselineYear">Anno di riferimento per il calcolo della riduzione</Label>
                <Input 
                  id="ghgReductionBaselineYear" 
                  type="number" 
                  placeholder="2019" 
                  value={formData.ghgReductionBaselineYear || ''} 
                  onChange={(e) => handleInputChange('ghgReductionBaselineYear', e.target.value ? parseInt(e.target.value) : undefined)} 
                />
              </div>
            </>
          )}

          <div className="flex justify-end mt-4">
            <SaveButton
              onClick={saveData}
              isLoading={isLoading}
              className="ml-auto"
            >
              Salva dati BP3
            </SaveButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BP3GHGTargets;
