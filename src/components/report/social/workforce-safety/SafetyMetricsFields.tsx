
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AccidentRateField from './AccidentRateField';

interface SafetyMetricsFieldsProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SafetyMetricsFields = ({ formValues, handleChange }: SafetyMetricsFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="totalHoursWorked">Ore totali lavorate in un anno</Label>
          <Input 
            id="totalHoursWorked" 
            name="totalHoursWorked" 
            type="number" 
            placeholder="0" 
            value={formValues.socialMetrics?.totalHoursWorked ?? ""} 
            onChange={handleChange} 
          />
        </div>
        
        <div>
          <Label htmlFor="workAccidentsNumber">Numero di infortuni sul lavoro</Label>
          <Input 
            id="workAccidentsNumber" 
            name="workAccidentsNumber" 
            type="number" 
            placeholder="0" 
            value={formValues.socialMetrics?.workAccidentsNumber ?? ""} 
            onChange={handleChange} 
          />
        </div>
      </div>
      
      <AccidentRateField 
        value={formValues.socialMetrics?.workAccidentsRate ?? ""} 
        onChange={handleChange} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="workAccidentDeaths">Numero di decessi per infortunio sul lavoro</Label>
          <Input 
            id="workAccidentDeaths" 
            name="workAccidentDeaths" 
            type="number" 
            placeholder="0" 
            value={formValues.socialMetrics?.workAccidentDeaths ?? ""} 
            onChange={handleChange} 
          />
        </div>
        
        <div>
          <Label htmlFor="workDiseaseDeaths">Numero di decessi per malattie professionali</Label>
          <Input 
            id="workDiseaseDeaths" 
            name="workDiseaseDeaths" 
            type="number" 
            placeholder="0" 
            value={formValues.socialMetrics?.workDiseaseDeaths ?? ""} 
            onChange={handleChange} 
          />
        </div>
      </div>
    </div>
  );
};

export default SafetyMetricsFields;
