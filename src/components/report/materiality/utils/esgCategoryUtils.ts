
import { predefinedIssues } from './materialityUtils';

// Define a type for predefined issues that includes the category property
type PredefinedIssue = {
  id: string;
  name: string;
  description: string;
  category?: 'environmental' | 'social' | 'governance';
};

export const translateESGCategory = (category: string): string => {
  switch (category) {
    case 'environment':
      return 'Ambiente';
    case 'social':
      return 'Sociale';
    case 'governance':
      return 'Governance';
    default:
      return category;
  }
};

export const categorizeIssuesByESG = () => {
  const categories = {
    environment: [] as PredefinedIssue[],
    social: [] as PredefinedIssue[],
    governance: [] as PredefinedIssue[]
  };

  predefinedIssues.forEach(issue => {
    // Safely check if the issue has a category property before using it
    const issueCategory = (issue as unknown as { category?: string }).category;
    
    if (issueCategory === 'environmental') {
      categories.environment.push(issue);
    } else if (issueCategory === 'social') {
      categories.social.push(issue);
    } else if (issueCategory === 'governance') {
      categories.governance.push(issue);
    }
  });

  return categories;
};

// Export categoryColors for components like MaterialityMatrixChart, MaterialityLegend, and MaterialityTooltip
export const categoryColors = {
  environmental: '#10B981', // Green
  social: '#3B82F6',       // Blue
  governance: '#8B5CF6',   // Purple
  default: '#6B7280'       // Gray
};

// Create an alias for getIssueCategory for backward compatibility
export const getESGCategory = (issueId: string): 'environmental' | 'social' | 'governance' | 'default' => {
  const issue = predefinedIssues.find(i => i.id === issueId);
  if (!issue) return 'default';
  
  // Safely access the category property
  const issueCategory = (issue as unknown as { category?: string }).category;
  if (issueCategory === 'environmental' || issueCategory === 'social' || issueCategory === 'governance') {
    return issueCategory;
  }
  return 'default';
};

export const calculateImportanceScore = (issue: any): number => {
  // Calculate importance score based on impact, financial relevance and stakeholder relevance
  const impactWeight = 0.4;
  const financialWeight = 0.4;
  const stakeholderWeight = 0.2;
  
  let score = 0;
  
  // Add impact score if it exists
  if (typeof issue.impactRelevance === 'number') {
    score += issue.impactRelevance * impactWeight;
  }
  
  // Add financial score if it exists
  if (typeof issue.financialRelevance === 'number') {
    score += issue.financialRelevance * financialWeight;
  }
  
  // Add stakeholder score if it exists
  if (typeof issue.stakeholderRelevance === 'number') {
    score += issue.stakeholderRelevance * stakeholderWeight;
  } else {
    // If stakeholder relevance is missing, redistribute the weight
    const redistributedWeight = stakeholderWeight / 2;
    if (typeof issue.impactRelevance === 'number') {
      score += issue.impactRelevance * redistributedWeight;
    }
    if (typeof issue.financialRelevance === 'number') {
      score += issue.financialRelevance * redistributedWeight;
    }
  }
  
  return score;
};
