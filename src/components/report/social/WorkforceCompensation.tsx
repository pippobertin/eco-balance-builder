
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Info } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

interface WorkforceCompensationProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  ref?: React.RefObject<HTMLDivElement>;
}

const WorkforceCompensation: React.FC<WorkforceCompensationProps> = React.forwardRef<HTMLDivElement, WorkforceCompensationProps>(
  ({ formValues, handleChange }, ref) => {
    return (
      <GlassmorphicCard>
        <div className="flex items-center mb-4" ref={ref}>
          <GraduationCap className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-semibold">B10 - Forza lavoro - Retribuzione, contrattazione collettiva e formazione</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md mb-4 bg-orange-300">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-600">
                Il divario retributivo di genere è la differenza tra i livelli retributivi medi tra dipendenti di sesso femminile e maschile, espressa come percentuale del livello retributivo medio maschile. La copertura della contrattazione collettiva è la percentuale di dipendenti a cui si applicano i contratti collettivi.
              </p>
            </div>
          </div>
          
          <h4 className="font-medium text-lg">Retribuzione</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entryWage">Salario di ingresso (€)</Label>
              <Input id="entryWage" name="entryWage" type="number" placeholder="0.0" value={formValues.socialMetrics?.entryWage || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="localMinimumWage">Salario minimo locale (€)</Label>
              <Input id="localMinimumWage" name="localMinimumWage" type="number" placeholder="0.0" value={formValues.socialMetrics?.localMinimumWage || ""} onChange={handleChange} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entryWageToMinimumWageRatio">Rapporto tra salario di ingresso e salario minimo</Label>
              <Input id="entryWageToMinimumWageRatio" name="entryWageToMinimumWageRatio" type="number" placeholder="0.0" value={formValues.socialMetrics?.entryWageToMinimumWageRatio || ""} onChange={handleChange} />
              <p className="text-sm text-gray-500 mt-1">
                Indicare solo se una percentuale significativa di dipendenti è retribuita sulla base di salari soggetti a norme sul salario minimo
              </p>
            </div>
            
            <div>
              <Label htmlFor="genderPayGap">Divario retributivo di genere (%)</Label>
              <Input id="genderPayGap" name="genderPayGap" type="number" placeholder="0.0" value={formValues.socialMetrics?.genderPayGap || ""} onChange={handleChange} />
              <p className="text-sm text-gray-500 mt-1">
                Omettere questa informazione se il numero di dipendenti è inferiore a 150
              </p>
            </div>
          </div>
          
          <h4 className="font-medium text-lg">Contrattazione collettiva</h4>
          <div>
            <Label htmlFor="collectiveBargainingCoverage">Percentuale di dipendenti coperti da contratti collettivi di lavoro (%)</Label>
            <Input id="collectiveBargainingCoverage" name="collectiveBargainingCoverage" type="number" placeholder="0.0" value={formValues.socialMetrics?.collectiveBargainingCoverage || ""} onChange={handleChange} />
          </div>
          
          <h4 className="font-medium text-lg">Formazione</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="avgTrainingHoursMale">Ore medie di formazione annuali per dipendente di genere maschile</Label>
              <Input id="avgTrainingHoursMale" name="avgTrainingHoursMale" type="number" placeholder="0.0" value={formValues.socialMetrics?.avgTrainingHoursMale || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="avgTrainingHoursFemale">Ore medie di formazione annuali per dipendente di genere femminile</Label>
              <Input id="avgTrainingHoursFemale" name="avgTrainingHoursFemale" type="number" placeholder="0.0" value={formValues.socialMetrics?.avgTrainingHoursFemale || ""} onChange={handleChange} />
            </div>
          </div>
        </div>
      </GlassmorphicCard>
    );
  }
);

WorkforceCompensation.displayName = "WorkforceCompensation";

export default WorkforceCompensation;
