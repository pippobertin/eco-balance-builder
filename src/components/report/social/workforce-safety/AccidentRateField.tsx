
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AccidentRateFieldProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AccidentRateField = ({ value, onChange }: AccidentRateFieldProps) => {
  return (
    <div>
      <Label htmlFor="workAccidentsRate">Tasso di infortuni sul lavoro</Label>
      <Input 
        id="workAccidentsRate" 
        name="workAccidentsRate" 
        type="number" 
        placeholder="0.0" 
        value={value || ""} 
        onChange={onChange} 
        readOnly={true}
        className="bg-gray-50"
      />
      <p className="text-sm text-gray-500 mt-1">
        Calcolato come (N. infortuni / Ore totali lavorate) x 172.000
      </p>
    </div>
  );
};

export default AccidentRateField;
