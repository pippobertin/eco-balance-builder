
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PeriodType } from '@/lib/emissions-types';

interface PeriodSelectorProps {
  periodType: PeriodType;
  setPeriodType: (value: PeriodType) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  periodType,
  setPeriodType
}) => {
  return (
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
  );
};

export default PeriodSelector;
