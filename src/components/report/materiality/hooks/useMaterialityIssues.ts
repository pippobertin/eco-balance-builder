
import { MaterialityIssue } from '../types';
import { 
  useIssuesState, 
  useIssueUpdater, 
  useIssueOperations, 
  useStakeholderRelevance 
} from './materiality-issues';

/**
 * Main hook for managing materiality issues
 * This is now a composition of smaller, focused hooks
 */
export const useMaterialityIssues = (
  initialIssues: MaterialityIssue[] | undefined, 
  onUpdate: (issues: MaterialityIssue[]) => void
) => {
  // Use smaller hooks for specific functionality
  const { issues, setIssues } = useIssuesState(initialIssues, onUpdate);
  const { handleIssueChange } = useIssueUpdater(issues, setIssues, onUpdate);
  const { addCustomIssue, removeIssue } = useIssueOperations(issues, setIssues, onUpdate);
  const { updateIssuesWithStakeholderRelevance } = useStakeholderRelevance(issues, setIssues, onUpdate);

  // Return a consolidated API that maintains the same interface
  return {
    issues,
    handleIssueChange,
    addCustomIssue,
    removeIssue,
    updateIssuesWithStakeholderRelevance
  };
};
