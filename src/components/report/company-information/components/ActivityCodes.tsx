
import React from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { atecoOptions, naceOptions } from '../data/formOptions';

interface ActivityCodesProps {
  atecoCode: string;
  naceCode: string;
  handleSelectChange: (name: string, value: string) => void;
}

const ActivityCodes: React.FC<ActivityCodesProps> = ({
  atecoCode,
  naceCode,
  handleSelectChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="ateco_code">Codice ATECO</Label>
        <Select 
          value={atecoCode || ''} 
          onValueChange={(value) => handleSelectChange('ateco_code', value)}
        >
          <SelectTrigger id="ateco_code">
            <SelectValue placeholder="Seleziona codice ATECO" />
          </SelectTrigger>
          <SelectContent>
            {atecoOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="nace_code">Codice NACE</Label>
        <Select 
          value={naceCode || ''} 
          onValueChange={(value) => handleSelectChange('nace_code', value)}
        >
          <SelectTrigger id="nace_code">
            <SelectValue placeholder="Seleziona codice NACE" />
          </SelectTrigger>
          <SelectContent>
            {naceOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default ActivityCodes;
