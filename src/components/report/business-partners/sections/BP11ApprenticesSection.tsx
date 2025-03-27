
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AutoSaveIndicator from '../components/AutoSaveIndicator';
import { Button } from '@/components/ui/button';
import { Save, Info } from 'lucide-react';
import { useSectionData } from '../hooks/useSectionData';
import { supabase } from '@/integrations/supabase/client';

interface BP11ApprenticesProps {
  reportId: string;
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

interface BP11FormData {
  hasApprentices: boolean;
  apprenticesNumber?: number;
  apprenticesPercentage?: number;
}

const BP11ApprenticesSection: React.FC<BP11ApprenticesProps> = ({ 
  reportId, 
  formValues, 
  setFormValues 
}) => {
  const [totalEmployees, setTotalEmployees] = React.useState<number | null>(null);
  
  const {
    data: sectionData,
    setData: setSectionData,
    isLoading,
    isSaving,
    lastSaved,
    needsSaving,
    saveData
  } = useSectionData<BP11FormData>({
    reportId,
    tableName: 'bp11_apprentices',
    initialData: {
      hasApprentices: false
    }
  });

  // Fetch total employees
  React.useEffect(() => {
    const fetchTotalEmployees = async () => {
      if (!reportId) return;
      
      try {
        const { data, error } = await supabase
          .from('workforce_distribution')
          .select('total_employees')
          .eq('report_id', reportId)
          .maybeSingle();
          
        if (error) {
          if (error.code !== 'PGRST116') {
            console.error("Error fetching workforce data:", error);
          }
        } else if (data && data.total_employees) {
          setTotalEmployees(data.total_employees);
        }
      } catch (error) {
        console.error("Unexpected error fetching total employees:", error);
      }
    };

    fetchTotalEmployees();
  }, [reportId]);

  // Aggiorna il formValues globale quando i dati della sezione cambiano
  React.useEffect(() => {
    setFormValues(prevValues => ({
      ...prevValues,
      bp11Apprentices: sectionData
    }));
  }, [sectionData, setFormValues]);

  // Calculate percentage automatically
  React.useEffect(() => {
    if (sectionData.hasApprentices && 
        sectionData.apprenticesNumber !== undefined && 
        totalEmployees && 
        totalEmployees > 0) {
      
      const calculatedPercentage = (sectionData.apprenticesNumber / totalEmployees) * 100;
      
      if (sectionData.apprenticesPercentage !== calculatedPercentage) {
        setSectionData(prev => ({
          ...prev,
          apprenticesPercentage: parseFloat(calculatedPercentage.toFixed(2))
        }));
      }
    }
  }, [sectionData.apprenticesNumber, totalEmployees, sectionData.hasApprentices]);

  const handleCheckboxChange = () => {
    setSectionData(prev => ({
      ...prev,
      hasApprentices: !prev.hasApprentices
    }));
  };

  const handleInputChange = (field: keyof BP11FormData, value: string) => {
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
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP11</span>
          Apprendisti
        </CardTitle>
        <CardDescription>
          Indicare se l'impresa impiega apprendisti e, in caso affermativo, quanti sono.
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
              checked={sectionData.hasApprentices}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="hasApprentices" className="font-medium">
              L'impresa impiega apprendisti
            </Label>
          </div>
          
          {sectionData.hasApprentices && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
              <div className="space-y-2">
                <Label htmlFor="apprenticesNumber">
                  Numero di apprendisti
                </Label>
                <Input
                  id="apprenticesNumber"
                  type="number"
                  min="0"
                  placeholder="Inserisci il numero"
                  value={sectionData.apprenticesNumber ?? ''}
                  onChange={(e) => handleInputChange('apprenticesNumber', e.target.value)}
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
                  step="0.01"
                  placeholder="Calcolato automaticamente"
                  value={sectionData.apprenticesPercentage ?? ''}
                  disabled
                  readOnly
                  className="bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Calcolato automaticamente dal numero di apprendisti e dal numero totale di dipendenti.
                </p>
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

export default BP11ApprenticesSection;
