
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
  
  const updatedFormValues = {
    ...formValues,
    materialityAnalysis: {
      ...formValues.materialityAnalysis,
      issues: updatedIssues
    }
  };
  
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
};

// Helper function to update form values with stakeholders
export const updateFormWithStakeholders = (
  formValues: any,
  setFormValues: React.Dispatch<React.SetStateAction<any>>,
  updatedStakeholders: Stakeholder[],
  updateReportData: (data: any) => void,
  reportData: any
) => {
  const updatedFormValues = {
    ...formValues,
    materialityAnalysis: {
      ...formValues.materialityAnalysis,
      stakeholders: updatedStakeholders
    }
  };
  
  setFormValues(updatedFormValues);
  
  // Also update the report context
  updateReportData({
    materialityAnalysis: {
      ...reportData.materialityAnalysis,
      stakeholders: updatedStakeholders
    }
  });
};
