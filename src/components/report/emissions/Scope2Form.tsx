import React, { useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EnergyType, PeriodType } from '@/lib/emissions-types';

interface Scope2FormProps {
  energyType: EnergyType;
  setEnergyType: (value: EnergyType) => void;
  energyQuantity: string;
  setEnergyQuantity: (value: string) => void;
  renewablePercentage: number;
  setRenewablePercentage: (value: number) => void;
  periodType: PeriodType;
  setPeriodType: (value: PeriodType) => void;
  energyProvider?: string;
  setEnergyProvider?: (value: string) => void;
}

const ITALIAN_ENERGY_PROVIDERS = [
  { value: "enel", label: "Enel", renewablePercentage: 80 },
  { value: "eni", label: "Eni Plenitude", renewablePercentage: 40 },
  { value: "a2a", label: "A2A", renewablePercentage: 60 },
  { value: "edison", label: "Edison", renewablePercentage: 50 },
  { value: "hera", label: "Hera", renewablePercentage: 40 },
  { value: "iren", label: "Iren", renewablePercentage: 55 },
  { value: "acea", label: "Acea", renewablePercentage: 50 },
  { value: "sorgenia", label: "Sorgenia", renewablePercentage: 40 },
  { value: "axpo", label: "Axpo", renewablePercentage: 60 },
  { value: "engie", label: "Engie", renewablePercentage: 60 },
  { value: "illumia", label: "Illumia", renewablePercentage: 100 },
  { value: "dolomiti", label: "Dolomiti Energia", renewablePercentage: 90 },
  { value: "enegan", label: "Enegan", renewablePercentage: 100 },
  { value: "duferco", label: "Duferco", renewablePercentage: 40 },
  { value: "altro", label: "Altro", renewablePercentage: 0 }
];

const Scope2Form: React.FC<Scope2FormProps> = ({
  energyType,
  setEnergyType,
  energyQuantity,
  setEnergyQuantity,
  renewablePercentage,
  setRenewablePercentage,
  periodType,
  setPeriodType,
  energyProvider = "",
  setEnergyProvider = () => {}
}) => {
  useEffect(() => {
    if (energyProvider) {
      const provider = ITALIAN_ENERGY_PROVIDERS.find(p => p.value === energyProvider);
      if (provider) {
        setRenewablePercentage(provider.renewablePercentage);
      }
    }
  }, [energyProvider, setRenewablePercentage]);

  const handleRenewablePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const validValue = Math.min(100, Math.max(0, value));
    setRenewablePercentage(validValue);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Tipo di energia</Label>
          <Select 
            value={energyType} 
            onValueChange={(value) => setEnergyType(value as EnergyType)}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Seleziona tipo di energia" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="ELECTRICITY_IT">Elettricità da rete nazionale (Italia)</SelectItem>
              <SelectItem value="ELECTRICITY_EU">Elettricità da rete europea</SelectItem>
              <SelectItem value="ELECTRICITY_RENEWABLE">Elettricità 100% rinnovabile</SelectItem>
              <SelectItem value="ELECTRICITY_COGENERATION">Elettricità da cogenerazione</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Fornitore di energia</Label>
          <Select 
            value={energyProvider} 
            onValueChange={setEnergyProvider}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Seleziona fornitore" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {ITALIAN_ENERGY_PROVIDERS.map(provider => (
                <SelectItem key={provider.value} value={provider.value}>{provider.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Percentuale di energia rinnovabile (%)</Label>
          <Input 
            type="number" 
            min="0" 
            max="100" 
            value={renewablePercentage.toString()} 
            onChange={handleRenewablePercentageChange}
            placeholder="Percentuale energia rinnovabile"
            className="bg-blue-50"
          />
        </div>
        
        <div>
          <Label>Quantità di energia consumata (kWh)</Label>
          <Input 
            type="number" 
            value={energyQuantity} 
            onChange={(e) => setEnergyQuantity(e.target.value)}
            placeholder="Inserisci quantità in kWh"
            className="bg-blue-50"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Periodo di riferimento</Label>
          <Select 
            value={periodType} 
            onValueChange={(value) => setPeriodType(value as PeriodType)}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Seleziona periodo" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value={PeriodType.ANNUAL}>Annuale</SelectItem>
              <SelectItem value={PeriodType.QUARTERLY}>Trimestrale</SelectItem>
              <SelectItem value={PeriodType.MONTHLY}>Mensile</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Scope2Form;
