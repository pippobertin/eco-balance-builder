
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useBP9Data } from '../hooks/bp9';
import { SaveButton, SectionAutoSaveIndicator } from '../components';
import { Info } from 'lucide-react';

interface BP9ViolationsProps {
  reportId: string;
}

const BP9Violations: React.FC<BP9ViolationsProps> = ({ reportId }) => {
  const { formData, setFormData, isLoading, saveData, lastSaved, needsSaving } = useBP9Data(reportId);

  const handleCheckboxChange = () => {
    setFormData(prev => ({
      ...prev,
      hasViolations: !prev.hasViolations
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      violationsDetails: e.target.value || undefined
    }));
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
          <div className="flex items-start space-x-2 p-3 bg-blue-50 text-blue-700 rounded-md">
            <Info className="h-5 w-5 mt-0.5" />
            <p className="text-sm">
              Le violazioni possono includere sanzioni, multe, procedimenti giudiziari o altre forme di non conformità con le leggi e i regolamenti applicabili.
            </p>
          </div>

          <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-md">
            <Checkbox 
              id="hasViolations" 
              checked={formData.hasViolations}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="hasViolations" className="font-medium">
              L'impresa ha avuto violazioni di leggi o regolamenti negli ultimi anni
            </Label>
          </div>
          
          {formData.hasViolations && (
            <div className="space-y-3 p-4 border rounded-md">
              <Label htmlFor="violationsDetails" className="font-medium">
                Dettagli delle violazioni
              </Label>
              <Textarea
                id="violationsDetails"
                placeholder="Descrivere le violazioni, quando sono avvenute, e le misure correttive adottate..."
                value={formData.violationsDetails || ''}
                onChange={handleTextareaChange}
                rows={6}
              />
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

export default BP9Violations;
