
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AutoSaveIndicator from '../components/AutoSaveIndicator';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useSectionData } from '../hooks/useSectionData';

interface BP8ComplianceProcessesProps {
  reportId: string;
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

interface BP8FormData {
  hasComplianceProcesses: boolean;
  complianceProcessesDetails?: string;
}

const BP8ComplianceProcessesSection: React.FC<BP8ComplianceProcessesProps> = ({ 
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
  } = useSectionData<BP8FormData>({
    reportId,
    tableName: 'bp8_compliance_processes',
    initialData: {
      hasComplianceProcesses: false
    }
  });

  // Aggiorna il formValues globale quando i dati della sezione cambiano
  React.useEffect(() => {
    setFormValues(prevValues => ({
      ...prevValues,
      bp8ComplianceProcesses: sectionData
    }));
  }, [sectionData, setFormValues]);

  const handleCheckboxChange = () => {
    setSectionData(prev => ({
      ...prev,
      hasComplianceProcesses: !prev.hasComplianceProcesses
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSectionData(prev => ({
      ...prev,
      complianceProcessesDetails: e.target.value || undefined
    }));
  };

  const handleSave = async () => {
    await saveData(sectionData);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP8</span>
          Processi di conformità
        </CardTitle>
        <CardDescription>
          Indicare se l'impresa ha processi per garantire la conformità con leggi e regolamenti ambientali e sociali.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-md">
            <Checkbox 
              id="hasComplianceProcesses" 
              checked={sectionData.hasComplianceProcesses}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="hasComplianceProcesses" className="font-medium">
              L'impresa ha processi per garantire la conformità con leggi e regolamenti
            </Label>
          </div>
          
          {sectionData.hasComplianceProcesses && (
            <div className="space-y-2 p-4 border rounded-md">
              <Label htmlFor="complianceProcessesDetails" className="font-medium">
                Dettagli dei processi di conformità
              </Label>
              <Textarea
                id="complianceProcessesDetails"
                placeholder="Descrivere i processi di conformità dell'impresa..."
                value={sectionData.complianceProcessesDetails || ''}
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

export default BP8ComplianceProcessesSection;
