
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AutoSaveIndicator from '../components/AutoSaveIndicator';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useSectionData } from '../hooks/useSectionData';

interface BP6HazardousWasteProps {
  reportId: string;
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

interface BP6FormData {
  hasHazardousWaste: boolean;
  hazardousWasteTotal?: number;
  radioactiveWasteTotal?: number;
}

const BP6HazardousWasteSection: React.FC<BP6HazardousWasteProps> = ({ 
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
  } = useSectionData<BP6FormData>({
    reportId,
    tableName: 'bp6_hazardous_waste',
    initialData: {
      hasHazardousWaste: false
    }
  });

  // Aggiorna il formValues globale quando i dati della sezione cambiano
  React.useEffect(() => {
    setFormValues(prevValues => ({
      ...prevValues,
      bp6HazardousWaste: sectionData
    }));
  }, [sectionData, setFormValues]);

  const handleCheckboxChange = () => {
    setSectionData(prev => ({
      ...prev,
      hasHazardousWaste: !prev.hasHazardousWaste
    }));
  };

  const handleInputChange = (field: keyof BP6FormData, value: string) => {
    let parsedValue: number | undefined = undefined;
    
    if (value !== '') {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) parsedValue = undefined;
    }
    
    setSectionData(prev => ({
      ...prev,
      [field]: parsedValue
    }));
  };

  const handleSave = async () => {
    await saveData(sectionData);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP6</span>
          Rifiuti pericolosi
        </CardTitle>
        <CardDescription>
          Indicare se l'impresa produce rifiuti pericolosi e le quantità prodotte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-md">
            <Checkbox 
              id="hasHazardousWaste" 
              checked={sectionData.hasHazardousWaste}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="hasHazardousWaste" className="font-medium">
              L'impresa produce rifiuti pericolosi
            </Label>
          </div>
          
          {sectionData.hasHazardousWaste && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
              <div className="space-y-2">
                <Label htmlFor="hazardousWasteTotal">
                  Totale rifiuti pericolosi (ton/anno)
                </Label>
                <Input
                  id="hazardousWasteTotal"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Inserisci la quantità"
                  value={sectionData.hazardousWasteTotal ?? ''}
                  onChange={(e) => handleInputChange('hazardousWasteTotal', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="radioactiveWasteTotal">
                  Totale rifiuti radioattivi (ton/anno)
                </Label>
                <Input
                  id="radioactiveWasteTotal"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Inserisci la quantità"
                  value={sectionData.radioactiveWasteTotal ?? ''}
                  onChange={(e) => handleInputChange('radioactiveWasteTotal', e.target.value)}
                />
              </div>
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

export default BP6HazardousWasteSection;
