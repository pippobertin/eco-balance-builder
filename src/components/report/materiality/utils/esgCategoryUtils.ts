
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

// Mappa i temi predefiniti alle categorie ESG in base agli ESRS temi
const mapIssuesToESGCategories = (): PredefinedIssue[] => {
  // Cloniamo i temi predefiniti per non modificare l'originale
  return predefinedIssues.map(issue => {
    const issueWithCategory = { ...issue } as PredefinedIssue;
    
    // Assegna categorie in base all'ID del tema
    if (issue.id.startsWith('climate-') || 
        issue.id.startsWith('energy') || 
        issue.id.startsWith('pollution-') || 
        issue.id.startsWith('substances-') || 
        issue.id.startsWith('water-') || 
        issue.id.startsWith('ocean-') ||
        issue.id.startsWith('marine-') ||
        issue.id.startsWith('biodiversity-') ||
        issue.id.startsWith('species-') ||
        issue.id.startsWith('soil-') ||
        issue.id.startsWith('desertification') ||
        issue.id.startsWith('ecosystem-') ||
        issue.id.startsWith('resource-') ||
        issue.id.startsWith('waste')) {
      issueWithCategory.category = 'environmental';
    } 
    else if (issue.id.startsWith('labor-') || 
             issue.id.startsWith('supply-') ||
             issue.id.startsWith('community-') ||
             issue.id.startsWith('indigenous-') ||
             issue.id.startsWith('consumer-')) {
      issueWithCategory.category = 'social';
    } 
    else if (issue.id.startsWith('business-') ||
             issue.id.startsWith('whistleblower-') ||
             issue.id.startsWith('animal-') ||
             issue.id.startsWith('political-') ||
             issue.id.startsWith('supplier-') ||
             issue.id.startsWith('corruption-')) {
      issueWithCategory.category = 'governance';
    } 
    else {
      issueWithCategory.category = 'default';
    }
    
    return issueWithCategory;
  });
};

export const categorizeIssuesByESG = (): ESGCategorizedIssues => {
  const categories: ESGCategorizedIssues = {
    environment: [],
    social: [],
    governance: []
  };

  // Ottiene i temi con le categorie assegnate
  const issuesWithCategories = mapIssuesToESGCategories();
  
  // Filtra i temi in base alle categorie
  issuesWithCategories.forEach(issue => {
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
  // Riutilizziamo la funzione di mappatura per ottenere la categoria
  const issuesWithCategories = mapIssuesToESGCategories();
  const issue = issuesWithCategories.find(i => i.id === issueId);
  
  if (!issue || !issue.category) return 'default';
  return issue.category;
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
