
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface BP5PhysicalRisksProps {
  reportId: string;
}

const BP5PhysicalRisks: React.FC<BP5PhysicalRisksProps> = ({
  reportId
}) => {
  const [formData, setFormData] = useState({
    hasPhysicalClimateRisks: false,
    assetsAtRiskAmount: undefined as number | undefined,
    assetsAtRiskPercentage: undefined as number | undefined,
    adaptationCoverage: undefined as number | undefined,
    revenueAtRiskPercentage: undefined as number | undefined,
    riskAssetsLocation: undefined as string | undefined,
    realEstateEnergyEfficiency: undefined as string | undefined,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Carica i dati iniziali
  useEffect(() => {
    if (reportId) {
      loadData();
    }
  }, [reportId]);

  // Monitora le modifiche
  useEffect(() => {
    if (!initialLoad) {
      setNeedsSaving(true);
    }
  }, [formData]);

  const loadData = async () => {
    if (!reportId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bp5_physical_risks')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Error loading BP5 data:", error);
        toast.error("Errore nel caricamento dei dati sui rischi fisici");
        return;
      }
      
      if (data) {
        setFormData({
          hasPhysicalClimateRisks: data.has_physical_climate_risks || false,
          assetsAtRiskAmount: data.assets_at_risk_amount,
          assetsAtRiskPercentage: data.assets_at_risk_percentage,
          adaptationCoverage: data.adaptation_coverage,
          revenueAtRiskPercentage: data.revenue_at_risk_percentage,
          riskAssetsLocation: data.risk_assets_location,
          realEstateEnergyEfficiency: data.real_estate_energy_efficiency
        });
        
        setLastSaved(new Date(data.updated_at));
      }
    } catch (error) {
      console.error("Unexpected error loading BP5 data:", error);
      toast.error("Si è verificato un errore durante il caricamento dei dati");
    } finally {
      setIsLoading(false);
      setInitialLoad(false);
    }
  };

  const saveData = async () => {
    if (!reportId) {
      toast.error("ID report mancante. Impossibile salvare.");
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bp5_physical_risks')
        .upsert({
          report_id: reportId,
          has_physical_climate_risks: formData.hasPhysicalClimateRisks,
          assets_at_risk_amount: formData.assetsAtRiskAmount,
          assets_at_risk_percentage: formData.assetsAtRiskPercentage,
          adaptation_coverage: formData.adaptationCoverage,
          revenue_at_risk_percentage: formData.revenueAtRiskPercentage,
          risk_assets_location: formData.riskAssetsLocation,
          real_estate_energy_efficiency: formData.realEstateEnergyEfficiency,
          updated_at: new Date().toISOString()
        }, { onConflict: 'report_id' });
        
      if (error) {
        console.error("Error saving BP5 data:", error);
        toast.error("Errore durante il salvataggio dei dati");
        return;
      }
      
      setLastSaved(new Date());
      setNeedsSaving(false);
      toast.success("Dati rischi fisici salvati con successo");
    } catch (error) {
      console.error("Unexpected error saving BP5 data:", error);
      toast.error("Si è verificato un errore durante il salvataggio");
    } finally {
      setIsLoading(false);
    }
  };

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
