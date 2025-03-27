
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

  const handleCheckboxChange = (field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleRevenueChange = (field: string, value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    setFormData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-2">
            <span className="bg-orange-100 text-orange-700 p-1 rounded">BP1</span>
            Ricavi in settori specifici
          </CardTitle>
          <CardDescription>
            Indica se l'azienda opera nei seguenti settori sensibili e, in caso affermativo, la percentuale di ricavi derivanti da tali attività.
          </CardDescription>
        </div>
        <SectionAutoSaveIndicator
          lastSaved={lastSaved}
          needsSaving={needsSaving}
          isLoading={isLoading}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-start space-x-2 p-3 bg-blue-50 text-blue-700 rounded-md">
            <Info className="h-5 w-5 mt-0.5" />
            <p className="text-sm">
              Indica i settori sensibili in cui opera l'azienda e le relative percentuali di ricavi.
            </p>
          </div>

          {/* Controversial Weapons */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="controversialWeapons" 
                checked={formData.controversialWeapons} 
                onCheckedChange={() => handleCheckboxChange('controversialWeapons')}
              />
              <Label htmlFor="controversialWeapons">Armi controverse</Label>
            </div>
            {formData.controversialWeapons && (
              <div>
                <Label htmlFor="controversialWeaponsRevenue">Percentuale dei ricavi (%)</Label>
                <Input 
                  id="controversialWeaponsRevenue"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0-100"
                  value={formData.controversialWeaponsRevenue ?? ''}
                  onChange={(e) => handleRevenueChange('controversialWeaponsRevenue', e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {/* Tobacco */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="tobacco" 
                checked={formData.tobacco} 
                onCheckedChange={() => handleCheckboxChange('tobacco')}
              />
              <Label htmlFor="tobacco">Tabacco</Label>
            </div>
            {formData.tobacco && (
              <div>
                <Label htmlFor="tobaccoRevenue">Percentuale dei ricavi (%)</Label>
                <Input 
                  id="tobaccoRevenue"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0-100"
                  value={formData.tobaccoRevenue ?? ''}
                  onChange={(e) => handleRevenueChange('tobaccoRevenue', e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {/* Fossil Fuels */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="fossilFuels" 
                checked={formData.fossilFuels} 
                onCheckedChange={() => handleCheckboxChange('fossilFuels')}
              />
              <Label htmlFor="fossilFuels">Combustibili fossili</Label>
            </div>
            {formData.fossilFuels && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="coalRevenue">Carbone (%)</Label>
                  <Input 
                    id="coalRevenue"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    value={formData.coalRevenue ?? ''}
                    onChange={(e) => handleRevenueChange('coalRevenue', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="oilRevenue">Petrolio (%)</Label>
                  <Input 
                    id="oilRevenue"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    value={formData.oilRevenue ?? ''}
                    onChange={(e) => handleRevenueChange('oilRevenue', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="gasRevenue">Gas (%)</Label>
                  <Input 
                    id="gasRevenue"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    value={formData.gasRevenue ?? ''}
                    onChange={(e) => handleRevenueChange('gasRevenue', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Chemicals */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="chemicals" 
                checked={formData.chemicals} 
                onCheckedChange={() => handleCheckboxChange('chemicals')}
              />
              <Label htmlFor="chemicals">Prodotti chimici</Label>
            </div>
            {formData.chemicals && (
              <div>
                <Label htmlFor="chemicalsRevenue">Percentuale dei ricavi (%)</Label>
                <Input 
                  id="chemicalsRevenue"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0-100"
                  value={formData.chemicalsRevenue ?? ''}
                  onChange={(e) => handleRevenueChange('chemicalsRevenue', e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
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
