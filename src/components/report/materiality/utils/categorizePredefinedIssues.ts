
import { predefinedIssues } from './materialityUtils';
import { determineESGCategory } from './categoryPatterns';
import { MaterialityIssue } from '../types';

// Categorize predefined issues by ESG category
export const categorizePredefinedIssues = () => {
  return predefinedIssues.map(issue => ({
    ...issue,
    category: determineESGCategory(issue.id)
  }));
};

// Create filtered lists of issues by category
export const getIssuesByCategory = () => {
  const categorizedIssues = categorizePredefinedIssues();
  
  return {
    environmental: categorizedIssues.filter(issue => 
      issue.category === 'environmental' || 
      issue.id.startsWith('env-') ||
      issue.id.startsWith('water-') ||
      issue.id.startsWith('biodiversity-') ||
      issue.id.startsWith('circular-')
    ),
    social: categorizedIssues.filter(issue => 
      issue.category === 'social' || 
      issue.id.startsWith('workforce-') ||
      issue.id.startsWith('social-')
    ),
    governance: categorizedIssues.filter(issue => 
      issue.category === 'governance' || 
      issue.id.startsWith('gov-')
    )
  };
};
