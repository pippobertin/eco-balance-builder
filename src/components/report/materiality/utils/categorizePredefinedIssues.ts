
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

// Migliorata categorizzazione utilizzando sia pattern matching che pre-categorizzazione
export const getIssuesByCategory = () => {
  const categorizedIssues = categorizePredefinedIssues();
  
  return {
    // Temi Ambientali - solo header e temi correlati all'ambiente
    environmental: categorizedIssues.filter(issue => {
      const id = issue.id.toLowerCase();
      
      // Include solo header ambientali
      if (id.includes('header') && !id.startsWith('environmental-')) {
        return false;
      }
      
      // Header e temi ambientali specifici
      return id.startsWith('environmental-') || 
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
             id.startsWith('circular-');
    }),
    
    // Temi Sociali - solo header e temi correlati al sociale
    social: categorizedIssues.filter(issue => {
      const id = issue.id.toLowerCase();
      
      // Include solo header sociali
      if (id.includes('header') && !id.startsWith('social-')) {
        return false;
      }
      
      // Header e temi sociali specifici
      return id.startsWith('social-') ||
             id.startsWith('workforce-') ||
             id.startsWith('labor-') ||
             id.startsWith('community-') ||
             id.startsWith('indigenous-') ||
             id.startsWith('consumer-');
    }),
    
    // Temi di Governance - solo header e temi correlati alla governance
    governance: categorizedIssues.filter(issue => {
      const id = issue.id.toLowerCase();
      
      // Include solo header di governance
      if (id.includes('header') && !id.startsWith('governance-')) {
        return false;
      }
      
      // Header e temi di governance specifici
      return id.startsWith('governance-') ||
             id.startsWith('business-') ||
             id.startsWith('whistleblower-') ||
             id.startsWith('animal-') ||
             id.startsWith('political-') ||
             id.startsWith('supplier-') ||
             id.startsWith('corruption-');
    })
  };
};
