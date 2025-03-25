
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BP1FormData } from './hooks/types';
import { SaveButton, SectionAutoSaveIndicator } from './components/index';
import { SectorGroup } from './bp1';

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
          {/* Controversial Weapons Sector */}
          <SectorGroup
            checkboxId="controversialWeapons"
            checkboxLabel="Armi controverse"
            isChecked={formData.controversialWeapons || false}
            onCheckboxChange={() => handleCheckboxChange('controversialWeapons')}
            revenueSections={[
              {
                id: "controversialWeaponsRevenue",
                label: "Ricavi da armi controverse (%)",
                value: formData.controversialWeaponsRevenue || '',
                onChange: (value) => handleInputChange('controversialWeaponsRevenue', value)
              }
            ]}
          />

          {/* Tobacco Sector */}
          <SectorGroup
            checkboxId="tobacco"
            checkboxLabel="Tabacco"
            isChecked={formData.tobacco || false}
            onCheckboxChange={() => handleCheckboxChange('tobacco')}
            revenueSections={[
              {
                id: "tobaccoRevenue",
                label: "Ricavi da tabacco (%)",
                value: formData.tobaccoRevenue || '',
                onChange: (value) => handleInputChange('tobaccoRevenue', value)
              }
            ]}
          />

          {/* Fossil Fuels Sector */}
          <SectorGroup
            checkboxId="fossilFuels"
            checkboxLabel="Combustibili fossili"
            isChecked={formData.fossilFuels || false}
            onCheckboxChange={() => handleCheckboxChange('fossilFuels')}
            revenueSections={formData.fossilFuels ? [
              {
                id: "coal-revenue",
                label: "Ricavi da carbone (%)",
                value: formData.coalRevenue || '',
                onChange: (value) => handleInputChange('coalRevenue', value)
              },
              {
                id: "oil-revenue",
                label: "Ricavi da petrolio (%)",
                value: formData.oilRevenue || '',
                onChange: (value) => handleInputChange('oilRevenue', value)
              },
              {
                id: "gas-revenue",
                label: "Ricavi da gas (%)",
                value: formData.gasRevenue || '',
                onChange: (value) => handleInputChange('gasRevenue', value)
              }
            ] : []}
          />

          {/* Chemicals Sector */}
          <SectorGroup
            checkboxId="chemicals"
            checkboxLabel="Prodotti chimici"
            isChecked={formData.chemicals || false}
            onCheckboxChange={() => handleCheckboxChange('chemicals')}
            revenueSections={[
              {
                id: "chemicals-revenue",
                label: "Ricavi da prodotti chimici (%)",
                value: formData.chemicalsRevenue || '',
                onChange: (value) => handleInputChange('chemicalsRevenue', value)
              }
            ]}
          />

          <div className="flex justify-end mt-4">
            <SaveButton
              onClick={saveData}
              isLoading={isLoading}
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
