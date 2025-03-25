import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBP1Data } from '../hooks/bp1';
import { SaveButton, SectionAutoSaveIndicator } from '../components';
import { Info } from 'lucide-react';

interface BP1RevenueSectorsProps {
  reportId: string;
}

const BP1RevenueSectors: React.FC<BP1RevenueSectorsProps> = ({ reportId }) => {
  const { formData, setFormData, isLoading, saveData, lastSaved, needsSaving } = useBP1Data(reportId);

  const handleCheckboxChange = (sectorName: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [sectorName]: !prev[sectorName]
    }));
  };

  const handleRevenueChange = (field: string, value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    setFormData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleSave = async () => {
    await saveData();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-700 p-1 rounded">BP1</span>
          Ricavi in settori specifici
        </CardTitle>
        <CardDescription>
          Indicare se l'impresa genera ricavi dai seguenti settori e, in caso affermativo, la percentuale di ricavi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-2 p-3 bg-blue-50 text-blue-700 rounded-md">
            <Info className="h-5 w-5 mt-0.5" />
            <p className="text-sm">
              Per ciascun settore, indicare se l'impresa genera ricavi da esso e, in caso positivo, la percentuale
              di tali ricavi sul totale dei ricavi.
            </p>
          </div>

          <div className="space-y-4">
            {/* Armi controverse */}
            <div className="border p-4 rounded-md bg-gray-50">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                  id="controversialWeapons" 
                  checked={formData.controversialWeapons}
                  onCheckedChange={() => handleCheckboxChange('controversialWeapons')}
                />
                <Label htmlFor="controversialWeapons" className="font-medium">
                  Armi controverse
                </Label>
              </div>
              
              {formData.controversialWeapons && (
                <div className="ml-6">
                  <Label htmlFor="controversialWeaponsRevenue" className="text-sm">
                    Percentuale dei ricavi (%)
                  </Label>
                  <Input
                    id="controversialWeaponsRevenue"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.controversialWeaponsRevenue ?? ''}
                    onChange={(e) => handleRevenueChange('controversialWeaponsRevenue', e.target.value)}
                    className="w-28 mt-1"
                  />
                </div>
              )}
            </div>

            {/* Tabacco */}
            <div className="border p-4 rounded-md bg-gray-50">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                  id="tobacco" 
                  checked={formData.tobacco}
                  onCheckedChange={() => handleCheckboxChange('tobacco')}
                />
                <Label htmlFor="tobacco" className="font-medium">
                  Tabacco
                </Label>
              </div>
              
              {formData.tobacco && (
                <div className="ml-6">
                  <Label htmlFor="tobaccoRevenue" className="text-sm">
                    Percentuale dei ricavi (%)
                  </Label>
                  <Input
                    id="tobaccoRevenue"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.tobaccoRevenue ?? ''}
                    onChange={(e) => handleRevenueChange('tobaccoRevenue', e.target.value)}
                    className="w-28 mt-1"
                  />
                </div>
              )}
            </div>

            {/* Combustibili fossili */}
            <div className="border p-4 rounded-md bg-gray-50">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                  id="fossilFuels" 
                  checked={formData.fossilFuels}
                  onCheckedChange={() => handleCheckboxChange('fossilFuels')}
                />
                <Label htmlFor="fossilFuels" className="font-medium">
                  Combustibili fossili
                </Label>
              </div>
              
              {formData.fossilFuels && (
                <div className="space-y-3 ml-6">
                  <div>
                    <Label htmlFor="coalRevenue" className="text-sm">
                      Percentuale dei ricavi da carbone (%)
                    </Label>
                    <Input
                      id="coalRevenue"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.coalRevenue ?? ''}
                      onChange={(e) => handleRevenueChange('coalRevenue', e.target.value)}
                      className="w-28 mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="oilRevenue" className="text-sm">
                      Percentuale dei ricavi da petrolio (%)
                    </Label>
                    <Input
                      id="oilRevenue"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.oilRevenue ?? ''}
                      onChange={(e) => handleRevenueChange('oilRevenue', e.target.value)}
                      className="w-28 mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="gasRevenue" className="text-sm">
                      Percentuale dei ricavi da gas (%)
                    </Label>
                    <Input
                      id="gasRevenue"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.gasRevenue ?? ''}
                      onChange={(e) => handleRevenueChange('gasRevenue', e.target.value)}
                      className="w-28 mt-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sostanze chimiche */}
            <div className="border p-4 rounded-md bg-gray-50">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                  id="chemicals" 
                  checked={formData.chemicals}
                  onCheckedChange={() => handleCheckboxChange('chemicals')}
                />
                <Label htmlFor="chemicals" className="font-medium">
                  Sostanze chimiche
                </Label>
              </div>
              
              {formData.chemicals && (
                <div className="ml-6">
                  <Label htmlFor="chemicalsRevenue" className="text-sm">
                    Percentuale dei ricavi (%)
                  </Label>
                  <Input
                    id="chemicalsRevenue"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.chemicalsRevenue ?? ''}
                    onChange={(e) => handleRevenueChange('chemicalsRevenue', e.target.value)}
                    className="w-28 mt-1"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <SectionAutoSaveIndicator
              lastSaved={lastSaved}
              needsSaving={needsSaving}
            />
            <SaveButton
              onClick={handleSave}
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
