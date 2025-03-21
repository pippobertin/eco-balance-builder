
import React, { useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Info, Save } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';
import { useWorkforceSafetyData } from './hooks/useWorkforceSafetyData';
import { useReport } from '@/hooks/use-report-context';

type WorkforceSafetyProps = {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => void;
};

const WorkforceSafety = React.forwardRef<HTMLDivElement, WorkforceSafetyProps>(
  ({ formValues, handleChange }, ref) => {
    const { currentReport } = useReport();
    const reportId = currentReport?.id;
    
    const { 
      safetyData, 
      loading, 
      loadSafetyData, 
      saveSafetyData, 
      calculateAccidentsRate,
      isSaving,
      lastSaved
    } = useWorkforceSafetyData(reportId);

    // Update form values when safety data is loaded
    useEffect(() => {
      if (safetyData && !loading) {
        console.log("Updating form with safety data:", safetyData);
        
        // Update parent component's form values with the loaded safety data
        const updatedSocialMetrics = {
          ...(formValues?.socialMetrics || {}),
          totalHoursWorked: safetyData.totalHoursWorked,
          workAccidentsNumber: safetyData.workAccidentsNumber,
          workAccidentsRate: safetyData.workAccidentsRate,
          workAccidentDeaths: safetyData.workAccidentDeaths,
          workDiseaseDeaths: safetyData.workDiseaseDeaths
        };
        
        // Create a synthetic change event to update the form values
        const syntheticEvent = {
          target: {
            name: 'socialMetrics',
            value: updatedSocialMetrics
          }
        } as any;
        
        handleChange(syntheticEvent);
        
        console.log("Updated form values with safety data:", updatedSocialMetrics);
      }
    }, [safetyData, loading]);

    // Load safety data when the report ID changes
    useEffect(() => {
      if (reportId) {
        console.log("Loading safety data due to report ID change:", reportId);
        loadSafetyData();
      }
    }, [reportId]);

    // Calculate accident rate when totalHoursWorked or workAccidentsNumber changes
    useEffect(() => {
      const accidents = formValues?.socialMetrics?.workAccidentsNumber;
      const hours = formValues?.socialMetrics?.totalHoursWorked;
      
      if (accidents !== undefined && hours !== undefined) {
        const rate = calculateAccidentsRate(accidents, hours);
        
        if (rate !== formValues?.socialMetrics?.workAccidentsRate) {
          const updatedSocialMetrics = {
            ...(formValues?.socialMetrics || {}),
            workAccidentsRate: rate !== null ? parseFloat(rate.toFixed(2)) : null
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
    }, [formValues?.socialMetrics?.totalHoursWorked, formValues?.socialMetrics?.workAccidentsNumber]);

    const handleSaveSafetyData = async () => {
      if (!formValues?.socialMetrics) {
        console.error("Social metrics data is undefined. Cannot save safety data.");
        return;
      }
      
      if (!reportId) {
        console.error("Report ID is undefined. Cannot save safety data.");
        return;
      }
      
      console.log("Saving safety data with values:", formValues.socialMetrics);
      
      // Call the saveSafetyData function from our hook
      await saveSafetyData({
        totalHoursWorked: formValues.socialMetrics.totalHoursWorked !== "" ? Number(formValues.socialMetrics.totalHoursWorked) : null,
        workAccidentsNumber: formValues.socialMetrics.workAccidentsNumber !== "" ? Number(formValues.socialMetrics.workAccidentsNumber) : null,
        workAccidentsRate: formValues.socialMetrics.workAccidentsRate !== "" ? Number(formValues.socialMetrics.workAccidentsRate) : null,
        workAccidentDeaths: formValues.socialMetrics.workAccidentDeaths !== "" ? Number(formValues.socialMetrics.workAccidentDeaths) : null,
        workDiseaseDeaths: formValues.socialMetrics.workDiseaseDeaths !== "" ? Number(formValues.socialMetrics.workDiseaseDeaths) : null
      });
    };

    return (
      <GlassmorphicCard>
        <div className="flex items-center mb-4" ref={ref}>
          <ShieldAlert className="mr-2 h-5 w-5 text-red-500" />
          <h3 className="text-xl font-semibold">B9 - Forza lavoro - Salute e sicurezza</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md mb-4 bg-blue-100">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-600">
                Il tasso di infortuni sul lavoro si calcola con la formula: (Numero di infortuni / Numero totale di ore lavorate in un anno da tutti i dipendenti) x 172.000. Questo indica il numero di infortuni per 100 lavoratori a tempo pieno in un anno.
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Inverted the first two fields as requested */}
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
            <div>
              <Label htmlFor="workAccidentsRate">Tasso di infortuni sul lavoro</Label>
              <Input 
                id="workAccidentsRate" 
                name="workAccidentsRate" 
                type="number" 
                placeholder="0.0" 
                value={formValues.socialMetrics?.workAccidentsRate || ""} 
                onChange={handleChange} 
                readOnly={true}
                className="bg-gray-50"
              />
              <p className="text-sm text-gray-500 mt-1">
                Calcolato come (N. infortuni / Ore totali lavorate) x 172.000
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
          
          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleSaveSafetyData} 
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Salvataggio..." : "Salva dati sicurezza"}
            </Button>
          </div>
        </div>
      </GlassmorphicCard>
    );
  }
);

WorkforceSafety.displayName = "WorkforceSafety";

export default WorkforceSafety;
