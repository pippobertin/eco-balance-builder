
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CollectiveBargainingFieldProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CollectiveBargainingField: React.FC<CollectiveBargainingFieldProps> = ({ formValues, handleChange }) => {
  return (
    <>
      <h4 className="font-medium text-lg">Contrattazione collettiva</h4>
      <div>
        <Label htmlFor="collectiveBargainingCoverage">Percentuale di dipendenti coperti da contratti collettivi di lavoro (%)</Label>
        <Input 
          id="collectiveBargainingCoverage" 
          name="collectiveBargainingCoverage" 
          type="number" 
          placeholder="0.0" 
          value={formValues.socialMetrics?.collectiveBargainingCoverage || ""} 
          onChange={handleChange} 
        />
      </div>
    </>
  );
};

export default CollectiveBargainingField;
