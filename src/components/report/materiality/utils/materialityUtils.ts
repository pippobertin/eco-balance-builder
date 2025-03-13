
import { MaterialityIssue } from '../types';
import { predefinedIssues } from './predefinedIssues';

// Re-export functions from other utility files
export { calculatePriority } from './stakeholderUtils';
export { getStakeholderPriorityColor } from './stakeholderUtils';
export { getSurveyStatusColor, getSurveyStatusText } from './surveyUtils';
export { esrsThemes } from './esgCategoryUtils';

// Export predefined issues for use in other modules
export { predefinedIssues };

// Check if an issue is a header theme (typically for ESG categories)
export const isHeaderTheme = (id: string, name: string): boolean => {
  return id.includes('header');
};

// Define ESG categories
export const ESG_CATEGORIES = {
  ENVIRONMENTAL: 'environmental',
  SOCIAL: 'social',
  GOVERNANCE: 'governance'
};

// Get theme category based on ID
export const getThemeCategory = (id: string): string => {
  if (id.startsWith('environmental-') || 
      id.startsWith('climate-') || 
      id.startsWith('energy-') || 
      id.startsWith('pollution-') || 
      id.startsWith('substances-') || 
      id.startsWith('water-') || 
      id.startsWith('marine-') || 
      id.startsWith('ocean-') || 
      id.startsWith('biodiversity-') || 
      id.startsWith('ecosystem-') || 
      id.startsWith('species-') || 
      id.startsWith('circular-')) {
    return ESG_CATEGORIES.ENVIRONMENTAL;
  }
  
  if (id.startsWith('social-') || 
      id.startsWith('workforce-') || 
      id.startsWith('labor-') || 
      id.startsWith('community-') || 
      id.startsWith('indigenous-') || 
      id.startsWith('consumer-')) {
    return ESG_CATEGORIES.SOCIAL;
  }
  
  if (id.startsWith('governance-') || 
      id.startsWith('business-') || 
      id.startsWith('whistleblower-') || 
      id.startsWith('animal-') || 
      id.startsWith('political-') || 
      id.startsWith('supplier-') || 
      id.startsWith('corruption-')) {
    return ESG_CATEGORIES.GOVERNANCE;
  }
  
  // Default category for custom issues
  return ESG_CATEGORIES.ENVIRONMENTAL;
};

// Get materiality threshold
export const getMaterialityThreshold = (issues: MaterialityIssue[]): number => {
  if (!issues || issues.length === 0) return 0;
  
  // Calculate average of all financial and impact values
  const totalValues = issues.reduce((sum, issue) => {
    const financialValue = Number(issue.financialRelevance) || 0;
    const impactValue = Number(issue.impactRelevance) || 0;
    return sum + financialValue + impactValue;
  }, 0);
  
  const avgValue = totalValues / (issues.length * 2);
  
  // Return a value slightly below the average to create a reasonable threshold
  return Math.max(40, avgValue * 0.8);
};

// Group issues by category
export const groupIssuesByCategory = (issues: MaterialityIssue[]): Record<string, MaterialityIssue[]> => {
  return issues.reduce((grouped, issue) => {
    const category = getThemeCategory(issue.id);
    
    if (!grouped[category]) {
      grouped[category] = [];
    }
    
    grouped[category].push(issue);
    return grouped;
  }, {} as Record<string, MaterialityIssue[]>);
};

// Calculate materiality status for issues
export const calculateMateriality = (
  issues: MaterialityIssue[], 
  threshold: number = 50
): MaterialityIssue[] => {
  return issues.map(issue => {
    const financialValue = Number(issue.financialRelevance) || 0;
    const impactValue = Number(issue.impactRelevance) || 0;
    const isMaterial = financialValue >= threshold || impactValue >= threshold;
    
    return {
      ...issue,
      isMaterial
    };
  });
};

// Find a predefined issue by ID
export const findPredefinedIssueById = (id: string): MaterialityIssue | undefined => {
  return predefinedIssues.find(issue => issue.id === id);
};

// Find a predefined issue by name
export const findPredefinedIssueByName = (name: string): MaterialityIssue | undefined => {
  return predefinedIssues.find(issue => issue.name === name);
};

// Helper to create a new issue
export const createNewIssue = (
  name: string, 
  description: string,
  impactRelevance = 50,
  financialRelevance = 50
): MaterialityIssue => {
  const predefinedIssue = findPredefinedIssueByName(name);
  
  if (predefinedIssue) {
    return {
      ...predefinedIssue,
      impactRelevance,
      financialRelevance,
      isMaterial: true
    };
  }
  
  return {
    id: `custom-${Date.now()}`,
    name,
    description,
    impactRelevance,
    financialRelevance,
    isMaterial: true
  };
};
