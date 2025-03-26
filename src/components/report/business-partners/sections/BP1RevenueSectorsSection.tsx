
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AutoSaveIndicator from '../components/AutoSaveIndicator';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useSectionData } from '../hooks/useSectionData';

interface BP1RevenueSectorsProps {
  reportId: string;
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

interface BP1FormData {
  controversialWeapons: boolean;
  tobacco: boolean;
  fossilFuels: boolean;
  chemicals: boolean;
  controversialWeaponsRevenue?: number;
  tobaccoRevenue?: number;
  coalRevenue?: number;
  oilRevenue?: number;
  gasRevenue?: number;
  chemicalsRevenue?: number;
}

const BP1RevenueSectorsSection: React.FC<BP1RevenueSectorsProps> = ({ 
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
  } = useSectionData<BP1FormData>({
    reportId,
    tableName: 'bp1_revenue_sectors',
    initialData: {
      controversialWeapons: false,
      tobacco: false,
      fossilFuels: false,
      chemicals: false
    }
  });

  // Aggiorna il formValues globale quando i dati della sezione cambiano
  React.useEffect(() => {
    setFormValues(prevValues => ({
      ...prevValues,
      bp1RevenueSectors: sectionData
    }));
  }, [sectionData, setFormValues]);

  const handleCheckboxChange = (field: keyof BP1FormData) => {
    setSectionData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInputChange = (field: keyof BP1FormData, value: string) => {
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
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP1</span>
          Ricavi in settori specifici
        </CardTitle>
        <CardDescription>
          Indicare se l'impresa opera in settori potenzialmente controversi e, in caso affermativo, la percentuale di ricavi da tali attività.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Contenuto del form - semplificato per esempio */}
          <div className="space-y-2 p-4 bg-gray-50 rounded-md">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="controversialWeapons" 
                checked={sectionData.controversialWeapons}
                onCheckedChange={() => handleCheckboxChange('controversialWeapons')}
              />
              <Label htmlFor="controversialWeapons">Armi controverse</Label>
            </div>
            
            {sectionData.controversialWeapons && (
              <div className="ml-6 mt-2">
                <Label htmlFor="controversialWeaponsRevenue">% ricavi</Label>
                <Input
                  id="controversialWeaponsRevenue"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="% ricavi"
                  value={sectionData.controversialWeaponsRevenue ?? ''}
                  onChange={(e) => handleInputChange('controversialWeaponsRevenue', e.target.value)}
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="w-2/3">
              <AutoSaveIndicator
                lastSaved={lastSaved}
                needsSaving={needsSaving}
                isLoading={isSaving}
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={isLoading || isSaving || !needsSaving}
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

export default BP1RevenueSectorsSection;
