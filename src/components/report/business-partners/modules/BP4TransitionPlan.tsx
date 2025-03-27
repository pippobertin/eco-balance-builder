
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useBP4Data } from '../hooks/bp4';
import { SaveButton, SectionAutoSaveIndicator } from '../components';
import { Info, BarChart3 } from 'lucide-react';

interface BP4TransitionPlanProps {
  reportId: string;
}

const BP4TransitionPlan: React.FC<BP4TransitionPlanProps> = ({ reportId }) => {
  const { formData, setFormData, isLoading, saveData, lastSaved, needsSaving } = useBP4Data(reportId);

  const handleCheckboxChange = () => {
    setFormData(prev => ({
      ...prev,
      hasTransitionPlan: !prev.hasTransitionPlan
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      transitionPlanDetails: e.target.value || undefined
    }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-blue-700" />
          </div>
          <div>
            <CardTitle>BP4 - Piano di transizione climatica</CardTitle>
            <CardDescription>
              Indicare se l'impresa ha adottato un piano di transizione climatica e, in caso affermativo, i dettagli del piano.
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
              Un piano di transizione climatica è una strategia dettagliata che delinea come un'impresa ridurrà le proprie emissioni di gas serra e si adatterà ai cambiamenti climatici.
            </p>
          </div>

          <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-md">
            <Checkbox 
              id="hasTransitionPlan" 
              checked={formData.hasTransitionPlan}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="hasTransitionPlan" className="font-medium">
              L'impresa ha adottato un piano di transizione climatica
            </Label>
          </div>
          
          {formData.hasTransitionPlan && (
            <div className="space-y-3 p-4 border rounded-md">
              <Label htmlFor="transitionPlanDetails" className="font-medium">
                Dettagli del piano di transizione climatica
              </Label>
              <Textarea
                id="transitionPlanDetails"
                placeholder="Descrivere il piano di transizione climatica dell'impresa, includendo obiettivi, tempistiche e azioni pianificate..."
                value={formData.transitionPlanDetails || ''}
                onChange={handleTextareaChange}
                rows={6}
              />
            </div>
          )}
          
          <div className="flex justify-end mt-4 pt-4 border-t">
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

export default BP4TransitionPlan;
