
import { predefinedIssues } from './materialityUtils';
import { determineESGCategory } from './categoryPatterns';

// Categorize predefined issues by ESG category
export const categorizePredefinedIssues = () => {
  return predefinedIssues.map(issue => {
    return {
      ...issue,
      category: determineESGCategory(issue.id)
    };
  });
};

// Create filtered lists of issues by category
export const getIssuesByCategory = () => {
  const categorizedIssues = categorizePredefinedIssues();
  
  return {
    environmental: categorizedIssues.filter(issue => issue.category === 'environmental'),
    social: categorizedIssues.filter(issue => issue.category === 'social'),
    governance: categorizedIssues.filter(issue => issue.category === 'governance')
  };
};
