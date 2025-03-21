
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TrainingFieldsProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TrainingFields: React.FC<TrainingFieldsProps> = ({ formValues, handleChange }) => {
  return (
    <>
      <h4 className="font-medium text-lg">Formazione</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="avgTrainingHoursMale">Ore medie di formazione annuali per dipendente di genere maschile</Label>
          <Input 
            id="avgTrainingHoursMale" 
            name="avgTrainingHoursMale" 
            type="number" 
            placeholder="0.0" 
            value={formValues.socialMetrics?.avgTrainingHoursMale || ""} 
            onChange={handleChange} 
          />
        </div>
        
        <div>
          <Label htmlFor="avgTrainingHoursFemale">Ore medie di formazione annuali per dipendente di genere femminile</Label>
          <Input 
            id="avgTrainingHoursFemale" 
            name="avgTrainingHoursFemale" 
            type="number" 
            placeholder="0.0" 
            value={formValues.socialMetrics?.avgTrainingHoursFemale || ""} 
            onChange={handleChange} 
          />
        </div>
      </div>
    </>
  );
};

export default TrainingFields;
