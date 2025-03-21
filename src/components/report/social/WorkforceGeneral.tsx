
import React, { useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Users, Info, Save } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';
import { useWorkforceData } from './hooks/useWorkforceData';
import { useReport } from '@/hooks/use-report-context';

type WorkforceGeneralProps = {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => void;
};

const WorkforceGeneral = React.forwardRef<HTMLDivElement, WorkforceGeneralProps>(
  ({ formValues, handleChange }, ref) => {
    const { currentReport } = useReport();
    const reportId = currentReport?.id;
    const { saveWorkforceData, isSaving, lastSaved, workforceData, loading, loadWorkforceData } = useWorkforceData(reportId);

    // Update form values when workforce data is loaded
    useEffect(() => {
      if (workforceData && !loading) {
        console.log("Updating form with workforce data:", workforceData);
        
        // Update parent component's form values with the loaded workforce data
        const updatedSocialMetrics = {
          ...(formValues?.socialMetrics || {}),
          totalEmployees: workforceData.totalEmployees,
          totalEmployeesFTE: workforceData.totalEmployeesFTE,
          permanentEmployees: workforceData.permanentEmployees,
          temporaryEmployees: workforceData.temporaryEmployees,
          maleEmployees: workforceData.maleEmployees,
          femaleEmployees: workforceData.femaleEmployees,
          otherGenderEmployees: workforceData.otherGenderEmployees,
          employeesByCountry: workforceData.employeesByCountry
        };
        
        // Create a synthetic change event to update the form values
        const syntheticEvent = {
          target: {
            name: 'socialMetrics',
            value: updatedSocialMetrics
          }
        } as any;
        
        handleChange(syntheticEvent);
        
        console.log("Updated form values with workforce data:", updatedSocialMetrics);
      }
    }, [workforceData, loading]);

    // Load workforce data when the report ID changes
    useEffect(() => {
      if (reportId) {
        console.log("Loading workforce data due to report ID change:", reportId);
        loadWorkforceData();
      }
    }, [reportId]);

    const handleSaveWorkforceData = async () => {
      if (!formValues?.socialMetrics) {
        console.error("Social metrics data is undefined. Cannot save workforce data.");
        return;
      }
      
      if (!reportId) {
        console.error("Report ID is undefined. Cannot save workforce data.");
        return;
      }
      
      console.log("Saving workforce data with values:", formValues.socialMetrics);
      
      // Call the saveWorkforceData function from our hook
      await saveWorkforceData({
        totalEmployees: formValues.socialMetrics.totalEmployees !== "" ? Number(formValues.socialMetrics.totalEmployees) : null,
        totalEmployeesFTE: formValues.socialMetrics.totalEmployeesFTE !== "" ? Number(formValues.socialMetrics.totalEmployeesFTE) : null,
        permanentEmployees: formValues.socialMetrics.permanentEmployees !== "" ? Number(formValues.socialMetrics.permanentEmployees) : null,
        temporaryEmployees: formValues.socialMetrics.temporaryEmployees !== "" ? Number(formValues.socialMetrics.temporaryEmployees) : null,
        maleEmployees: formValues.socialMetrics.maleEmployees !== "" ? Number(formValues.socialMetrics.maleEmployees) : null,
        femaleEmployees: formValues.socialMetrics.femaleEmployees !== "" ? Number(formValues.socialMetrics.femaleEmployees) : null,
        otherGenderEmployees: formValues.socialMetrics.otherGenderEmployees !== "" ? Number(formValues.socialMetrics.otherGenderEmployees) : null,
        employeesByCountry: formValues.socialMetrics.employeesByCountry || null
      });
    };

    return (
      <GlassmorphicCard>
        <div className="flex items-center mb-4" ref={ref}>
          <Users className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-semibold">B8 - Forza lavoro - Caratteristiche generali</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md mb-4 bg-blue-100">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-600">
                L'equivalente a tempo pieno (FTE) è il numero di posizioni a tempo pieno. Si calcola dividendo le ore di lavoro effettive di un dipendente per le ore di una settimana lavorativa a tempo pieno. I dati possono essere espressi sia in numero di persone che in FTE.
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
          
          <h4 className="font-medium text-lg">Totale dipendenti</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalEmployees">Numero totale di dipendenti</Label>
              <Input id="totalEmployees" name="totalEmployees" type="number" placeholder="0" value={formValues.socialMetrics?.totalEmployees ?? ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="totalEmployeesFTE">Numero totale di equivalenti a tempo pieno (FTE)</Label>
              <Input id="totalEmployeesFTE" name="totalEmployeesFTE" type="number" placeholder="0.0" value={formValues.socialMetrics?.totalEmployeesFTE ?? ""} onChange={handleChange} />
            </div>
          </div>
          
          <h4 className="font-medium text-lg">Tipo di contratto</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="permanentEmployees">Dipendenti a tempo indeterminato</Label>
              <Input id="permanentEmployees" name="permanentEmployees" type="number" placeholder="0" value={formValues.socialMetrics?.permanentEmployees ?? ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="temporaryEmployees">Dipendenti a tempo determinato</Label>
              <Input id="temporaryEmployees" name="temporaryEmployees" type="number" placeholder="0" value={formValues.socialMetrics?.temporaryEmployees ?? ""} onChange={handleChange} />
            </div>
          </div>
          
          <h4 className="font-medium text-lg">Distribuzione per genere</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maleEmployees">Dipendenti di genere maschile</Label>
              <Input id="maleEmployees" name="maleEmployees" type="number" placeholder="0" value={formValues.socialMetrics?.maleEmployees ?? ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="femaleEmployees">Dipendenti di genere femminile</Label>
              <Input id="femaleEmployees" name="femaleEmployees" type="number" placeholder="0" value={formValues.socialMetrics?.femaleEmployees ?? ""} onChange={handleChange} />
            </div>
            
            <div>
              <Label htmlFor="otherGenderEmployees">Dipendenti di altri generi</Label>
              <Input id="otherGenderEmployees" name="otherGenderEmployees" type="number" placeholder="0" value={formValues.socialMetrics?.otherGenderEmployees ?? ""} onChange={handleChange} />
            </div>
          </div>
          
          <div>
            <Label htmlFor="employeesByCountry">Dipendenti per azienda del gruppo e/o per sede/stabilimento</Label>
            <Textarea 
              id="employeesByCountry" 
              name="employeesByCountry" 
              placeholder="Esempio: Sede centrale: 50, Stabilimento A: 20, Filiale B: 10" 
              value={formValues.socialMetrics?.employeesByCountry ?? ""} 
              onChange={handleChange} 
              className="min-h-[100px]" 
            />
          </div>
          
          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleSaveWorkforceData} 
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Salvataggio..." : "Salva dati forza lavoro"}
            </Button>
          </div>
        </div>
      </GlassmorphicCard>
    );
  }
);

WorkforceGeneral.displayName = "WorkforceGeneral";

export default WorkforceGeneral;
