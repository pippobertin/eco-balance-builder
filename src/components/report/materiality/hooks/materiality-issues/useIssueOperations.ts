
import { MaterialityIssue } from '../../types';
import { predefinedIssues, isHeaderTheme, emptyIROSelections } from '../../utils/materialityUtils';

/**
 * Hook for issue operations like adding and removing issues
 */
export const useIssueOperations = (
  issues: MaterialityIssue[],
  setIssues: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>,
  onUpdate: (issues: MaterialityIssue[]) => void
) => {
  // Add a custom or predefined issue
  const addCustomIssue = (name: string, description: string) => {
    const predefinedIssue = predefinedIssues.find(
      issue => issue.name === name && issue.description === description
    );
    
    console.log("Adding issue:", name, "predefined:", !!predefinedIssue);
    
    setIssues(prevIssues => {
      if (predefinedIssue) {
        if (prevIssues.some(issue => issue.id === predefinedIssue.id)) {
          console.log("Issue already exists, not adding duplicate:", predefinedIssue.id);
          return prevIssues;
        }
        
        console.log("Adding predefined issue:", predefinedIssue);
        const updatedIssues = [
          ...prevIssues,
          {
            id: predefinedIssue.id,
            name: predefinedIssue.name,
            description: predefinedIssue.description,
            impactRelevance: 50,
            financialRelevance: 50,
            isMaterial: true, // Set as material by default (CRITICAL: must be true, not truthy)
            iroSelections: emptyIROSelections
          }
        ];
        
        // Count material issues for debugging
        const materialCount = updatedIssues.filter(issue => issue.isMaterial === true).length;
        console.log(`After adding predefined issue: ${updatedIssues.length} total, ${materialCount} material`);
        
        onUpdate(updatedIssues);
        return updatedIssues;
      } else {
        const id = `custom-${Date.now()}`;
        console.log("Adding custom issue with ID:", id);
        const updatedIssues = [
          ...prevIssues,
          {
            id,
            name,
            description,
            impactRelevance: 50,
            financialRelevance: 50,
            isMaterial: true, // Set as material by default (CRITICAL: must be true, not truthy)
            iroSelections: emptyIROSelections
          }
        ];
        
        // Count material issues for debugging
        const materialCount = updatedIssues.filter(issue => issue.isMaterial === true).length;
        console.log(`After adding custom issue: ${updatedIssues.length} total, ${materialCount} material`);
        
        onUpdate(updatedIssues);
        return updatedIssues;
      }
    });
  };

  // Remove an issue (set isMaterial to false)
  const removeIssue = (id: string) => {
    console.log("Removing issue:", id);
    
    // Check if the theme is a header before removing it
    const issueToRemove = issues.find(issue => issue.id === id);
    if (issueToRemove && isHeaderTheme(issueToRemove.id, issueToRemove.name)) {
      console.log("Cannot remove header theme:", issueToRemove.name);
      return;
    }
    
    setIssues(prevIssues => {
      // Instead of completely removing, explicitly set isMaterial to false
      const updatedIssues = prevIssues.map(issue => 
        issue.id === id ? { ...issue, isMaterial: false } : issue
      );
      
      // Count material issues for debugging
      const materialCount = updatedIssues.filter(issue => issue.isMaterial === true).length;
      console.log(`After removing issue: ${updatedIssues.length} total, ${materialCount} material`);
      
      // Important: Trigger update to ensure UI reflects changes
      setTimeout(() => {
        onUpdate(updatedIssues);
      }, 50);
      
      return updatedIssues;
    });
  };

  return {
    addCustomIssue,
    removeIssue
  };
};
