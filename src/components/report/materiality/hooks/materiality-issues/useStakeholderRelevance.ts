
import { MaterialityIssue } from '../../types';

/**
 * Hook for handling stakeholder relevance updates
 */
export const useStakeholderRelevance = (
  issues: MaterialityIssue[],
  setIssues: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>,
  onUpdate: (issues: MaterialityIssue[]) => void
) => {
  // Update issues with stakeholder relevance data
  const updateIssuesWithStakeholderRelevance = (updatedIssues: MaterialityIssue[]) => {
    const relevanceMap = new Map(
      updatedIssues.map(issue => [issue.id, issue.stakeholderRelevance])
    );
    
    setIssues(prevIssues => {
      const newIssues = prevIssues.map(issue => ({
        ...issue,
        stakeholderRelevance: relevanceMap.get(issue.id)
      }));
      
      onUpdate(newIssues);
      return newIssues;
    });
  };

  return {
    updateIssuesWithStakeholderRelevance
  };
};
