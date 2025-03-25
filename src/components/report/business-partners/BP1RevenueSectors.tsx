
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BusinessPartnersFieldData } from './hooks/types';
import SaveButton from './components/SaveButton';
import SectionAutoSaveIndicator from './components/SectionAutoSaveIndicator';

const BP1RevenueSectors: React.FC<BusinessPartnersFieldData> = ({
  formData,
  setFormData,
  saveData,
  isLoading,
  lastSaved,
  needsSaving,
  bpKey
}) => {
  const bp1 = formData.bp1;

  const handleSwitchChange = (field: keyof typeof bp1) => {
    if (typeof bp1[field] === 'boolean') {
      setFormData(prev => ({
        ...prev,
        bp1: {
          ...prev.bp1,
          [field]: !prev.bp1[field]
        }
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = value === '' ? undefined : parseFloat(value);
    
    setFormData(prev => ({
      ...prev,
      bp1: {
        ...prev.bp1,
        [name]: numberValue
      }
    }));
  };

  const handleSave = async () => {
    await saveData();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          BP1 - Settori di ricavo controversi
        </CardTitle>
        <div className="flex items-center space-x-2">
          <SectionAutoSaveIndicator 
            needsSaving={needsSaving} 
            lastSaved={lastSaved} 
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="controversial-weapons" className="flex-1">
                Armi controverse
              </Label>
              <Switch
                id="controversial-weapons"
                checked={bp1.controversialWeapons}
                onCheckedChange={() => handleSwitchChange('controversialWeapons')}
              />
            </div>
            
            {bp1.controversialWeapons && (
              <div>
                <Label htmlFor="controversial-weapons-revenue">Percentuale di ricavi (%)</Label>
                <Input
                  id="controversial-weapons-revenue"
                  name="controversialWeaponsRevenue"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={bp1.controversialWeaponsRevenue || ''}
                  onChange={handleInputChange}
                  placeholder="% dei ricavi"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="tobacco" className="flex-1">
                Tabacco
              </Label>
              <Switch
                id="tobacco"
                checked={bp1.tobacco}
                onCheckedChange={() => handleSwitchChange('tobacco')}
              />
            </div>
            
            {bp1.tobacco && (
              <div>
                <Label htmlFor="tobacco-revenue">Percentuale di ricavi (%)</Label>
                <Input
                  id="tobacco-revenue"
                  name="tobaccoRevenue"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={bp1.tobaccoRevenue || ''}
                  onChange={handleInputChange}
                  placeholder="% dei ricavi"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="fossil-fuels" className="flex-1">
                Combustibili fossili
              </Label>
              <Switch
                id="fossil-fuels"
                checked={bp1.fossilFuels}
                onCheckedChange={() => handleSwitchChange('fossilFuels')}
              />
            </div>
            
            {bp1.fossilFuels && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="coal-revenue">Percentuale di ricavi da carbone (%)</Label>
                  <Input
                    id="coal-revenue"
                    name="coalRevenue"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={bp1.coalRevenue || ''}
                    onChange={handleInputChange}
                    placeholder="% dei ricavi"
                  />
                </div>
                
                <div>
                  <Label htmlFor="oil-revenue">Percentuale di ricavi da petrolio (%)</Label>
                  <Input
                    id="oil-revenue"
                    name="oilRevenue"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={bp1.oilRevenue || ''}
                    onChange={handleInputChange}
                    placeholder="% dei ricavi"
                  />
                </div>
                
                <div>
                  <Label htmlFor="gas-revenue">Percentuale di ricavi da gas (%)</Label>
                  <Input
                    id="gas-revenue"
                    name="gasRevenue"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={bp1.gasRevenue || ''}
                    onChange={handleInputChange}
                    placeholder="% dei ricavi"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="chemicals" className="flex-1">
                Prodotti chimici
              </Label>
              <Switch
                id="chemicals"
                checked={bp1.chemicals}
                onCheckedChange={() => handleSwitchChange('chemicals')}
              />
            </div>
            
            {bp1.chemicals && (
              <div>
                <Label htmlFor="chemicals-revenue">Percentuale di ricavi (%)</Label>
                <Input
                  id="chemicals-revenue"
                  name="chemicalsRevenue"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={bp1.chemicalsRevenue || ''}
                  onChange={handleInputChange}
                  placeholder="% dei ricavi"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <SaveButton 
            onClick={handleSave} 
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BP1RevenueSectors;
