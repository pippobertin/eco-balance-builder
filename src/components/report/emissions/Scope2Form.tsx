
import React from 'react';
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
}

const Scope2Form: React.FC<Scope2FormProps> = ({
  energyType,
  setEnergyType,
  energyQuantity,
  setEnergyQuantity,
  renewablePercentage,
  setRenewablePercentage,
  periodType,
  setPeriodType
}) => {
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
          <Label>Percentuale di energia rinnovabile (%)</Label>
          <Input 
            type="number" 
            min="0" 
            max="100" 
            value={renewablePercentage.toString()} 
            onChange={(e) => setRenewablePercentage(Number(e.target.value))}
            placeholder="Percentuale energia rinnovabile"
            className="bg-white"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Quantità di energia consumata (kWh)</Label>
          <Input 
            type="number" 
            value={energyQuantity} 
            onChange={(e) => setEnergyQuantity(e.target.value)}
            placeholder="Inserisci quantità in kWh"
            className="bg-white"
          />
        </div>
        
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
              <SelectItem value={PeriodType.WEEKLY}>Settimanale</SelectItem>
              <SelectItem value={PeriodType.DAILY}>Giornaliero</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Scope2Form;
