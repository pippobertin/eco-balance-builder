
import React, { ChangeEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BiodiversityTable from './BiodiversityTable';
import BiodiversityHeader from './BiodiversityHeader';
import useBiodiversityLandUse from '../hooks/biodiversity/useBiodiversityLandUse';
import { useReport } from '@/hooks/use-report-context';

const BiodiversityLandUse: React.FC = () => {
  const { currentReport } = useReport();
  const reportId = currentReport?.id;
  
  const { 
    data, 
    isLoading, 
    isSaving, 
    percentageChanges,
    saveData, 
    updateField,
    lastSaved
  } = useBiodiversityLandUse({ reportId });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // If it's a numeric field, convert to number or null
    if (['previousTotalLandUse', 'currentTotalLandUse', 
         'previousImpermeableSurface', 'currentImpermeableSurface',
         'previousNatureSurfaceOnsite', 'currentNatureSurfaceOnsite',
         'previousNatureSurfaceOffsite', 'currentNatureSurfaceOffsite'].includes(name)) {
      const numValue = value === '' ? null : Number(value);
      updateField(name as keyof typeof data, numValue);
    } else {
      updateField(name as keyof typeof data, value);
    }
  };

  const handleSelectChange = (value: string) => {
    updateField('areaUnit', value);
  };

  const handleSave = async () => {
    await saveData(data);
  };

  return (
    <div className="space-y-6">
      <BiodiversityHeader 
        reportId={reportId} 
        isSaving={isSaving} 
        lastSaved={lastSaved} 
      />
      
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-medium">Utilizzo del suolo e impatto sulla biodiversità</h4>
              <p className="text-sm text-gray-500">
                Dati su utilizzo del suolo, superfici impermeabili e aree orientate alla natura
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="areaUnit">Unità di misura:</Label>
              <Select 
                value={data.areaUnit} 
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Seleziona unità" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ha">ha</SelectItem>
                  <SelectItem value="m²">m²</SelectItem>
                  <SelectItem value="km²">km²</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <BiodiversityTable
            data={data}
            handleChange={handleChange}
            percentageChanges={percentageChanges}
          />

          <div className="mt-6 space-y-3">
            <Label htmlFor="sensitiveSitesDetails">
              Dettagli sui siti sensibili per la biodiversità
            </Label>
            <Textarea
              id="sensitiveSitesDetails"
              name="sensitiveSitesDetails"
              value={data.sensitiveSitesDetails || ''}
              onChange={handleChange}
              placeholder="Descrivi la vicinanza o relazione con aree naturali protette o siti ad alto valore di biodiversità"
              className="h-24"
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleSave} 
              disabled={isLoading || isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Salvataggio..." : "Salva"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BiodiversityLandUse;
