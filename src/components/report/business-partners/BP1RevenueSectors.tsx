
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Factory, Save } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { SaveButton, SectionAutoSaveIndicator } from './components';
import { useBP1Data } from './hooks/bp1';
import { useReport } from '@/hooks/use-report-context';
import { Button } from '@/components/ui/button';

interface BP1RevenueSectorsProps {
  reportId: string;
}

const BP1RevenueSectors: React.FC<BP1RevenueSectorsProps> = ({ reportId }) => {
  const { updateReportData } = useReport();
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

  const handleSave = async () => {
    const success = await saveData();
    if (success) {
      // Update the global report data context with the new values
      updateReportData({
        businessPartnersMetrics: {
          bp1: formData
        }
      });
    }
  };

  if (isLoading) {
    return <div className="p-4">Caricamento dati...</div>;
  }

  return (
    <GlassmorphicCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Factory className="mr-2 h-5 w-5 text-gray-600" />
          <h3 className="text-xl font-semibold">BP1 - Ricavi in alcuni settori</h3>
        </div>
        <SectionAutoSaveIndicator 
          needsSaving={needsSaving} 
          lastSaved={lastSaved} 
        />
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Indica se l'impresa è attiva in uno o più dei seguenti settori e, in caso affermativo, i relativi ricavi.
        </p>
        
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
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="tobacco" 
              checked={formData.tobacco} 
              onCheckedChange={checked => handleCheckboxChange('tobacco', !!checked)} 
            />
            <Label htmlFor="tobacco">Coltivazione e produzione di tabacco</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="fossilFuels" 
              checked={formData.fossilFuels} 
              onCheckedChange={checked => handleCheckboxChange('fossilFuels', !!checked)} 
            />
            <Label htmlFor="fossilFuels">
              Settore dei combustibili fossili (carbone, petrolio e gas)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="chemicals" 
              checked={formData.chemicals} 
              onCheckedChange={checked => handleCheckboxChange('chemicals', !!checked)} 
            />
            <Label htmlFor="chemicals">
              Produzione di sostanze chimiche (divisione 20.2 dell'allegato I del Regolamento CE n. 1893/2006)
            </Label>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="controversialWeaponsRevenue">Ricavi da armi controverse (€)</Label>
            <Input 
              id="controversialWeaponsRevenue" 
              name="controversialWeaponsRevenue" 
              type="number" 
              placeholder="0.0" 
              value={formData.controversialWeaponsRevenue?.toString() || ""} 
              onChange={handleInputChange} 
              disabled={!formData.controversialWeapons} 
            />
          </div>
          
          <div>
            <Label htmlFor="tobaccoRevenue">Ricavi da tabacco (€)</Label>
            <Input 
              id="tobaccoRevenue" 
              name="tobaccoRevenue" 
              type="number" 
              placeholder="0.0" 
              value={formData.tobaccoRevenue?.toString() || ""} 
              onChange={handleInputChange} 
              disabled={!formData.tobacco} 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="coalRevenue">Ricavi da carbone (€)</Label>
            <Input 
              id="coalRevenue" 
              name="coalRevenue" 
              type="number" 
              placeholder="0.0" 
              value={formData.coalRevenue?.toString() || ""} 
              onChange={handleInputChange} 
              disabled={!formData.fossilFuels} 
            />
          </div>
          
          <div>
            <Label htmlFor="oilRevenue">Ricavi da petrolio (€)</Label>
            <Input 
              id="oilRevenue" 
              name="oilRevenue" 
              type="number" 
              placeholder="0.0" 
              value={formData.oilRevenue?.toString() || ""} 
              onChange={handleInputChange} 
              disabled={!formData.fossilFuels} 
            />
          </div>
          
          <div>
            <Label htmlFor="gasRevenue">Ricavi da gas (€)</Label>
            <Input 
              id="gasRevenue" 
              name="gasRevenue" 
              type="number" 
              placeholder="0.0" 
              value={formData.gasRevenue?.toString() || ""} 
              onChange={handleInputChange} 
              disabled={!formData.fossilFuels} 
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="chemicalsRevenue">Ricavi da produzione di sostanze chimiche (€)</Label>
          <Input 
            id="chemicalsRevenue" 
            name="chemicalsRevenue" 
            type="number" 
            placeholder="0.0" 
            value={formData.chemicalsRevenue?.toString() || ""} 
            onChange={handleInputChange} 
            disabled={!formData.chemicals} 
          />
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            onClick={handleSave} 
            disabled={isLoading || !needsSaving}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Salva dati ricavi</span>
          </Button>
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default BP1RevenueSectors;
