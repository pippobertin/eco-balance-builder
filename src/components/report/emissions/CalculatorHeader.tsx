
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { EmissionFactorSource } from '@/lib/emissions-types';

interface CalculatorHeaderProps {
  calculationMethod: EmissionFactorSource;
  setCalculationMethod: (value: EmissionFactorSource) => void;
}

const CalculatorHeader: React.FC<CalculatorHeaderProps> = ({
  calculationMethod,
  setCalculationMethod
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium">Calcolatore di Emissioni GHG</h3>
      <div className="text-sm text-gray-500">
        <span>Fonte dati: </span>
        <Select 
          value={calculationMethod} 
          onValueChange={(value) => setCalculationMethod(value as EmissionFactorSource)}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Seleziona fonte" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value={EmissionFactorSource.DEFRA}>DEFRA (UK)</SelectItem>
            <SelectItem value={EmissionFactorSource.ISPRA}>ISPRA (Italia)</SelectItem>
            <SelectItem value={EmissionFactorSource.IPCC}>IPCC</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CalculatorHeader;
