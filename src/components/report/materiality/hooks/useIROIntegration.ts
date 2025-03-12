
import { useState, useCallback } from 'react';
import { MaterialityIssue, IROSelections } from '../types';
import { predefinedIROData } from '../utils/iroData';

export const useIROIntegration = (
  issues: MaterialityIssue[],
  onIssueUpdate: (issueId: string, updatedIssue: Partial<MaterialityIssue>) => void
) => {
  const [selectedIssue, setSelectedIssue] = useState<MaterialityIssue | null>(null);
  const [iroDialogOpen, setIroDialogOpen] = useState(false);

  const handleOpenIRODialog = useCallback((issue: MaterialityIssue) => {
    setSelectedIssue(issue);
    setIroDialogOpen(true);
  }, []);

  const handleCloseIRODialog = useCallback(() => {
    setSelectedIssue(null);
    setIroDialogOpen(false);
  }, []);

  const handleSaveIRO = useCallback((issueId: string, iroSelections: IROSelections) => {
    onIssueUpdate(issueId, { iroSelections });
    setIroDialogOpen(false);
  }, [onIssueUpdate]);

  const getAvailableIROData = useCallback((issueId: string) => {
    return predefinedIROData[issueId] || {
      positiveImpacts: [],
      negativeImpacts: [],
      risks: [],
      opportunities: [],
      actions: []
    };
  }, []);

  const getIROCount = useCallback((issue: MaterialityIssue) => {
    if (!issue.iroSelections) return 0;
    
    const { 
      selectedPositiveImpacts = [], 
      selectedNegativeImpacts = [], 
      selectedRisks = [], 
      selectedOpportunities = [], 
      selectedActions = [] 
    } = issue.iroSelections;
    
    const validItems = [
      ...selectedPositiveImpacts.filter(Boolean),
      ...selectedNegativeImpacts.filter(Boolean),
      ...selectedRisks.filter(Boolean),
      ...selectedOpportunities.filter(Boolean),
      ...selectedActions.filter(Boolean)
    ];
    
    return validItems.length;
  }, []);

  return {
    selectedIssue,
    iroDialogOpen,
    handleOpenIRODialog,
    handleCloseIRODialog,
    handleSaveIRO,
    getAvailableIROData,
    getIROCount
  };
};
