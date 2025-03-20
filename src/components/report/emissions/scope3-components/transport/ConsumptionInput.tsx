
import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from 'lucide-react';

interface ConsumptionInputProps {
  consumption: string;
  setConsumption: (value: string) => void;
  consumptionUnit: string;
  setConsumptionUnit: (value: string) => void;
}

const ConsumptionInput: React.FC<ConsumptionInputProps> = ({
  consumption,
  setConsumption,
  consumptionUnit,
  setConsumptionUnit
}) => {
  // Local state for consumption display conversion
  const [displayConsumption, setDisplayConsumption] = useState(consumption);
  
  // Update display consumption when unit or value changes
  useEffect(() => {
    setDisplayConsumption(consumption);
  }, [consumption, consumptionUnit]);

  // Handle toggling between l/100km and km/l
  const toggleConsumptionUnit = () => {
    // Convert the current value to the new unit
    if (consumption && !isNaN(Number(consumption))) {
      const currentValue = parseFloat(consumption);
      
      if (consumptionUnit === 'l_100km' && currentValue > 0) {
        // Convert from l/100km to km/l
        const newValue = (100 / currentValue).toFixed(2);
        setConsumption(newValue);
        setConsumptionUnit('km_l');
      } else if (consumptionUnit === 'km_l' && currentValue > 0) {
        // Convert from km/l to l/100km
        const newValue = (100 / currentValue).toFixed(2);
        setConsumption(newValue);
        setConsumptionUnit('l_100km');
      }
    } else {
      // Just toggle the unit if no valid value
      setConsumptionUnit(
        consumptionUnit === 'l_100km' ? 'km_l' : 'l_100km'
      );
    }
  };

  // Handle consumption change
  const handleConsumptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Consumption changed to:', value);
    setConsumption(value);
  };

  return (
    <div className="flex-grow">
      <Label>Consumo carburante</Label>
      <div className="flex">
        <Input 
          type="number" 
          value={displayConsumption} 
          onChange={handleConsumptionChange}
          placeholder={consumptionUnit === 'l_100km' ? "Litri per 100 km" : "Km per litro"}
          className="bg-white rounded-r-none"
        />
        <Button
          type="button"
          onClick={toggleConsumptionUnit}
          className="rounded-l-none bg-gray-200 hover:bg-gray-300 text-gray-800"
        >
          <div className="flex items-center">
            <span className="mr-1 text-xs">
              {consumptionUnit === 'l_100km' ? 'L/100km' : 'km/L'}
            </span>
            <ArrowLeftRight className="h-3 w-3" />
          </div>
        </Button>
      </div>
      <p className="text-xs text-gray-600 mt-1">
        {consumptionUnit === 'l_100km' 
          ? "Inserisci il consumo in litri per 100 km percorsi" 
          : "Inserisci i km percorsi con un litro di carburante"}
      </p>
    </div>
  );
};

export default ConsumptionInput;
