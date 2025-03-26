
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AutoSaveIndicator from '../components/AutoSaveIndicator';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useSectionData } from '../hooks/useSectionData';

interface BP4TransitionPlanProps {
  reportId: string;
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

interface BP4FormData {
  hasTransitionPlan: boolean;
  transitionPlanDetails?: string;
}

const BP4TransitionPlanSection: React.FC<BP4TransitionPlanProps> = ({ 
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
  } = useSectionData<BP4FormData>({
    reportId,
    tableName: 'bp4_transition_plan',
    initialData: {
      hasTransitionPlan: false
    }
  });

  // Aggiorna il formValues globale quando i dati della sezione cambiano
  React.useEffect(() => {
    setFormValues(prevValues => ({
      ...prevValues,
      bp4TransitionPlan: sectionData
    }));
  }, [sectionData, setFormValues]);

  const handleCheckboxChange = () => {
    setSectionData(prev => ({
      ...prev,
      hasTransitionPlan: !prev.hasTransitionPlan
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSectionData(prev => ({
      ...prev,
      transitionPlanDetails: e.target.value || undefined
    }));
  };

  const handleSave = async () => {
    await saveData(sectionData);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP4</span>
          Piano di transizione climatica
        </CardTitle>
        <CardDescription>
          Indicare se l'impresa ha adottato un piano di transizione climatica e, in caso affermativo, i dettagli del piano.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-md">
            <Checkbox 
              id="hasTransitionPlan" 
              checked={sectionData.hasTransitionPlan}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="hasTransitionPlan" className="font-medium">
              L'impresa ha adottato un piano di transizione climatica
            </Label>
          </div>
          
          {sectionData.hasTransitionPlan && (
            <div className="space-y-3 p-4 border rounded-md">
              <Label htmlFor="transitionPlanDetails" className="font-medium">
                Dettagli del piano di transizione climatica
              </Label>
              <Textarea
                id="transitionPlanDetails"
                placeholder="Descrivere il piano di transizione climatica dell'impresa, includendo obiettivi, tempistiche e azioni pianificate..."
                value={sectionData.transitionPlanDetails || ''}
                onChange={handleTextareaChange}
                rows={6}
              />
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

export default BP4TransitionPlanSection;
