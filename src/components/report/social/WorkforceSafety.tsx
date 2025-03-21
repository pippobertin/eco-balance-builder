
import React, { useEffect } from 'react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';
import { useWorkforceSafetyData } from './hooks/useWorkforceSafetyData';
import { useReport } from '@/hooks/use-report-context';
import {
  WorkforceSafetyHeader,
  SafetyMetricsFields,
  SaveButton
} from './workforce-safety';

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
        <div ref={ref}>
          <WorkforceSafetyHeader />
          
          <div className="space-y-4">
            {/* Auto Save Indicator */}
            <div className="flex justify-end mb-4">
              <AutoSaveIndicator 
                needsSaving={false} 
                lastSaved={lastSaved} 
                className="w-full bg-green-50 py-2 px-3 rounded-md"
              />
            </div>
            
            <SafetyMetricsFields 
              formValues={formValues} 
              handleChange={handleChange} 
            />
            
            <SaveButton 
              onClick={handleSaveSafetyData} 
              isLoading={isSaving} 
            />
          </div>
        </div>
      </GlassmorphicCard>
    );
  }
);

WorkforceSafety.displayName = "WorkforceSafety";

export default WorkforceSafety;
