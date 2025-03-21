import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, Info } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { useReport } from '@/hooks/use-report-context';
import { useSupplyChainData } from './supply-chain/hooks';
import { SaveButton, SupplyChainHeader } from './supply-chain';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';

type SupplyChainMetricsProps = {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const SupplyChainMetrics = React.forwardRef<HTMLDivElement, SupplyChainMetricsProps>(
  ({ formValues, handleChange }, ref) => {
    const { currentReport } = useReport();
    const reportId = currentReport?.id;
    
    const { 
      loading,
      supplyChainData, 
      saveSupplyChainData,
      isSaving,
      lastSaved
    } = useSupplyChainData(reportId);

    const syncToParentState = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Keep parent form state in sync
      handleChange(e);
      
      // Update our local state
      const { name, value } = e.target;
      const key = name === 'supplyChainImpactProcess' ? 'impactProcessDescription' : 'identifiedImpacts';
      const update = { [key]: value };
      
      console.log("Updating supply chain local state:", update);
    };

    const handleSaveData = async () => {
      if (!supplyChainData && !formValues.socialMetrics) {
        return;
      }
      
      // Use either our local state or parent form state
      const dataToSave = {
        impactProcessDescription: formValues.socialMetrics?.supplyChainImpactProcess || supplyChainData?.impactProcessDescription || null,
        identifiedImpacts: formValues.socialMetrics?.identifiedImpacts || supplyChainData?.identifiedImpacts || null
      };
      
      await saveSupplyChainData(dataToSave);
    };

    return (
      <GlassmorphicCard>
        <div ref={ref}>
          <SupplyChainHeader 
            reportId={reportId}
            isSaving={isSaving}
            lastSaved={lastSaved}
          />
          
          <div className="space-y-4">
            {/* Auto Save Indicator - Modified to match other sections */}
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
                  L'impresa può indicare se dispone di un processo per identificare se ci sono lavoratori nella catena del valore, comunità interessate o consumatori e utilizzatori finali che sono interessati o possono essere interessati da impatti negativi relativi alle operazioni dell'impresa.
                </p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="supplyChainImpactProcess">Processo di identificazione degli impatti sulla catena del valore</Label>
              <Textarea 
                id="supplyChainImpactProcess" 
                name="supplyChainImpactProcess" 
                placeholder="Descrivi il processo per identificare se ci sono lavoratori nella catena del valore, comunità interessate o consumatori e utilizzatori finali che sono o possono essere interessati da impatti negativi relativi alle operazioni dell'impresa." 
                value={formValues.socialMetrics?.supplyChainImpactProcess || ""} 
                onChange={syncToParentState} 
                className="min-h-[150px]" 
              />
            </div>
            
            <div>
              <Label htmlFor="identifiedImpacts">Impatti identificati</Label>
              <Textarea 
                id="identifiedImpacts" 
                name="identifiedImpacts" 
                placeholder="Se identificati, descrivi i tipi di impatti, compresi i luoghi in cui si verificano e i gruppi che ne sono interessati." 
                value={formValues.socialMetrics?.identifiedImpacts || ""} 
                onChange={syncToParentState} 
                className="min-h-[150px]" 
              />
            </div>
            
            <SaveButton onClick={handleSaveData} isLoading={isSaving} />
          </div>
        </div>
      </GlassmorphicCard>
    );
  }
);

SupplyChainMetrics.displayName = "SupplyChainMetrics";

export default SupplyChainMetrics;
