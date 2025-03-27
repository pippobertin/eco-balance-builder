
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBP6Data } from '../hooks/bp6';
import { SaveButton, SectionAutoSaveIndicator } from '../components';
import { Info } from 'lucide-react';

interface BP6HazardousWasteProps {
  reportId: string;
}

const BP6HazardousWaste: React.FC<BP6HazardousWasteProps> = ({ reportId }) => {
  const { formData, setFormData, isLoading, saveData, lastSaved, needsSaving } = useBP6Data(reportId);

  const handleCheckboxChange = () => {
    setFormData(prev => ({
      ...prev,
      hasHazardousWaste: !prev.hasHazardousWaste
    }));
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    setFormData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP6</span>
          Rifiuti pericolosi
        </CardTitle>
        <CardDescription>
          Indicare se l'impresa produce rifiuti pericolosi e, in caso affermativo, le quantità prodotte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-2 p-3 bg-blue-50 text-blue-700 rounded-md">
            <Info className="h-5 w-5 mt-0.5" />
            <p className="text-sm">
              I rifiuti pericolosi sono quelli che presentano caratteristiche di pericolosità per la salute umana o per l'ambiente.
              I rifiuti radioattivi sono una sottocategoria di rifiuti pericolosi che contengono materiali radioattivi.
            </p>
          </div>

          <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-md">
            <Checkbox 
              id="hasHazardousWaste" 
              checked={formData.hasHazardousWaste}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="hasHazardousWaste" className="font-medium">
              L'impresa produce rifiuti pericolosi
            </Label>
          </div>
          
          {formData.hasHazardousWaste && (
            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="font-medium">Quantità di rifiuti pericolosi prodotti</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hazardousWasteTotal">
                    Rifiuti pericolosi totali (tonnellate/anno)
                  </Label>
                  <Input
                    id="hazardousWasteTotal"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.hazardousWasteTotal ?? ''}
                    onChange={(e) => handleInputChange('hazardousWasteTotal', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="radioactiveWasteTotal">
                    Rifiuti radioattivi (tonnellate/anno)
                  </Label>
                  <Input
                    id="radioactiveWasteTotal"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.radioactiveWasteTotal ?? ''}
                    onChange={(e) => handleInputChange('radioactiveWasteTotal', e.target.value)}
                  />
                </div>
              </div>
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

export default BP6HazardousWaste;
