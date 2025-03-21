import React, { useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CircleDollarSign, Info, Save, HelpCircle } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';
import { useWorkforceCompensationData } from './hooks/useWorkforceCompensationData';
import { useReport } from '@/hooks/use-report-context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

type WorkforceCompensationProps = {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const WorkforceCompensation = React.forwardRef<HTMLDivElement, WorkforceCompensationProps>(
  ({ formValues, handleChange }, ref) => {
    const { currentReport } = useReport();
    const reportId = currentReport?.id;
    
    const { 
      compensationData, 
      loading, 
      saveCompensationData, 
      isSaving,
      lastSaved
    } = useWorkforceCompensationData(reportId);

    // Update form values when compensation data is loaded
    useEffect(() => {
      if (compensationData && !loading) {
        console.log("Updating form with compensation data:", compensationData);
        
        // Update parent component's form values with the loaded data
        const updatedSocialMetrics = {
          ...(formValues?.socialMetrics || {}),
          entryWage: compensationData.entry_wage,
          localMinimumWage: compensationData.local_minimum_wage,
          entryWageToMinimumWageRatio: compensationData.entry_wage_to_minimum_wage_ratio,
          genderPayGap: compensationData.gender_pay_gap,
          collectiveBargainingCoverage: compensationData.collective_bargaining_coverage,
          avgTrainingHoursMale: compensationData.avg_training_hours_male,
          avgTrainingHoursFemale: compensationData.avg_training_hours_female
        };
        
        // Create a synthetic change event to update the form values
        const syntheticEvent = {
          target: {
            name: 'socialMetrics',
            value: updatedSocialMetrics
          }
        } as any;
        
        handleChange(syntheticEvent);
        
        console.log("Updated form values with compensation data:", updatedSocialMetrics);
      }
    }, [compensationData, loading]);

    // Automatically calculate wage ratio when entry wage or minimum wage changes
    useEffect(() => {
      if (
        formValues?.socialMetrics?.entryWage && 
        formValues?.socialMetrics?.localMinimumWage && 
        parseFloat(formValues.socialMetrics.localMinimumWage) > 0
      ) {
        const entryWage = parseFloat(formValues.socialMetrics.entryWage);
        const minimumWage = parseFloat(formValues.socialMetrics.localMinimumWage);
        
        if (!isNaN(entryWage) && !isNaN(minimumWage) && minimumWage > 0) {
          const ratio = entryWage / minimumWage;
          
          // Update the ratio field
          const updatedSocialMetrics = {
            ...(formValues?.socialMetrics || {}),
            entryWageToMinimumWageRatio: ratio.toFixed(2)
          };
          
          // Create a synthetic change event to update the form values
          const syntheticEvent = {
            target: {
              name: 'socialMetrics',
              value: updatedSocialMetrics
            }
          } as any;
          
          handleChange(syntheticEvent);
        }
      }
    }, [formValues?.socialMetrics?.entryWage, formValues?.socialMetrics?.localMinimumWage]);

    const handleSaveCompensationData = async () => {
      if (!formValues?.socialMetrics) {
        console.error("Social metrics data is undefined. Cannot save compensation data.");
        return;
      }
      
      if (!reportId) {
        console.error("Report ID is undefined. Cannot save compensation data.");
        return;
      }
      
      console.log("Saving compensation data with values:", formValues.socialMetrics);
      
      // Call the saveCompensationData function
      await saveCompensationData({
        entry_wage: formValues.socialMetrics.entryWage !== "" ? Number(formValues.socialMetrics.entryWage) : null,
        local_minimum_wage: formValues.socialMetrics.localMinimumWage !== "" ? Number(formValues.socialMetrics.localMinimumWage) : null,
        entry_wage_to_minimum_wage_ratio: formValues.socialMetrics.entryWageToMinimumWageRatio !== "" ? Number(formValues.socialMetrics.entryWageToMinimumWageRatio) : null,
        gender_pay_gap: formValues.socialMetrics.genderPayGap !== "" ? Number(formValues.socialMetrics.genderPayGap) : null,
        collective_bargaining_coverage: formValues.socialMetrics.collectiveBargainingCoverage !== "" ? Number(formValues.socialMetrics.collectiveBargainingCoverage) : null,
        avg_training_hours_male: formValues.socialMetrics.avgTrainingHoursMale !== "" ? Number(formValues.socialMetrics.avgTrainingHoursMale) : null,
        avg_training_hours_female: formValues.socialMetrics.avgTrainingHoursFemale !== "" ? Number(formValues.socialMetrics.avgTrainingHoursFemale) : null
      });
    };

    // Helper component for field explanations with hover card
    const InfoHoverCard = ({ children }: { children: React.ReactNode }) => (
      <HoverCard>
        <HoverCardTrigger asChild>
          <span className="ml-1.5 inline-flex items-center cursor-help">
            <HelpCircle className="h-4 w-4 text-slate-500 hover:text-slate-700" />
          </span>
        </HoverCardTrigger>
        <HoverCardContent className="max-w-sm bg-blue-50 border-blue-200">
          <div className="flex items-start mb-2">
            <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
            {children}
          </div>
        </HoverCardContent>
      </HoverCard>
    );

    return (
      <GlassmorphicCard>
        <div className="flex items-center mb-4" ref={ref}>
          <CircleDollarSign className="mr-2 h-5 w-5 text-green-500" />
          <h3 className="text-xl font-semibold">B10 - Forza lavoro - Retribuzione, contrattazione collettiva e formazione</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md mb-4 bg-blue-100">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-600">
                Il divario retributivo di genere è la differenza tra i livelli retributivi medi tra dipendenti di sesso femminile e maschile, espressa come percentuale del livello retributivo medio maschile. La copertura della contrattazione collettiva è la percentuale di dipendenti a cui si applicano i contratti collettivi.
              </p>
            </div>
          </div>
          
          {/* Auto Save Indicator */}
          <div className="flex justify-end mb-4">
            <AutoSaveIndicator 
              needsSaving={false} 
              lastSaved={lastSaved} 
              className="w-full bg-green-50 py-2 px-3 rounded-md"
            />
          </div>
          
          <h4 className="font-medium text-lg">Retribuzione</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entryWage" className="flex items-center">
                Salario di ingresso (€)
                <InfoHoverCard>
                  <p className="text-sm text-slate-600">
                    Per "salario di ingresso" si intende il salario a tempo pieno della categoria occupazionale più
                    bassa. I salari dei tirocinanti e degli apprendisti non devono essere considerati nell'identificazione
                    del salario di ingresso dell'impresa.
                  </p>
                </InfoHoverCard>
              </Label>
              <Input id="entryWage" name="entryWage" type="number" placeholder="0.0" value={formValues.socialMetrics?.entryWage || ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="localMinimumWage" className="flex items-center">
                Salario minimo locale (€)
                <InfoHoverCard>
                  <p className="text-sm text-slate-600">
                    Per "salario minimo" si intende il compenso minimo di lavoro per ora, o altra unità di tempo,
                    consentito dalla legge. A seconda del Paese, il salario minimo può essere stabilito direttamente
                    dalla legge o attraverso accordi di contrattazione collettiva. L'impresa deve fare riferimento al
                    salario minimo applicabile per il Paese in cui si riferisce (sia esso stabilito direttamente dalla legge
                    o attraverso un contratto collettivo di lavoro).
                  </p>
                </InfoHoverCard>
              </Label>
              <Input id="localMinimumWage" name="localMinimumWage" type="number" placeholder="0.0" value={formValues.socialMetrics?.localMinimumWage || ""} onChange={handleChange} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entryWageToMinimumWageRatio" className="flex items-center">
                Rapporto tra salario di ingresso e salario minimo
                <InfoHoverCard>
                  <p className="text-sm text-slate-600">
                    Per calcolare il rapporto tra il salario di ingresso e il salario minimo, si utilizza la formula seguente:
                    <br />
                    <span className="font-medium mt-1 block">Indice = Salario di ingresso / Salario minimo</span>
                    <br />
                    Per "percentuale significativa di dipendenti" si intende la maggioranza dei dipendenti dell'impresa,
                    senza considerare stagisti e apprendisti.
                  </p>
                </InfoHoverCard>
              </Label>
              <Input 
                id="entryWageToMinimumWageRatio" 
                name="entryWageToMinimumWageRatio" 
                type="number" 
                placeholder="0.0" 
                value={formValues.socialMetrics?.entryWageToMinimumWageRatio || ""} 
                onChange={handleChange}
                readOnly
                className="bg-gray-50"
              />
              <p className="text-sm text-gray-500 mt-1">
                Indicare solo se una percentuale significativa di dipendenti è retribuita sulla base di salari soggetti a norme sul salario minimo
              </p>
            </div>
            
            <div>
              <Label htmlFor="genderPayGap">Divario retributivo di genere (%)</Label>
              <Input id="genderPayGap" name="genderPayGap" type="number" placeholder="0.0" value={formValues.socialMetrics?.genderPayGap || ""} onChange={handleChange} />
              <p className="text-sm text-gray-500 mt-1">
                Formula: (retribuzione uomini-retribuzione donne)/retribuzione uomini*100
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
          
          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleSaveCompensationData} 
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Salvataggio..." : "Salva dati retribuzione"}
            </Button>
          </div>
        </div>
      </GlassmorphicCard>
    );
  }
);

WorkforceCompensation.displayName = "WorkforceCompensation";

export default WorkforceCompensation;
