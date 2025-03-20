
import { useState } from 'react';
import { EmissionsInput, EmissionCalculationLogs, EmissionsResults } from '@/hooks/emissions-calculator/types';
import { useEmissionsCalculations } from '@/hooks/emissions-calculator/useEmissionsCalculations';
import { useReport } from '@/hooks/use-report-context';
import { v4 as uuidv4 } from 'uuid';

export const useEmissionCalculation = (
  reportId: string | undefined,
  inputs: EmissionsInput,
  calculationLogs: EmissionCalculationLogs,
  setCalculationLogs: React.Dispatch<React.SetStateAction<EmissionCalculationLogs>>,
  calculatedEmissions: EmissionsResults,
  setCalculatedEmissions: React.Dispatch<React.SetStateAction<EmissionsResults>>
) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const { performCalculation } = useEmissionsCalculations();
  const { currentReport } = useReport();
  
  // Ensure we have a reportId, either from props or from context
  const effectiveReportId = reportId || currentReport?.id;
  
  // Function to calculate emissions
  const calculateEmissions = async (scope: 'scope1' | 'scope2' | 'scope3') => {
    if (!effectiveReportId) {
      console.error('Missing reportId for emission calculation');
      return null;
    }
    
    setIsCalculating(true);
    
    try {
      // Make sure to include the reportId in the inputs
      const inputsWithReportId = {
        ...inputs,
        reportId: effectiveReportId
      };
      
      console.log(`Starting ${scope} calculation with reportId:`, effectiveReportId);
      
      // Call the calculation function
      const result = performCalculation(inputsWithReportId, scope);
      
      // Extract the relevant data
      const { results, details } = result;
      const scopeDetails = details[`${scope}Details`];
      
      if (!scopeDetails) {
        console.error(`No details returned for ${scope} calculation`);
        return null;
      }
      
      console.log(`${scope} calculation details:`, scopeDetails);
      
      // Parse the details
      let parsedDetails;
      try {
        parsedDetails = JSON.parse(scopeDetails);
        console.log(`Processed details:`, parsedDetails);
      } catch (e) {
        console.error(`Error parsing ${scope} calculation details:`, e);
        return null;
      }
      
      // Update the emission results
      setCalculatedEmissions(prevEmissions => ({
        ...prevEmissions,
        scope1: results.scope1,
        scope2: results.scope2,
        scope3: results.scope3,
        total: results.total
      }));
      
      // Create a record for the calculation that matches what saveCalculation expects
      const calculationRecord = {
        emissionValue: parsedDetails.emissionsTonnes,
        detailsObj: parsedDetails,
        description: `${parsedDetails.energyType || parsedDetails.fuelType || parsedDetails.transportType || parsedDetails.wasteType || parsedDetails.purchaseType || 'Unknown'} emission`,
        scope: scope,
        reportId: effectiveReportId
      };
      
      return calculationRecord;
    } catch (error) {
      console.error(`Error calculating ${scope} emissions:`, error);
      return null;
    } finally {
      setIsCalculating(false);
    }
  };
  
  return {
    calculateEmissions,
    isCalculating
  };
};
