
import React, { useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Info } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { useReport } from '@/hooks/use-report-context';
import { useAntiCorruptionData } from './anti-corruption/hooks';
import { AntiCorruptionHeader, SaveButton } from './anti-corruption';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';

type AntiCorruptionMetricsProps = {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const AntiCorruptionMetrics = React.forwardRef<HTMLDivElement, AntiCorruptionMetricsProps>(
  ({ formValues, handleChange }, ref) => {
    const { currentReport } = useReport();
    const reportId = currentReport?.id;
    
    const { 
      loading,
      antiCorruptionData, 
      saveAntiCorruptionData,
      isSaving,
      lastSaved
    } = useAntiCorruptionData(reportId);

    useEffect(() => {
      if (antiCorruptionData && !loading) {
        console.log("Updating form with anti-corruption data:", antiCorruptionData);
        
        const updatedConductMetrics = {
          ...(formValues?.conductMetrics || {}),
          antiCorruptionConvictions: antiCorruptionData.convictionsNumber,
          antiCorruptionSanctions: antiCorruptionData.sanctionsAmount,
          antiCorruptionDetails: antiCorruptionData.additionalDetails
        };
        
        const syntheticEvent = {
          target: {
            name: 'conductMetrics',
            value: updatedConductMetrics
          }
        } as any;
        
        handleChange(syntheticEvent);
      }
    }, [antiCorruptionData, loading]);

    const syncToParentState = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      handleChange(e);
    };

    const handleSaveData = async () => {
      if (!formValues.conductMetrics) {
        return;
      }
      
      const dataToSave = {
        convictionsNumber: formValues.conductMetrics?.antiCorruptionConvictions ? 
          Number(formValues.conductMetrics.antiCorruptionConvictions) : null,
        sanctionsAmount: formValues.conductMetrics?.antiCorruptionSanctions ? 
          Number(formValues.conductMetrics.antiCorruptionSanctions) : null,
        additionalDetails: formValues.conductMetrics?.antiCorruptionDetails || null
      };
      
      console.log("Saving anti-corruption data:", dataToSave);
      await saveAntiCorruptionData(dataToSave);
    };

    return (
      <GlassmorphicCard>
        <div ref={ref} className="space-y-6">
          <AntiCorruptionHeader 
            reportId={reportId}
            isSaving={isSaving}
            lastSaved={lastSaved}
          />
          
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <AutoSaveIndicator 
                needsSaving={false} 
                lastSaved={lastSaved} 
                className="w-full bg-green-50 py-2 px-3 rounded-md"
              />
            </div>
            
            <div className="p-4 rounded-md mb-4 bg-blue-100">
              <div className="flex items-start">
                <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
                <p className="text-sm text-slate-600">
                  In caso di condanne e sanzioni nel periodo di riferimento, indicare il numero di condanne 
                  e l'importo totale delle sanzioni pagate per la violazione delle leggi sull'anti-corruzione 
                  attiva e passiva.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="conductMetrics.antiCorruptionConvictions">Numero di condanne per corruzione</Label>
                <Input 
                  id="conductMetrics.antiCorruptionConvictions" 
                  name="conductMetrics.antiCorruptionConvictions" 
                  type="number" 
                  placeholder="0" 
                  value={formValues.conductMetrics?.antiCorruptionConvictions || ""} 
                  onChange={syncToParentState} 
                />
              </div>
              
              <div>
                <Label htmlFor="conductMetrics.antiCorruptionSanctions">Importo totale delle sanzioni per corruzione (€)</Label>
                <Input 
                  id="conductMetrics.antiCorruptionSanctions" 
                  name="conductMetrics.antiCorruptionSanctions" 
                  type="number" 
                  placeholder="0.00" 
                  value={formValues.conductMetrics?.antiCorruptionSanctions || ""} 
                  onChange={syncToParentState} 
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="conductMetrics.antiCorruptionDetails">Dettagli sulle condanne e sanzioni (opzionale)</Label>
              <Textarea 
                id="conductMetrics.antiCorruptionDetails" 
                name="conductMetrics.antiCorruptionDetails" 
                placeholder="Fornisci dettagli aggiuntivi sulle condanne e sanzioni per corruzione, se applicabile." 
                value={formValues.conductMetrics?.antiCorruptionDetails || ""} 
                onChange={syncToParentState} 
                className="min-h-[100px]" 
              />
            </div>
            
            <div className="pt-4">
              <SaveButton onClick={handleSaveData} isLoading={isSaving} />
            </div>
          </div>
        </div>
      </GlassmorphicCard>
    );
  }
);

AntiCorruptionMetrics.displayName = "AntiCorruptionMetrics";

export default AntiCorruptionMetrics;
