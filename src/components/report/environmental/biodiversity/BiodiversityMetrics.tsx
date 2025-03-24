
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BiodiversityMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const BiodiversityMetrics: React.FC<BiodiversityMetricsProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      environmentalMetrics: {
        ...prev.environmentalMetrics,
        [name]: value
      }
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues((prev: any) => ({
      ...prev,
      environmentalMetrics: {
        ...prev.environmentalMetrics,
        [name]: value
      }
    }));
  };

  const environmentalMetrics = formValues.environmentalMetrics || {};

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h4 className="text-lg font-medium mb-4">Biodiversità - Metriche Base</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="landUse">Uso del suolo (m²)</Label>
            <Input
              id="landUse"
              name="landUse"
              type="number"
              value={environmentalMetrics.landUse || ''}
              onChange={handleChange}
              placeholder="0"
            />
            <p className="text-xs text-gray-500">
              Area totale di terreno utilizzata dall'azienda
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="impermeableSurface">Superficie impermeabile (m²)</Label>
            <Input
              id="impermeableSurface"
              name="impermeableSurface"
              type="number"
              value={environmentalMetrics.impermeableSurface || ''}
              onChange={handleChange}
              placeholder="0"
            />
            <p className="text-xs text-gray-500">
              Superficie totale impermeabile (edifici, asfalto, ecc.)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="natureSurfaceOnSite">Superficie naturale in loco (m²)</Label>
            <Input
              id="natureSurfaceOnSite"
              name="natureSurfaceOnSite"
              type="number"
              value={environmentalMetrics.natureSurfaceOnSite || ''}
              onChange={handleChange}
              placeholder="0"
            />
            <p className="text-xs text-gray-500">
              Superficie naturale mantenuta nei terreni aziendali
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="natureSurfaceOffSite">Superficie naturale fuori sede (m²)</Label>
            <Input
              id="natureSurfaceOffSite"
              name="natureSurfaceOffSite"
              type="number"
              value={environmentalMetrics.natureSurfaceOffSite || ''}
              onChange={handleChange}
              placeholder="0"
            />
            <p className="text-xs text-gray-500">
              Superficie naturale gestita dall'azienda al di fuori della proprietà
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sensitiveAreas">Vicinanza ad aree protette o sensibili</Label>
            <Select 
              value={environmentalMetrics.sensitiveAreas || ''}
              onValueChange={(value) => handleSelectChange('sensitiveAreas', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nessuna</SelectItem>
                <SelectItem value="nearby">Nelle vicinanze (entro 5 km)</SelectItem>
                <SelectItem value="adjacent">Adiacente</SelectItem>
                <SelectItem value="within">All'interno</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Relazione dell'azienda con aree protette o sensibili per la biodiversità
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BiodiversityMetrics;
