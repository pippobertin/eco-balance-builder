
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { BP1FormData } from './hooks/types';
import SaveButton from './components/SaveButton';
import SectionAutoSaveIndicator from './components/SectionAutoSaveIndicator';

interface BP1RevenueSectorsProps {
  formData: BP1FormData;
  setFormData: (data: BP1FormData) => void;
  saveData: () => Promise<boolean>;
  isLoading: boolean;
  lastSaved: Date | null;
  needsSaving: boolean;
}

const BP1RevenueSectors: React.FC<BP1RevenueSectorsProps> = ({
  formData,
  setFormData,
  saveData,
  isLoading,
  lastSaved,
  needsSaving
}) => {
  const handleCheckboxChange = (field: keyof BP1FormData) => {
    setFormData({
      ...formData,
      [field]: !formData[field]
    });
  };

  const handleInputChange = (field: keyof BP1FormData, value: number | undefined) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          BP1 - Settori collegati a combustibili fossili
        </CardTitle>
        <div className="flex items-center gap-2">
          <SectionAutoSaveIndicator 
            needsSaving={needsSaving} 
            lastSaved={lastSaved} 
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Controversial Weapons */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="controversialWeapons"
                checked={formData.controversialWeapons || false}
                onCheckedChange={() => handleCheckboxChange('controversialWeapons')}
              />
              <Label htmlFor="controversialWeapons">Armi controverse</Label>
            </div>
            {formData.controversialWeapons && (
              <div>
                <Label htmlFor="controversialWeaponsRevenue" className="text-sm">
                  Ricavi da armi controverse (%)
                </Label>
                <Input
                  id="controversialWeaponsRevenue"
                  type="number"
                  value={formData.controversialWeaponsRevenue || ''}
                  onChange={(e) => handleInputChange('controversialWeaponsRevenue', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Percentuale dei ricavi"
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {/* Tobacco */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="tobacco"
                checked={formData.tobacco || false}
                onCheckedChange={() => handleCheckboxChange('tobacco')}
              />
              <Label htmlFor="tobacco">Tabacco</Label>
            </div>
            {formData.tobacco && (
              <div>
                <Label htmlFor="tobaccoRevenue" className="text-sm">
                  Ricavi da tabacco (%)
                </Label>
                <Input
                  id="tobaccoRevenue"
                  type="number"
                  value={formData.tobaccoRevenue || ''}
                  onChange={(e) => handleInputChange('tobaccoRevenue', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Percentuale dei ricavi"
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {/* Fossil Fuels */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="fossilFuels"
                checked={formData.fossilFuels || false}
                onCheckedChange={() => handleCheckboxChange('fossilFuels')}
              />
              <Label htmlFor="fossilFuels">Combustibili fossili</Label>
            </div>
            {formData.fossilFuels && (
              <div>
                <div>
                  <Label htmlFor="coal-revenue" className="text-sm">
                    Ricavi da carbone (%)
                  </Label>
                  <Input
                    id="coal-revenue"
                    type="number"
                    value={formData.coalRevenue || ''}
                    onChange={(e) => handleInputChange('coalRevenue', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Percentuale dei ricavi"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="oil-revenue" className="text-sm">
                    Ricavi da petrolio (%)
                  </Label>
                  <Input
                    id="oil-revenue"
                    type="number"
                    value={formData.oilRevenue || ''}
                    onChange={(e) => handleInputChange('oilRevenue', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Percentuale dei ricavi"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="gas-revenue" className="text-sm">
                    Ricavi da gas (%)
                  </Label>
                  <Input
                    id="gas-revenue"
                    type="number"
                    value={formData.gasRevenue || ''}
                    onChange={(e) => handleInputChange('gasRevenue', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Percentuale dei ricavi"
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Chemicals */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="chemicals"
                checked={formData.chemicals || false}
                onCheckedChange={() => handleCheckboxChange('chemicals')}
              />
              <Label htmlFor="chemicals">Prodotti chimici</Label>
            </div>
            {formData.chemicals && (
              <div>
                <Label htmlFor="chemicals-revenue" className="text-sm">
                  Ricavi da prodotti chimici (%)
                </Label>
                <Input
                  id="chemicals-revenue"
                  type="number"
                  value={formData.chemicalsRevenue || ''}
                  onChange={(e) => handleInputChange('chemicalsRevenue', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Percentuale dei ricavi"
                  className="mt-1"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <SaveButton
              onClick={saveData}
              isLoading={isLoading}
              className="ml-auto"
            >
              Salva dati settori di ricavo
            </SaveButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BP1RevenueSectors;
