
import { predefinedIssues } from './materialityUtils';
import { MaterialityIssue } from '../types';

// Color mapping for ESG categories
export const categoryColors = {
  environmental: '#2E7D32', // Green
  social: '#1976D2',       // Blue
  governance: '#9C27B0',   // Purple
  environment: '#2E7D32',  // Green (alternative naming)
};

// Categorize materiality issues by ESG category
export const categorizeIssuesByESG = () => {
  const environment = predefinedIssues.filter(issue => 
    issue.id.startsWith('climate') || 
    issue.id.startsWith('pollution') || 
    issue.id.startsWith('water') || 
    issue.id.includes('marine') || 
    issue.id.startsWith('biodiversity') || 
    issue.id.includes('soil') || 
    issue.id.includes('ecosystem') || 
    issue.id.startsWith('resource') || 
    issue.id === 'waste' || 
    issue.id === 'energy'
  );
  
  const social = predefinedIssues.filter(issue => 
    issue.id.startsWith('labor') || 
    issue.id.startsWith('supply-labor') || 
    issue.id.startsWith('community') || 
    issue.id.startsWith('indigenous') || 
    issue.id.startsWith('consumer') || 
    issue.id.includes('human-rights')
  );
  
  const governance = predefinedIssues.filter(issue => 
    issue.id.startsWith('business') || 
    issue.id === 'whistleblower-protection' || 
    issue.id === 'animal-welfare' || 
    issue.id === 'political-engagement' || 
    issue.id === 'supplier-relations' || 
    issue.id.includes('corruption')
  );
  
  return {
    environment,
    social,
    governance
  };
};

// Get the ESG category of a materiality issue
export const getIssueESGCategory = (issueId: string): 'environment' | 'social' | 'governance' => {
  if (
    issueId.startsWith('climate') || 
    issueId.startsWith('pollution') || 
    issueId.startsWith('water') || 
    issueId.includes('marine') || 
    issueId.startsWith('biodiversity') || 
    issueId.includes('soil') || 
    issueId.includes('ecosystem') || 
    issueId.startsWith('resource') || 
    issueId === 'waste' || 
    issueId === 'energy'
  ) {
    return 'environment';
  } else if (
    issueId.startsWith('labor') || 
    issueId.startsWith('supply-labor') || 
    issueId.startsWith('community') || 
    issueId.startsWith('indigenous') || 
    issueId.startsWith('consumer') || 
    issueId.includes('human-rights')
  ) {
    return 'social';
  } else {
    return 'governance';
  }
};

// Translate the ESG category to Italian
export const translateESGCategory = (category: string): string => {
  switch (category) {
    case 'environment': return 'Ambiente';
    case 'social': return 'Sociale';
    case 'governance': return 'Governance';
    default: return category;
  }
};

// Get the ESG category of a materiality issue - Alias for compatibility
export const getESGCategory = (issueId: string): 'environmental' | 'social' | 'governance' => {
  const category = getIssueESGCategory(issueId);
  // Map environment to environmental for compatibility
  if (category === 'environment') return 'environmental';
  return category as 'environmental' | 'social' | 'governance';
};

// Calculate importance score for a materiality issue
export const calculateImportanceScore = (issue: MaterialityIssue): number => {
  // Base calculation is the average of financial and impact relevance
  let score = (issue.financialRelevance + issue.impactRelevance) / 2;
  
  // If stakeholder relevance is available, include it in the calculation
  if (issue.stakeholderRelevance && issue.stakeholderRelevance > 0) {
    score = (score + issue.stakeholderRelevance) / 2;
  }
  
  return score;
};
