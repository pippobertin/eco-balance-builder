import { predefinedIssues } from './materialityUtils';
import { determineESGCategory, environmentalPatterns, socialPatterns, governancePatterns } from './categoryPatterns';
import { MaterialityIssue } from '../types';

// Categorize predefined issues by ESG category
export const categorizePredefinedIssues = () => {
  return predefinedIssues.map(issue => ({
    ...issue,
    category: determineESGCategory(issue.id)
  }));
};

// Improved categorization using both pattern matching and manual categorization
export const getIssuesByCategory = () => {
  const categorizedIssues = categorizePredefinedIssues();
  
  // Explicitly check category patterns for accurate theme grouping
  return {
    // Environmental themes
    environmental: categorizedIssues.filter(issue => {
      // Category is already set to environmental
      if (issue.category === 'environmental') return true;
      
      // Explicit pattern matching for environmental themes
      const id = issue.id.toLowerCase();
      
      // Climate change themes
      if (id.includes('climate') || id.includes('energy')) return true;
      
      // Pollution themes
      if (id.includes('pollution') || id.includes('substances')) return true;
      
      // Water and marine resources
      if (id.includes('water') || id.includes('marine') || id.includes('ocean')) return true;
      
      // Biodiversity and ecosystems
      if (id.includes('biodiversity') || id.includes('ecosystem') || 
          id.includes('species') || id.includes('soil') || id.includes('land')) return true;
      
      // Circular economy
      if (id.includes('circular') || id.includes('resource') || id.includes('waste')) return true;
      
      return false;
    }),
    
    // Social themes
    social: categorizedIssues.filter(issue => {
      // Category is already set to social
      if (issue.category === 'social') return true;
      
      // Explicit pattern matching for social themes
      const id = issue.id.toLowerCase();
      const name = issue.name.toLowerCase();
      
      // Workforce themes
      if (id.includes('workforce') || id.includes('labor') || id.includes('employee')) return true;
      
      // Community themes
      if (id.includes('community') || id.includes('indigenous')) return true;
      
      // Consumer themes
      if (id.includes('consumer') || id.includes('customer')) return true;
      
      // Rights and equality
      if (id.includes('equality') || id.includes('diversity') || 
          id.includes('human-rights') || id.includes('privacy')) return true;
      
      // Health and safety
      if (id.includes('health') || id.includes('safety')) return true;
      
      return false;
    }),
    
    // Governance themes
    governance: categorizedIssues.filter(issue => {
      // Category is already set to governance
      if (issue.category === 'governance') return true;
      
      // Explicit pattern matching for governance themes
      const id = issue.id.toLowerCase();
      const name = issue.name.toLowerCase();
      
      // Business conduct
      if (id.includes('business') || id.includes('ethics')) return true;
      
      // Corruption
      if (id.includes('corruption') || id.includes('bribery')) return true;
      
      // Other governance themes
      if (id.includes('whistleblower') || id.includes('animal') || 
          id.includes('political') || id.includes('supplier') || 
          id.includes('gov') || id.includes('compliance')) return true;
      
      return false;
    })
  };
};
