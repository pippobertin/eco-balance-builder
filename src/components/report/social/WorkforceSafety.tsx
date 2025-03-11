import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, Info } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

type WorkforceSafetyProps = {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const WorkforceSafety = React.forwardRef<HTMLDivElement, WorkforceSafetyProps>(
  ({ formValues, handleChange }, ref) => {
    return (
      <GlassmorphicCard>
        <div className="flex items-center mb-4" ref={ref}>
          <ShieldAlert className="mr-2 h-5 w-5 text-red-500" />
          <h3 className="text-xl font-semibold">B9 - Forza lavoro - Salute e sicurezza</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md mb-4 bg-orange-300">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-600">
                Il tasso di infortuni sul lavoro si calcola con la formula: (Numero di infortuni / Numero totale di ore lavorate in un anno da tutti i dipendenti) x 200.000. Questo indica il numero di infortuni per 100 lavoratori a tempo pieno in un anno.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workAccidentsNumber">Numero di infortuni sul lavoro registrabili</Label>
              <Input id="workAccidentsNumber" name="workAccidentsNumber" type="number" placeholder="0" value={formValues.socialMetrics?.workAccidentsNumber || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="totalHoursWorked">Ore totali lavorate nell'anno</Label>
              <Input id="totalHoursWorked" name="totalHoursWorked" type="number" placeholder="0" value={formValues.socialMetrics?.totalHoursWorked || ""} onChange={handleChange} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workAccidentsRate">Tasso di infortuni sul lavoro (%)</Label>
              <Input id="workAccidentsRate" name="workAccidentsRate" type="number" placeholder="0.0" value={formValues.socialMetrics?.workAccidentsRate || ""} onChange={handleChange} />
              <p className="text-sm text-gray-500 mt-1">
                Calcolato come (N. infortuni / Ore totali lavorate) x 200.000
              </p>
            </div>
            
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
        </div>
      </GlassmorphicCard>
    );
  }
);

WorkforceSafety.displayName = "WorkforceSafety";

export default WorkforceSafety;
