
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
  
  // Create a new form values object with the updated issues
  const updatedFormValues = {
    ...formValues,
    materialityAnalysis: {
      ...formValues.materialityAnalysis,
      issues: updatedIssues
    }
  };
  
  // Update the form state
  setFormValues(updatedFormValues);
  
  // Also update the report context
  updateReportData({
    materialityAnalysis: {
      ...reportData.materialityAnalysis,
      issues: updatedIssues,
      // Calculate a simple ESG score based on material issues
      esgScore: calculateEsgScore(updatedIssues)
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
