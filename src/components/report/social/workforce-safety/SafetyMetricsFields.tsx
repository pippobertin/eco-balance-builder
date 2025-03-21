
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AccidentRateField from './AccidentRateField';

interface SafetyMetricsFieldsProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => void;
}

const SafetyMetricsFields = ({ formValues, handleChange }: SafetyMetricsFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="totalHoursWorked">Ore totali lavorate nell'anno</Label>
          <Input id="totalHoursWorked" name="totalHoursWorked" type="number" placeholder="0" value={formValues.socialMetrics?.totalHoursWorked || ""} onChange={handleChange} />
        </div>
        
        <div>
          <Label htmlFor="workAccidentsNumber">Numero di infortuni sul lavoro registrabili</Label>
          <Input id="workAccidentsNumber" name="workAccidentsNumber" type="number" placeholder="0" value={formValues.socialMetrics?.workAccidentsNumber || ""} onChange={handleChange} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AccidentRateField 
          value={formValues.socialMetrics?.workAccidentsRate || ""} 
          onChange={handleChange} 
        />
        
        <div>
          <Label htmlFor="workAccidentDeaths">Numero di decessi dovuti a infortuni sul lavoro</Label>
          <Input id="workAccidentDeaths" name="workAccidentDeaths" type="number" placeholder="0" value={formValues.socialMetrics?.workAccidentDeaths || ""} onChange={handleChange} />
        </div>
      </div>
      
      <div>
        <Label htmlFor="workDiseaseDeaths">Numero di decessi dovuti a malattie professionali</Label>
        <Input id="workDiseaseDeaths" name="workDiseaseDeaths" type="number" placeholder="0" value={formValues.socialMetrics?.workDiseaseDeaths || ""} onChange={handleChange} />
        <p className="text-sm text-gray-500 mt-1">
          Include malattie direttamente collegate allo svolgimento del lavoro, attestate da un professionista sanitario
        </p>
      </div>
    </>
  );
};

export default SafetyMetricsFields;
