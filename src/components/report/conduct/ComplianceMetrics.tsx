
import React, { useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShieldAlert, Info } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { useReport } from '@/hooks/use-report-context';
import { useComplianceData } from './compliance/hooks';
import { ComplianceHeader, SaveButton } from './compliance';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';

type ComplianceMetricsProps = {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const ComplianceMetrics = React.forwardRef<HTMLDivElement, ComplianceMetricsProps>(
  ({ formValues, handleChange }, ref) => {
    const { currentReport } = useReport();
    const reportId = currentReport?.id;
    
    const { 
      loading,
      complianceData, 
      saveComplianceData,
      isSaving,
      lastSaved
    } = useComplianceData(reportId);

    // Update form values when compliance data is loaded - ONCE
    useEffect(() => {
      if (complianceData && !loading) {
        console.log("Updating form with compliance data:", complianceData);
        
        // Only update if the form fields are empty or null
        const shouldUpdate = 
          !formValues.conductMetrics?.complianceStandards &&
          !formValues.conductMetrics?.complianceMonitoring;
        
        if (shouldUpdate) {
          // Update form fields individually to avoid type errors
          if (complianceData.complianceStandards !== null) {
            const standardsEvent = {
              target: {
                name: 'complianceStandards',
                value: complianceData.complianceStandards
              }
            } as React.ChangeEvent<HTMLTextAreaElement>;
            
            handleChange(standardsEvent);
          }
          
          if (complianceData.complianceMonitoring !== null) {
            const monitoringEvent = {
              target: {
                name: 'complianceMonitoring',
                value: complianceData.complianceMonitoring
              }
            } as React.ChangeEvent<HTMLTextAreaElement>;
            
            handleChange(monitoringEvent);
          }
        }
      }
    }, [complianceData, loading]);

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      handleChange(e);
    };

    const handleSaveData = async () => {
      if (!formValues?.conductMetrics) {
        console.log("No conduct metrics data to save");
        return;
      }
      
      // Extract the values from formValues.conductMetrics
      const dataToSave = {
        complianceStandards: formValues.conductMetrics?.complianceStandards || null,
        complianceMonitoring: formValues.conductMetrics?.complianceMonitoring || null
      };
      
      console.log("Saving compliance data:", dataToSave);
      await saveComplianceData(dataToSave);
    };

    return (
      <GlassmorphicCard>
        <div ref={ref} className="space-y-6">
          <ComplianceHeader 
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
                  Fornire informazioni sull'allineamento con principi e standard internazionali di condotta 
                  delle imprese.
                </p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="complianceStandards">Standard di compliance adottati</Label>
              <Textarea 
                id="complianceStandards" 
                name="complianceStandards" 
                placeholder="Indica se l'impresa aderisce a standard come le Linee guida dell'OCSE per le imprese multinazionali o i Principi guida delle Nazioni Unite su imprese e diritti umani." 
                value={formValues.conductMetrics?.complianceStandards || ""} 
                onChange={handleFieldChange} 
                className="min-h-[120px]" 
              />
            </div>
            
            <div>
              <Label htmlFor="complianceMonitoring">Processi di monitoraggio della compliance</Label>
              <Textarea 
                id="complianceMonitoring" 
                name="complianceMonitoring" 
                placeholder="Descrivi i processi in essere per monitorare la compliance e i meccanismi per gestire lamentele e reclami." 
                value={formValues.conductMetrics?.complianceMonitoring || ""} 
                onChange={handleFieldChange} 
                className="min-h-[120px]" 
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

ComplianceMetrics.displayName = "ComplianceMetrics";

export default ComplianceMetrics;
