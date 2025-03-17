
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EnergyInputsFormProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const EnergyInputsForm: React.FC<EnergyInputsFormProps> = ({ formValues, handleChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <Label htmlFor="energyConsumption">Consumo energetico totale (MWh)</Label>
          <Input 
            id="energyConsumption" 
            name="energyConsumption" 
            type="number" 
            placeholder="0.0" 
            value={formValues.environmentalMetrics?.energyConsumption || ""} 
            onChange={handleChange} 
            className="bg-white"
          />
        </div>
        
        <div>
          <Label htmlFor="fossilFuelEnergy">Energia da combustibili fossili (MWh)</Label>
          <Input 
            id="fossilFuelEnergy" 
            name="fossilFuelEnergy" 
            type="number" 
            placeholder="0.0" 
            value={formValues.environmentalMetrics?.fossilFuelEnergy || ""} 
            onChange={handleChange} 
            className="bg-white"
          />
        </div>
        
        <div>
          <Label htmlFor="renewableEnergy">Energia da fonti rinnovabili (MWh)</Label>
          <Input 
            id="renewableEnergy" 
            name="renewableEnergy" 
            type="number" 
            placeholder="0.0" 
            value={formValues.environmentalMetrics?.renewableEnergy || ""} 
            onChange={handleChange} 
            className="bg-white"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="energyEmissionsDetails">Dettagli su energia ed emissioni (opzionale)</Label>
        <Textarea 
          id="energyEmissionsDetails" 
          name="energyEmissionsDetails" 
          placeholder="Fornisci dettagli aggiuntivi su energia ed emissioni di gas serra, se applicabile." 
          value={formValues.environmentalMetrics?.energyEmissionsDetails || ""} 
          onChange={handleChange} 
          className="min-h-[120px] bg-white" 
        />
      </div>
    </div>
  );
};

export default EnergyInputsForm;
