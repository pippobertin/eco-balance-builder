
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBP1Data } from './useBP1Data';
import { SaveButton } from '../../common';
import { format, formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { Clock, Loader2, Save, Check } from 'lucide-react';

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

  const formatSaveTime = () => {
    if (!lastSaved) return "Non salvato";
    return formatDistanceToNow(lastSaved, { addSuffix: true, locale: it });
  };

  const renderSaveIndicator = () => {
    if (isLoading) {
      return (
        <div className="flex items-center text-blue-600 text-sm">
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          <span>Caricamento in corso...</span>
        </div>
      );
    }
    
    if (needsSaving) {
      return (
        <div className="flex items-center text-amber-600 text-sm">
          <Clock className="h-4 w-4 mr-1" />
          <span>Modifiche non salvate</span>
        </div>
      );
    }
    
    if (lastSaved) {
      return (
        <div className="flex items-center text-green-600 text-sm">
          <Check className="h-4 w-4 mr-1" />
          <span>Salvato {formatSaveTime()}</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-gray-500 text-sm">
        <Clock className="h-4 w-4 mr-1" />
        <span>Non ancora salvato</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>BP1 - Ricavi in settori specifici</CardTitle>
            <CardDescription>
              Indica se l'azienda opera nei seguenti settori sensibili e, in caso affermativo, la percentuale di ricavi derivanti da tali attività.
            </CardDescription>
          </div>
          <div className="mt-2">
            {renderSaveIndicator()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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
              disabled={isLoading || !needsSaving}
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
