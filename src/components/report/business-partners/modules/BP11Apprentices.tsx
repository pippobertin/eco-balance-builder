
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';
import { SaveButton, SectionAutoSaveIndicator } from '../components';
import { useBP11Data } from '../hooks/bp11';

interface BP11ApprenticesProps {
  reportId: string;
}

const BP11Apprentices: React.FC<BP11ApprenticesProps> = ({ reportId }) => {
  const {
    formData,
    setFormData,
    isLoading,
    isSaving,
    lastSaved,
    needsSaving,
    saveData,
    totalEmployees
  } = useBP11Data(reportId);

  const handleCheckboxChange = () => {
    setFormData(prev => ({
      ...prev,
      hasApprentices: !prev.hasApprentices
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? undefined : Number(e.target.value);
    setFormData(prev => ({
      ...prev,
      apprenticesNumber: value
    }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP11</span>
          Apprendisti
        </CardTitle>
        <CardDescription>
          Indicare se l'impresa impiega apprendisti e, in caso affermativo, il loro numero e percentuale.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-2 p-3 bg-blue-50 text-blue-700 rounded-md">
            <Info className="h-5 w-5 mt-0.5" />
            <p className="text-sm">
              L'apprendistato è una forma di lavoro che combina formazione professionale e lavoro retribuito, tipicamente rivolta ai giovani.
              {totalEmployees ? ` Il numero totale di dipendenti rilevato è: ${totalEmployees}.` : ' Nessun dato sul numero totale di dipendenti rilevato.'}
            </p>
          </div>

          <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-md">
            <Checkbox 
              id="hasApprentices" 
              checked={formData.hasApprentices}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="hasApprentices" className="font-medium">
              L'impresa impiega apprendisti
            </Label>
          </div>
          
          {formData.hasApprentices && (
            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="font-medium">Dettagli sugli apprendisti</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apprenticesNumber">
                    Numero totale di apprendisti
                  </Label>
                  <Input
                    id="apprenticesNumber"
                    type="number"
                    min="0"
                    value={formData.apprenticesNumber ?? ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apprenticesPercentage">
                    Percentuale sul totale dei dipendenti (%)
                  </Label>
                  <Input
                    id="apprenticesPercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.apprenticesPercentage ?? ''}
                    readOnly
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Calcolato automaticamente dal numero di apprendisti e dal numero totale di dipendenti.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-4 border-t">
            <SectionAutoSaveIndicator
              lastSaved={lastSaved}
              needsSaving={needsSaving}
              isLoading={isSaving}
            />
            <SaveButton
              onClick={async () => {
                await saveData();
              }}
              isLoading={isLoading || isSaving}
            >
              Salva
            </SaveButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BP11Apprentices;
