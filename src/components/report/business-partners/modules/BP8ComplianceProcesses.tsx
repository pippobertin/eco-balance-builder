
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useBP8Data } from '../hooks/bp8';
import { SaveButton, SectionAutoSaveIndicator } from '../components';
import { Info } from 'lucide-react';

interface BP8ComplianceProcessesProps {
  reportId: string;
}

const BP8ComplianceProcesses: React.FC<BP8ComplianceProcessesProps> = ({ reportId }) => {
  const { formData, setFormData, isLoading, saveData, lastSaved, needsSaving } = useBP8Data(reportId);

  const handleCheckboxChange = () => {
    setFormData(prev => ({
      ...prev,
      hasComplianceProcesses: !prev.hasComplianceProcesses
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      complianceProcessesDetails: e.target.value || undefined
    }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP8</span>
          Processi di conformità
        </CardTitle>
        <CardDescription>
          Indicare se l'impresa ha processi per garantire la conformità con le leggi e i regolamenti ambientali e sociali.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-2 p-3 bg-blue-50 text-blue-700 rounded-md">
            <Info className="h-5 w-5 mt-0.5" />
            <p className="text-sm">
              I processi di conformità sono sistemi e procedure che aiutano a garantire che l'impresa rispetti le leggi e i regolamenti applicabili.
            </p>
          </div>

          <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-md">
            <Checkbox 
              id="hasComplianceProcesses" 
              checked={formData.hasComplianceProcesses}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="hasComplianceProcesses" className="font-medium">
              L'impresa ha processi per garantire la conformità con le leggi e i regolamenti
            </Label>
          </div>
          
          {formData.hasComplianceProcesses && (
            <div className="space-y-3 p-4 border rounded-md">
              <Label htmlFor="complianceProcessesDetails" className="font-medium">
                Dettagli dei processi di conformità
              </Label>
              <Textarea
                id="complianceProcessesDetails"
                placeholder="Descrivere i processi, le procedure e i sistemi utilizzati per garantire la conformità..."
                value={formData.complianceProcessesDetails || ''}
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

export default BP8ComplianceProcesses;
