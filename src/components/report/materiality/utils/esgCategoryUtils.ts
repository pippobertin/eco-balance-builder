
import { MaterialityIssue } from '../types';

/**
 * Determines the ESG category based on the issue ID
 * @param issueId The issue identifier
 * @returns The ESG category: 'environmental', 'social', or 'governance'
 */
export const getESGCategory = (issueId: string): 'environmental' | 'social' | 'governance' => {
  if (
    issueId.startsWith('climate') || 
    issueId.startsWith('water') || 
    issueId.startsWith('biodiversity') || 
    issueId.startsWith('pollution') || 
    issueId.startsWith('resource') || 
    issueId === 'energy' || 
    issueId === 'waste' ||
    issueId.includes('ecosystem') ||
    issueId.includes('substances') ||
    issueId.includes('marine') ||
    issueId.includes('soil')
  ) {
    return 'environmental';
  } else if (
    issueId.startsWith('labor') || 
    issueId.startsWith('supply-labor') || 
    issueId.startsWith('community') || 
    issueId.startsWith('indigenous') || 
    issueId.startsWith('consumer') ||
    issueId.startsWith('health') ||
    issueId.startsWith('safety') ||
    issueId.includes('diversity') ||
    issueId.includes('inclusion') ||
    issueId.includes('human-rights')
  ) {
    return 'social';
  } else {
    return 'governance';
  }
};

/**
 * Calculates the importance score for a materiality issue
 * @param issue The materiality issue
 * @returns The calculated importance score
 */
export const calculateImportanceScore = (issue: MaterialityIssue): number => {
  let importanceScore = (issue.impactRelevance + issue.financialRelevance) / 2;
  
  // If stakeholder relevance is available, include it in the calculation
  if (issue.stakeholderRelevance) {
    importanceScore = (importanceScore + issue.stakeholderRelevance) / 2;
  }
  
  return importanceScore;
};

/**
 * The colors used for each ESG category
 */
export const categoryColors = {
  environmental: "#22c55e", // Green
  social: "#f97316",        // Orange
  governance: "#9b87f5"     // Purple
};
