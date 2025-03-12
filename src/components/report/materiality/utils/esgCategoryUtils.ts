
import { predefinedIssues } from './materialityUtils';

// Categorizza le questioni di materialità in base alle categorie ESG
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

// Ottiene la categoria ESG di una questione di materialità
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

// Traduce la categoria ESG in italiano
export const translateESGCategory = (category: string): string => {
  switch (category) {
    case 'environment': return 'Ambiente';
    case 'social': return 'Sociale';
    case 'governance': return 'Governance';
    default: return category;
  }
};
