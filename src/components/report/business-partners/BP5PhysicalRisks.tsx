
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Clock } from 'lucide-react';
import { BP5FormData } from './hooks/types';

interface BP5PhysicalRisksProps {
  formData: BP5FormData;
  setFormData: React.Dispatch<React.SetStateAction<BP5FormData>>;
  saveData: () => Promise<boolean>;
  isLoading: boolean;
  lastSaved: Date | null;
  needsSaving: boolean;
}

const BP5PhysicalRisks: React.FC<BP5PhysicalRisksProps> = ({
  formData,
  setFormData,
  saveData,
  isLoading,
  lastSaved,
  needsSaving
}) => {

  const handleCheckboxChange = () => {
    setFormData(prev => ({
      ...prev,
      hasPhysicalClimateRisks: !prev.hasPhysicalClimateRisks
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    const numericValue = field === 'realEstateEnergyEfficiency' 
      ? value 
      : value === '' ? undefined : Number(value);
    
    setFormData(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Componente indicatore salvataggio
  const SaveIndicator = () => (
    <div 
      className={`flex items-center text-xs gap-1 transition-all ${
        needsSaving ? "text-amber-500" : "text-green-500"
      }`}
    >
      {needsSaving ? (
        <>
          <Clock className="h-3 w-3" />
          <span>Modifiche non salvate</span>
        </>
      ) : (
        <>
          <CheckCircle className="h-3 w-3" />
          <span>
            {lastSaved 
              ? `Salvato ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
              : 'Nessuna modifica'}
          </span>
        </>
      )}
    </div>
  );

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">
          BP5 - Attività soggette a rischi fisici legati al clima
        </CardTitle>
        <div className="flex items-center gap-2">
          <SaveIndicator />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox 
              id="hasPhysicalClimateRisks" 
              checked={formData.hasPhysicalClimateRisks || false}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="hasPhysicalClimateRisks">
              L'impresa ha attività soggette a rischi fisici legati al clima
            </Label>
          </div>
          
          {formData.hasPhysicalClimateRisks && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assetsAtRiskAmount">Importo delle attività a rischio (€)</Label>
                <Input 
                  id="assetsAtRiskAmount" 
                  type="number" 
                  placeholder="0.0" 
                  value={formData.assetsAtRiskAmount || ''} 
                  onChange={(e) => handleInputChange('assetsAtRiskAmount', e.target.value)} 
                />
              </div>
              
              <div>
                <Label htmlFor="assetsAtRiskPercentage">Percentuale delle attività a rischio (%)</Label>
                <Input 
                  id="assetsAtRiskPercentage" 
                  type="number" 
                  placeholder="0.0" 
                  value={formData.assetsAtRiskPercentage || ''} 
                  onChange={(e) => handleInputChange('assetsAtRiskPercentage', e.target.value)} 
                />
              </div>
              
              <div>
                <Label htmlFor="adaptationCoverage">Copertura delle misure di adattamento (%)</Label>
                <Input 
                  id="adaptationCoverage" 
                  type="number" 
                  placeholder="0.0" 
                  value={formData.adaptationCoverage || ''} 
                  onChange={(e) => handleInputChange('adaptationCoverage', e.target.value)} 
                />
              </div>
              
              <div>
                <Label htmlFor="revenueAtRiskPercentage">Percentuale del fatturato a rischio (%)</Label>
                <Input 
                  id="revenueAtRiskPercentage" 
                  type="number" 
                  placeholder="0.0" 
                  value={formData.revenueAtRiskPercentage || ''} 
                  onChange={(e) => handleInputChange('revenueAtRiskPercentage', e.target.value)} 
                />
              </div>
              
              <div>
                <Label htmlFor="riskAssetsLocation">Ubicazione delle attività a rischio</Label>
                <Input 
                  id="riskAssetsLocation" 
                  type="text" 
                  placeholder="Descrivi dove sono situate le attività a rischio" 
                  value={formData.riskAssetsLocation || ''} 
                  onChange={(e) => handleInputChange('riskAssetsLocation', e.target.value)} 
                />
              </div>
              
              <div>
                <Label htmlFor="realEstateEnergyEfficiency">Classe di efficienza energetica (immobili)</Label>
                <Select 
                  value={formData.realEstateEnergyEfficiency || ''} 
                  onValueChange={(value) => handleSelectChange('realEstateEnergyEfficiency', value)}
                >
                  <SelectTrigger id="realEstateEnergyEfficiency">
                    <SelectValue placeholder="Seleziona una classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Classe A</SelectItem>
                    <SelectItem value="B">Classe B</SelectItem>
                    <SelectItem value="C">Classe C</SelectItem>
                    <SelectItem value="D">Classe D</SelectItem>
                    <SelectItem value="E">Classe E</SelectItem>
                    <SelectItem value="F">Classe F</SelectItem>
                    <SelectItem value="G">Classe G</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button 
              variant="default" 
              onClick={saveData} 
              disabled={isLoading}
              className="ml-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                "Salva dati BP5"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BP5PhysicalRisks;
