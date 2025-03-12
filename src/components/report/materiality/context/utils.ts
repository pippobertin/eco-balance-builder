
import { calculateEsgScore } from '../utils/calculateEsgScore';
import { MaterialityIssue, Stakeholder } from '../types';

// Helper function to update form values with materiality issues
export const updateFormWithIssues = (
  formValues: any,
  setFormValues: React.Dispatch<React.SetStateAction<any>>,
  updatedIssues: MaterialityIssue[],
  updateReportData: (data: any) => void,
  reportData: any
) => {
  console.log("Updating materiality issues:", updatedIssues);
  
  // Ensure all numeric values are properly typed
  const processedIssues = updatedIssues.map(issue => ({
    ...issue,
    impactRelevance: Number(issue.impactRelevance),
    financialRelevance: Number(issue.financialRelevance)
  }));
  
  // Create a new form values object with the updated issues
  const updatedFormValues = {
    ...formValues,
    materialityAnalysis: {
      ...formValues.materialityAnalysis,
      issues: processedIssues
    }
  };
  
  // Update the form state
  setFormValues(updatedFormValues);
  
  // Also update the report context
  updateReportData({
    materialityAnalysis: {
      ...reportData.materialityAnalysis,
      issues: processedIssues,
      // Calculate a simple ESG score based on material issues
      esgScore: calculateEsgScore(processedIssues)
    }
  });
  
  console.log("Form and report data updated with new issues");
};

// Helper function to update form values with stakeholders
export const updateFormWithStakeholders = (
  formValues: any,
  setFormValues: React.Dispatch<React.SetStateAction<any>>,
  updatedStakeholders: Stakeholder[],
  updateReportData: (data: any) => void,
  reportData: any
) => {
  console.log("Updating stakeholders:", updatedStakeholders);
  
  // Create a new form values object with the updated stakeholders
  const updatedFormValues = {
    ...formValues,
    materialityAnalysis: {
      ...formValues.materialityAnalysis,
      stakeholders: updatedStakeholders
    }
  };
  
  // Update the form state
  setFormValues(updatedFormValues);
  
  // Also update the report context
  updateReportData({
    materialityAnalysis: {
      ...reportData.materialityAnalysis,
      stakeholders: updatedStakeholders
    }
  });
  
  console.log("Form and report data updated with new stakeholders");
};

// Helper to ensure materiality analysis exists in form values
export const ensureMaterialityAnalysisExists = (
  formValues: any,
  setFormValues: React.Dispatch<React.SetStateAction<any>>
) => {
  if (!formValues.materialityAnalysis) {
    console.log("Creating initial materiality analysis structure");
    setFormValues({
      ...formValues,
      materialityAnalysis: {
        issues: [],
        stakeholders: []
      }
    });
    return false;
  }
  return true;
};

// Helper to check for duplicate issues
export const isDuplicateIssue = (
  issues: MaterialityIssue[],
  newIssue: { id: string; name: string }
): boolean => {
  return issues.some(issue => 
    issue.id === newIssue.id || 
    issue.name.toLowerCase() === newIssue.name.toLowerCase()
  );
};
