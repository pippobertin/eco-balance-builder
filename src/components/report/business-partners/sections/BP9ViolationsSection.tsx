
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AutoSaveIndicator from '../components/AutoSaveIndicator';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useSectionData } from '../hooks/useSectionData';

interface BP9ViolationsProps {
  reportId: string;
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

interface BP9FormData {
  hasViolations: boolean;
  violationsDetails?: string;
}

const BP9ViolationsSection: React.FC<BP9ViolationsProps> = ({ 
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
  } = useSectionData<BP9FormData>({
    reportId,
    tableName: 'bp9_violations',
    initialData: {
      hasViolations: false
    }
  });

  // Aggiorna il formValues globale quando i dati della sezione cambiano
  React.useEffect(() => {
    setFormValues(prevValues => ({
      ...prevValues,
      bp9Violations: sectionData
    }));
  }, [sectionData, setFormValues]);

  const handleCheckboxChange = () => {
    setSectionData(prev => ({
      ...prev,
      hasViolations: !prev.hasViolations
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSectionData(prev => ({
      ...prev,
      violationsDetails: e.target.value || undefined
    }));
  };

  const handleSave = async () => {
    await saveData(sectionData);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP9</span>
          Violazioni
        </CardTitle>
        <CardDescription>
          Indicare se l'impresa ha avuto violazioni di leggi o regolamenti ambientali o sociali negli ultimi anni.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-md">
            <Checkbox 
              id="hasViolations" 
              checked={sectionData.hasViolations}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="hasViolations" className="font-medium">
              L'impresa ha avuto violazioni di leggi o regolamenti negli ultimi anni
            </Label>
          </div>
          
          {sectionData.hasViolations && (
            <div className="space-y-2 p-4 border rounded-md">
              <Label htmlFor="violationsDetails" className="font-medium">
                Dettagli delle violazioni
              </Label>
              <Textarea
                id="violationsDetails"
                placeholder="Descrivere le violazioni, quando sono avvenute, e le misure correttive adottate..."
                value={sectionData.violationsDetails || ''}
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

export default BP9ViolationsSection;
