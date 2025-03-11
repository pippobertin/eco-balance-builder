
import { MaterialityIssue } from '../types';

/**
 * Calculate ESG score based on material issues
 * @param issues List of materiality issues
 * @returns Calculated ESG score (0-100)
 */
export const calculateEsgScore = (issues: MaterialityIssue[]): number => {
  const materialIssues = issues.filter(issue => issue.isMaterial);
  if (materialIssues.length === 0) return 50;
  
  const totalScore = materialIssues.reduce((score, issue) => {
    const impactScore = issue.impactRelevance || 0;
    const financialScore = issue.financialRelevance || 0;
    const stakeholderScore = issue.stakeholderRelevance || 0;
    
    // Weight the scores (stakeholder feedback has a higher weight)
    return score + (impactScore * 0.4) + (financialScore * 0.3) + (stakeholderScore * 0.3);
  }, 0);
  
  return Math.round(totalScore / materialIssues.length);
};
