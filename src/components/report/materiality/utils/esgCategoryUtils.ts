
import { predefinedIssues } from './materialityUtils';
import { MaterialityIssue } from '../types';

// Strong typing for ESG categories
export type ESGCategory = 'environmental' | 'social' | 'governance' | 'default';

// Interface for predefined issues with category
export interface PredefinedIssue extends MaterialityIssue {
  category?: ESGCategory;
}

// Define the return type for categorizeIssuesByESG
export interface ESGCategorizedIssues {
  environment: PredefinedIssue[];
  social: PredefinedIssue[];
  governance: PredefinedIssue[];
}

export const translateESGCategory = (category: string): string => {
  switch (category) {
    case 'environmental':
      return 'Ambiente';
    case 'social':
      return 'Sociale';
    case 'governance':
      return 'Governance';
    default:
      return category;
  }
};

export const categorizeIssuesByESG = (): ESGCategorizedIssues => {
  const categories: ESGCategorizedIssues = {
    environment: [],
    social: [],
    governance: []
  };

  // Type assertion is safer with the PredefinedIssue interface
  (predefinedIssues as PredefinedIssue[]).forEach(issue => {
    if (issue.category === 'environmental') {
      categories.environment.push(issue);
    } else if (issue.category === 'social') {
      categories.social.push(issue);
    } else if (issue.category === 'governance') {
      categories.governance.push(issue);
    }
  });

  return categories;
};

// Export categoryColors with a proper type
export const categoryColors: Record<ESGCategory, string> = {
  environmental: '#10B981', // Green
  social: '#3B82F6',       // Blue
  governance: '#8B5CF6',   // Purple
  default: '#6B7280'       // Gray
};

export const getESGCategory = (issueId: string): ESGCategory => {
  const issue = predefinedIssues.find(i => i.id === issueId);
  if (!issue) return 'default';
  
  // Safe type casting with the PredefinedIssue interface
  const predefinedIssue = issue as PredefinedIssue;
  if (predefinedIssue.category && 
      (predefinedIssue.category === 'environmental' || 
       predefinedIssue.category === 'social' || 
       predefinedIssue.category === 'governance')) {
    return predefinedIssue.category;
  }
  return 'default';
};

export const calculateImportanceScore = (issue: MaterialityIssue): number => {
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
