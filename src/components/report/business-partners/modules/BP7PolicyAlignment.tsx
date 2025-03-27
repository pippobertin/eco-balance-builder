
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useBP7Data } from '../hooks/bp7';
import { SaveButton, SectionAutoSaveIndicator } from '../components';
import { Info } from 'lucide-react';

interface BP7PolicyAlignmentProps {
  reportId: string;
}

const BP7PolicyAlignment: React.FC<BP7PolicyAlignmentProps> = ({ reportId }) => {
  const { formData, setFormData, isLoading, saveData, lastSaved, needsSaving } = useBP7Data(reportId);

  const handleCheckboxChange = () => {
    setFormData(prev => ({
      ...prev,
      hasPoliciesAligned: !prev.hasPoliciesAligned
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      alignedInstruments: e.target.value || undefined
    }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-2">
            <span className="bg-orange-100 text-orange-700 p-1 rounded">BP7</span>
            Allineamento delle politiche
          </CardTitle>
          <CardDescription>
            Indicare se le politiche dell'impresa sono allineate con gli obiettivi dell'Accordo di Parigi sui cambiamenti climatici.
          </CardDescription>
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
              L'Accordo di Parigi è un trattato internazionale sui cambiamenti climatici che mira a limitare il riscaldamento globale ben al di sotto di 2°C rispetto ai livelli preindustriali.
            </p>
          </div>

          <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-md">
            <Checkbox 
              id="hasPoliciesAligned" 
              checked={formData.hasPoliciesAligned}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="hasPoliciesAligned" className="font-medium">
              Le politiche dell'impresa sono allineate con gli obiettivi dell'Accordo di Parigi
            </Label>
          </div>
          
          {formData.hasPoliciesAligned && (
            <div className="space-y-3 p-4 border rounded-md">
              <Label htmlFor="alignedInstruments" className="font-medium">
                Strumenti utilizzati per l'allineamento con l'Accordo di Parigi
              </Label>
              <Textarea
                id="alignedInstruments"
                placeholder="Descrivere gli strumenti, le metodologie o gli standard utilizzati per allineare le politiche dell'impresa con l'Accordo di Parigi..."
                value={formData.alignedInstruments || ''}
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

export default BP7PolicyAlignment;
