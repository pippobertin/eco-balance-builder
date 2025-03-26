
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBP1Data } from './useBP1Data';
import { SaveButton } from '../../common';
import { 
  SectorSection, 
  FossilFuelInputs,
  SaveIndicator
} from './components';

interface BP1RevenueSectorsProps {
  reportId: string;
}

const BP1RevenueSectors: React.FC<BP1RevenueSectorsProps> = ({ reportId }) => {
  const { formData, setFormData, isLoading, saveData, lastSaved, needsSaving } = useBP1Data(reportId);
  const [saving, setSaving] = useState(false);

  // Log when component mounts with reportId
  useEffect(() => {
    console.log("BP1RevenueSectors component mounted with reportId:", reportId);
    
    // Log save indicator status for debugging
    if (lastSaved) {
      console.log("Initial lastSaved value:", lastSaved);
    } else {
      console.log("No initial lastSaved value");
    }
    
    console.log("Initial needsSaving value:", needsSaving);
  }, [reportId, lastSaved, needsSaving]);

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

  const handleSave = async () => {
    console.log("BP1 save button clicked");
    setSaving(true);
    try {
      const success = await saveData();
      console.log("BP1 save result:", success, "lastSaved:", lastSaved);
    } finally {
      setSaving(false);
    }
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
            <SaveIndicator
              isLoading={isLoading}
              isSaving={saving}
              needsSaving={needsSaving}
              lastSaved={lastSaved}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Controversial Weapons */}
          <SectorSection
            sectorId="controversialWeapons"
            sectorLabel="Armi controverse"
            checked={formData.controversialWeapons}
            onCheckChange={() => handleCheckboxChange('controversialWeapons')}
            revenueField="controversialWeaponsRevenue"
            revenueValue={formData.controversialWeaponsRevenue}
            onRevenueChange={handleRevenueChange}
          />

          {/* Tobacco */}
          <SectorSection
            sectorId="tobacco"
            sectorLabel="Tabacco"
            checked={formData.tobacco}
            onCheckChange={() => handleCheckboxChange('tobacco')}
            revenueField="tobaccoRevenue"
            revenueValue={formData.tobaccoRevenue}
            onRevenueChange={handleRevenueChange}
          />

          {/* Fossil Fuels */}
          <SectorSection
            sectorId="fossilFuels"
            sectorLabel="Combustibili fossili"
            checked={formData.fossilFuels}
            onCheckChange={() => handleCheckboxChange('fossilFuels')}
            revenueField=""
            revenueValue={undefined}
            onRevenueChange={handleRevenueChange}
          >
            {formData.fossilFuels && (
              <FossilFuelInputs
                coalRevenue={formData.coalRevenue}
                oilRevenue={formData.oilRevenue}
                gasRevenue={formData.gasRevenue}
                onRevenueChange={handleRevenueChange}
              />
            )}
          </SectorSection>

          {/* Chemicals */}
          <SectorSection
            sectorId="chemicals"
            sectorLabel="Prodotti chimici"
            checked={formData.chemicals}
            onCheckChange={() => handleCheckboxChange('chemicals')}
            revenueField="chemicalsRevenue"
            revenueValue={formData.chemicalsRevenue}
            onRevenueChange={handleRevenueChange}
          />

          <div className="flex justify-end mt-6">
            <SaveButton
              onClick={handleSave}
              isLoading={saving || isLoading}
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
