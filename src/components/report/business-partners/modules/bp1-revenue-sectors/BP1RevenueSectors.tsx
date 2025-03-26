
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Factory } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SaveButton, SectionAutoSaveIndicator } from '../../common';
import { useBP1Data } from './useBP1Data';

interface BP1RevenueSectorsProps {
  reportId: string;
}

const BP1RevenueSectors: React.FC<BP1RevenueSectorsProps> = ({ reportId }) => {
  const { 
    formData,
    setFormData,
    isLoading,
    saveData,
    lastSaved,
    needsSaving
  } = useBP1Data(reportId);

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? undefined : parseFloat(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP1</span>
          Ricavi in settori specifici
        </CardTitle>
        <CardDescription>
          Indica se l'impresa è attiva in uno o più dei seguenti settori e, in caso affermativo, i relativi ricavi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="controversialWeapons" 
                checked={formData.controversialWeapons} 
                onCheckedChange={checked => handleCheckboxChange('controversialWeapons', !!checked)} 
              />
              <Label htmlFor="controversialWeapons">
                Armi controverse (mine antiuomo, munizioni a grappolo, armi chimiche e biologiche)
              </Label>
            </div>
            
            {formData.controversialWeapons && (
              <div className="ml-6 pl-2 border-l-2 border-gray-200">
                <Label htmlFor="controversialWeaponsRevenue" className="block mb-1 text-sm">
                  Ricavi da armi controverse (€)
                </Label>
                <Input
                  id="controversialWeaponsRevenue"
                  name="controversialWeaponsRevenue"
                  type="number"
                  min="0"
                  value={formData.controversialWeaponsRevenue ?? ''}
                  onChange={handleInputChange}
                  className="w-full md:w-1/2"
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="tobacco" 
                checked={formData.tobacco} 
                onCheckedChange={checked => handleCheckboxChange('tobacco', !!checked)} 
              />
              <Label htmlFor="tobacco">Coltivazione e produzione di tabacco</Label>
            </div>
            
            {formData.tobacco && (
              <div className="ml-6 pl-2 border-l-2 border-gray-200">
                <Label htmlFor="tobaccoRevenue" className="block mb-1 text-sm">
                  Ricavi da tabacco (€)
                </Label>
                <Input
                  id="tobaccoRevenue"
                  name="tobaccoRevenue"
                  type="number"
                  min="0"
                  value={formData.tobaccoRevenue ?? ''}
                  onChange={handleInputChange}
                  className="w-full md:w-1/2"
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="fossilFuels" 
                checked={formData.fossilFuels} 
                onCheckedChange={checked => handleCheckboxChange('fossilFuels', !!checked)} 
              />
              <Label htmlFor="fossilFuels">Combustibili fossili (carbone, petrolio, gas)</Label>
            </div>
            
            {formData.fossilFuels && (
              <div className="ml-6 pl-2 border-l-2 border-gray-200 space-y-3">
                <div>
                  <Label htmlFor="coalRevenue" className="block mb-1 text-sm">
                    Ricavi da carbone (€)
                  </Label>
                  <Input
                    id="coalRevenue"
                    name="coalRevenue"
                    type="number"
                    min="0"
                    value={formData.coalRevenue ?? ''}
                    onChange={handleInputChange}
                    className="w-full md:w-1/2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="oilRevenue" className="block mb-1 text-sm">
                    Ricavi da petrolio (€)
                  </Label>
                  <Input
                    id="oilRevenue"
                    name="oilRevenue"
                    type="number"
                    min="0"
                    value={formData.oilRevenue ?? ''}
                    onChange={handleInputChange}
                    className="w-full md:w-1/2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="gasRevenue" className="block mb-1 text-sm">
                    Ricavi da gas naturale (€)
                  </Label>
                  <Input
                    id="gasRevenue"
                    name="gasRevenue"
                    type="number"
                    min="0"
                    value={formData.gasRevenue ?? ''}
                    onChange={handleInputChange}
                    className="w-full md:w-1/2"
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="chemicals" 
                checked={formData.chemicals} 
                onCheckedChange={checked => handleCheckboxChange('chemicals', !!checked)} 
              />
              <Label htmlFor="chemicals">Produzione di sostanze chimiche dannose</Label>
            </div>
            
            {formData.chemicals && (
              <div className="ml-6 pl-2 border-l-2 border-gray-200">
                <Label htmlFor="chemicalsRevenue" className="block mb-1 text-sm">
                  Ricavi da sostanze chimiche (€)
                </Label>
                <Input
                  id="chemicalsRevenue"
                  name="chemicalsRevenue"
                  type="number"
                  min="0"
                  value={formData.chemicalsRevenue ?? ''}
                  onChange={handleInputChange}
                  className="w-full md:w-1/2"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <SectionAutoSaveIndicator
              lastSaved={lastSaved}
              needsSaving={needsSaving}
            />
            <SaveButton
              onClick={saveData}
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

export default BP1RevenueSectors;
