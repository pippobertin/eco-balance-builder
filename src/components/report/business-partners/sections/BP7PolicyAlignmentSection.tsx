
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AutoSaveIndicator from '../components/AutoSaveIndicator';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useSectionData } from '../hooks/useSectionData';

interface BP7PolicyAlignmentProps {
  reportId: string;
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

interface BP7FormData {
  hasPoliciesAligned: boolean;
  alignedInstruments?: string;
}

const BP7PolicyAlignmentSection: React.FC<BP7PolicyAlignmentProps> = ({ 
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
  } = useSectionData<BP7FormData>({
    reportId,
    tableName: 'bp7_policy_alignment',
    initialData: {
      hasPoliciesAligned: false
    }
  });

  // Aggiorna il formValues globale quando i dati della sezione cambiano
  React.useEffect(() => {
    setFormValues(prevValues => ({
      ...prevValues,
      bp7PolicyAlignment: sectionData
    }));
  }, [sectionData, setFormValues]);

  const handleCheckboxChange = () => {
    setSectionData(prev => ({
      ...prev,
      hasPoliciesAligned: !prev.hasPoliciesAligned
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSectionData(prev => ({
      ...prev,
      alignedInstruments: e.target.value || undefined
    }));
  };

  const handleSave = async () => {
    await saveData(sectionData);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP7</span>
          Allineamento delle politiche
        </CardTitle>
        <CardDescription>
          Indicare se le politiche dell'impresa sono allineate con gli obiettivi dell'Accordo di Parigi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-md">
            <Checkbox 
              id="hasPoliciesAligned" 
              checked={sectionData.hasPoliciesAligned}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="hasPoliciesAligned" className="font-medium">
              Le politiche dell'impresa sono allineate con gli obiettivi dell'Accordo di Parigi
            </Label>
          </div>
          
          {sectionData.hasPoliciesAligned && (
            <div className="space-y-2 p-4 border rounded-md">
              <Label htmlFor="alignedInstruments" className="font-medium">
                Strumenti utilizzati per l'allineamento
              </Label>
              <Textarea
                id="alignedInstruments"
                placeholder="Descrivere gli strumenti utilizzati per allineare le politiche con l'Accordo di Parigi..."
                value={sectionData.alignedInstruments || ''}
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

export default BP7PolicyAlignmentSection;
