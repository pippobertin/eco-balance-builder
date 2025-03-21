
import React, { useEffect } from 'react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';
import { useWorkforceCompensationData } from './hooks/useWorkforceCompensationData';
import { useReport } from '@/hooks/use-report-context';
import { 
  WageFields, 
  CollectiveBargainingField, 
  TrainingFields,
  WorkforceCompensationHeader,
  SaveButton
} from './workforce-compensation';

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

    return (
      <GlassmorphicCard>
        <div ref={ref}>
          <WorkforceCompensationHeader />
          
          <div className="space-y-4">
            {/* Auto Save Indicator */}
            <div className="flex justify-end mb-4">
              <AutoSaveIndicator 
                needsSaving={false} 
                lastSaved={lastSaved} 
                className="w-full bg-green-50 py-2 px-3 rounded-md"
              />
            </div>
            
            <WageFields 
              formValues={formValues}
              handleChange={handleChange}
            />
            
            <CollectiveBargainingField
              formValues={formValues}
              handleChange={handleChange}
            />
            
            <TrainingFields
              formValues={formValues}
              handleChange={handleChange}
            />
            
            <SaveButton 
              onClick={handleSaveCompensationData} 
              isLoading={isSaving} 
            />
          </div>
        </div>
      </GlassmorphicCard>
    );
  }
);

WorkforceCompensation.displayName = "WorkforceCompensation";

export default WorkforceCompensation;
