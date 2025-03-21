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
import { FuelType, PeriodType } from '@/lib/emissions-types';

interface Scope1FormProps {
  scope1Source: string;
  setScope1Source: (value: string) => void;
  fuelType: FuelType;
  setFuelType: (value: FuelType) => void;
  fuelQuantity: string;
  setFuelQuantity: (value: string) => void;
  fuelUnit: string;
  setFuelUnit: (value: string) => void;
  periodType: PeriodType;
  setPeriodType: (value: PeriodType) => void;
}

const Scope1Form: React.FC<Scope1FormProps> = ({
  scope1Source,
  setScope1Source,
  fuelType,
  setFuelType,
  fuelQuantity,
  setFuelQuantity,
  fuelUnit,
  setFuelUnit,
  periodType,
  setPeriodType
}) => {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Fuel quantity changed to:', value);
    setFuelQuantity(value);
  };

  useEffect(() => {
    if (scope1Source === 'fuel' && !fuelType) {
      console.log('Initializing default fuel type to DIESEL');
      setFuelType('DIESEL' as FuelType);
    }
  }, [scope1Source, fuelType, setFuelType]);

  useEffect(() => {
    if (!fuelUnit) {
      console.log('Initializing default fuel unit to L');
      setFuelUnit('L');
    }
  }, [fuelUnit, setFuelUnit]);

  useEffect(() => {
    console.log('Scope1Form current values:', {
      scope1Source,
      fuelType,
      fuelQuantity,
      fuelUnit,
      periodType
    });
  }, [scope1Source, fuelType, fuelQuantity, fuelUnit, periodType]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Categoria fonte di emissione</Label>
          <Select 
            value={scope1Source} 
            onValueChange={setScope1Source}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Seleziona categoria" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="fuel">Combustibili per produzione</SelectItem>
              <SelectItem value="fleet">Flotta aziendale</SelectItem>
              <SelectItem value="other">Altre fonti dirette</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {scope1Source === 'fuel' && (
          <div>
            <Label>Tipo di combustibile</Label>
            <Select 
              value={fuelType} 
              onValueChange={(value) => {
                console.log('Fuel type changed to:', value);
                setFuelType(value as FuelType);
              }}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Seleziona combustibile" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="DIESEL">Diesel</SelectItem>
                <SelectItem value="GASOLINE">Benzina</SelectItem>
                <SelectItem value="NATURAL_GAS">Gas Naturale</SelectItem>
                <SelectItem value="LPG">GPL</SelectItem>
                <SelectItem value="BIOMASS_PELLET">Pellet di Biomassa</SelectItem>
                <SelectItem value="BIOMASS_WOOD">Legna</SelectItem>
                <SelectItem value="BIOFUEL">Biocombustibile</SelectItem>
                <SelectItem value="COAL">Carbone</SelectItem>
                <SelectItem value="FUEL_OIL">Olio Combustibile</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Quantità</Label>
          <Input 
            type="number" 
            value={fuelQuantity} 
            onChange={handleQuantityChange}
            placeholder="Inserisci quantità"
            className="bg-blue-50"
          />
        </div>
        
        <div>
          <Label>Unità di misura</Label>
          <Select 
            value={fuelUnit} 
            onValueChange={(value) => {
              console.log('Fuel unit changed to:', value);
              setFuelUnit(value);
            }}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Seleziona unità" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="L">Litri (L)</SelectItem>
              <SelectItem value="kg">Kilogrammi (kg)</SelectItem>
              <SelectItem value="m3">Metri cubi (m³)</SelectItem>
              <SelectItem value="kWh">Kilowattora (kWh)</SelectItem>
              <SelectItem value="MWh">Megawattora (MWh)</SelectItem>
              <SelectItem value="GJ">Gigajoule (GJ)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Periodo di riferimento</Label>
          <Select 
            value={periodType} 
            onValueChange={(value) => {
              console.log('Period type changed to:', value);
              setPeriodType(value as PeriodType);
            }}
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

export default Scope1Form;
