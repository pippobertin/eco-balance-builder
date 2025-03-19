
import React, { useState, useEffect, createContext, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MaterialityIssue, Stakeholder, IROSelections } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { safeJsonParse, safeJsonStringify } from '@/integrations/supabase/utils/jsonUtils';

// Define the interface for the context type
interface MaterialityContextType {
  // Issues
  materialityIssues: MaterialityIssue[];
  setMaterialityIssues: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>;
  selectedIssueIds: Set<string>;
  setSelectedIssueIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  addIssue: (issue: Omit<MaterialityIssue, 'id'>) => void;
  updateIssue: (issueId: string, updates: Partial<MaterialityIssue>) => void;
  removeIssue: (issueId: string) => void;
  
  // Stakeholders
  stakeholders: Stakeholder[];
  setStakeholders: React.Dispatch<React.SetStateAction<Stakeholder[]>>;
  addStakeholder: (stakeholder: Omit<Stakeholder, 'id'>) => void;
  updateStakeholder: (stakeholderId: string, updates: Partial<Stakeholder>) => void;
  removeStakeholder: (stakeholderId: string) => void;
  
  // General
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  lastSaved: Date | null;
  saveAllMaterialityData: () => Promise<boolean>;
}

export const MaterialityContext = createContext<MaterialityContextType | null>(null);

// Default materiality issues for new reports
const materialityIssuesDefaults: MaterialityIssue[] = [];

export const MaterialityProvider: React.FC<{
  children: React.ReactNode;
  reportId: string | null;
}> = ({ children, reportId }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Materiality issues state
  const [materialityIssues, setMaterialityIssues] = useState<MaterialityIssue[]>([]);
  const [selectedIssueIds, setSelectedIssueIds] = useState<Set<string>>(new Set());
  
  // Stakeholders state
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  
  useEffect(() => {
    if (reportId) {
      loadMaterialityData(reportId);
    }
  }, [reportId]);
  
  const loadMaterialityData = async (reportId: string) => {
    setIsLoading(true);
    
    try {
      // Load materiality issues from database
      const { data: issuesData, error: issuesError } = await supabase
        .from('materiality_issues')
        .select('*')
        .eq('report_id', reportId);
      
      if (issuesError) {
        console.error("Error loading materiality issues:", issuesError);
        throw issuesError;
      }
      
      // Load stakeholders from database
      const { data: stakeholdersData, error: stakeholdersError } = await supabase
        .from('stakeholders')
        .select('*')
        .eq('report_id', reportId);
      
      if (stakeholdersError) {
        console.error("Error loading stakeholders:", stakeholdersError);
        throw stakeholdersError;
      }
      
      // Transform issues data
      let issues: MaterialityIssue[] = [];
      if (issuesData && issuesData.length > 0) {
        issues = issuesData.map(item => {
          const impactRelevance = parseFloat(item.impact_relevance.toString()) || 0;
          const financialRelevance = parseFloat(item.financial_relevance.toString()) || 0;
          const stakeholderRelevance = parseFloat(item.stakeholder_relevance.toString()) || 0;
          
          return {
            id: item.issue_id,
            name: item.name,
            description: item.description || '',
            impactRelevance,
            financialRelevance,
            isMaterial: item.is_material || false,
            stakeholderRelevance,
            iroSelections: safeJsonParse(item.iro_selections.toString(), {
              selectedPositiveImpacts: [],
              selectedNegativeImpacts: [],
              selectedRisks: [],
              selectedOpportunities: [],
              selectedActions: []
            } as IROSelections)
          };
        });
        
        // Initialize selected issue IDs
        const selectedIds = new Set<string>();
        issues.forEach(issue => {
          if (issue.isMaterial) {
            selectedIds.add(issue.id);
          }
        });
        setSelectedIssueIds(selectedIds);
      } else {
        // Initialize with default data if no issues found
        issues = materialityIssuesDefaults;
      }
      
      // Transform stakeholders data
      let stakeholdersArray: Stakeholder[] = [];
      if (stakeholdersData && stakeholdersData.length > 0) {
        stakeholdersArray = stakeholdersData.map(item => ({
          id: item.stakeholder_id,
          name: item.name,
          category: item.category || '',
          influence: item.influence || 0,
          interest: item.interest || 0,
          contactInfo: item.contact_info || '',
          email: item.email || '',
          notes: item.notes || '',
          priority: item.priority || 'medium',
          surveyStatus: (item.survey_status as "pending" | "sent" | "completed") || 'pending',
          surveyToken: item.survey_token || '',
          surveyResponse: safeJsonParse(item.survey_response?.toString(), null)
        }));
      }
      
      // Update state
      setMaterialityIssues(issues);
      setStakeholders(stakeholdersArray);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error loading materiality data:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati dell'analisi di materialità",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveIssue = async (issue: MaterialityIssue, reportId: string) => {
    if (!reportId) return;
    
    try {
      const { error } = await supabase
        .from('materiality_issues')
        .upsert({
          report_id: reportId,
          issue_id: issue.id,
          name: issue.name,
          description: issue.description,
          impact_relevance: issue.impactRelevance.toString(),
          financial_relevance: issue.financialRelevance.toString(),
          is_material: issue.isMaterial,
          stakeholder_relevance: issue.stakeholderRelevance.toString(),
          iro_selections: safeJsonStringify(issue.iroSelections),
          updated_at: new Date().toISOString()
        }, { onConflict: 'report_id,issue_id' });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error saving issue:", error);
      return false;
    }
  };
  
  const saveIssues = async (issues: MaterialityIssue[]) => {
    if (!reportId) return false;
    
    try {
      // Save each issue individually
      const results = await Promise.all(
        issues.map(issue => saveIssue(issue, reportId))
      );
      
      // Check if all issues were saved successfully
      const success = results.every(result => result === true);
      
      if (success) {
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error saving issues:", error);
      return false;
    }
  };
  
  const saveStakeholder = async (stakeholder: Stakeholder, reportId: string) => {
    if (!reportId) return;
    
    try {
      const { error } = await supabase
        .from('stakeholders')
        .upsert({
          report_id: reportId,
          stakeholder_id: stakeholder.id,
          name: stakeholder.name,
          category: stakeholder.category,
          influence: stakeholder.influence,
          interest: stakeholder.interest,
          contact_info: stakeholder.contactInfo,
          email: stakeholder.email,
          notes: stakeholder.notes,
          priority: stakeholder.priority,
          survey_status: stakeholder.surveyStatus,
          survey_token: stakeholder.surveyToken,
          survey_response: safeJsonStringify(stakeholder.surveyResponse),
          updated_at: new Date().toISOString()
        }, { onConflict: 'report_id,stakeholder_id' });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error saving stakeholder:", error);
      return false;
    }
  };
  
  const saveStakeholders = async (stakeholdersArray: Stakeholder[]) => {
    if (!reportId) return false;
    
    try {
      // Save each stakeholder individually
      const results = await Promise.all(
        stakeholdersArray.map(stakeholder => saveStakeholder(stakeholder, reportId))
      );
      
      // Check if all stakeholders were saved successfully
      const success = results.every(result => result === true);
      
      if (success) {
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error saving stakeholders:", error);
      return false;
    }
  };
  
  // Callback to add a new issue
  const addIssue = useCallback((issue: Omit<MaterialityIssue, 'id'>) => {
    const newIssue: MaterialityIssue = {
      ...issue,
      id: uuidv4(),
    };
    
    setMaterialityIssues(prev => [...prev, newIssue]);
    setHasUnsavedChanges(true);
    
    // Save the new issue to the database
    if (reportId) {
      saveIssue(newIssue, reportId);
    }
  }, [reportId]);
  
  // Callback to update an existing issue
  const updateIssue = useCallback((issueId: string, updates: Partial<MaterialityIssue>) => {
    setMaterialityIssues(prev => 
      prev.map(issue => 
        issue.id === issueId ? { ...issue, ...updates } : issue
      )
    );
    setHasUnsavedChanges(true);
    
    // Save the updated issue to the database
    if (reportId) {
      const updatedIssue = materialityIssues.find(issue => issue.id === issueId);
      if (updatedIssue) {
        saveIssue({ ...updatedIssue, ...updates }, reportId);
      }
    }
  }, [materialityIssues, reportId]);
  
  // Callback to remove an issue
  const removeIssue = useCallback((issueId: string) => {
    setMaterialityIssues(prev => prev.filter(issue => issue.id !== issueId));
    setHasUnsavedChanges(true);
    
    // Remove the issue from the database
    if (reportId) {
      supabase
        .from('materiality_issues')
        .delete()
        .eq('report_id', reportId)
        .eq('issue_id', issueId)
        .then(({ error }) => {
          if (error) {
            console.error("Error deleting issue:", error);
          }
        });
    }
  }, [reportId]);
  
  // Callback to add a new stakeholder
  const addStakeholder = useCallback((stakeholder: Omit<Stakeholder, 'id'>) => {
    const newStakeholder: Stakeholder = {
      ...stakeholder,
      id: uuidv4(),
    };
    
    setStakeholders(prev => [...prev, newStakeholder]);
    setHasUnsavedChanges(true);
    
    // Save the new stakeholder to the database
    if (reportId) {
      saveStakeholder(newStakeholder, reportId);
    }
  }, [reportId]);
  
  // Callback to update an existing stakeholder
  const updateStakeholder = useCallback((stakeholderId: string, updates: Partial<Stakeholder>) => {
    setStakeholders(prev => 
      prev.map(stakeholder => 
        stakeholder.id === stakeholderId ? { ...stakeholder, ...updates } : stakeholder
      )
    );
    setHasUnsavedChanges(true);
    
    // Save the updated stakeholder to the database
    if (reportId) {
      const updatedStakeholder = stakeholders.find(stakeholder => stakeholder.id === stakeholderId);
      if (updatedStakeholder) {
        saveStakeholder({ ...updatedStakeholder, ...updates }, reportId);
      }
    }
  }, [stakeholders, reportId]);
  
  // Callback to remove a stakeholder
  const removeStakeholder = useCallback((stakeholderId: string) => {
    setStakeholders(prev => prev.filter(stakeholder => stakeholder.id !== stakeholderId));
    setHasUnsavedChanges(true);
    
    // Remove the stakeholder from the database
    if (reportId) {
      supabase
        .from('stakeholders')
        .delete()
        .eq('report_id', reportId)
        .eq('stakeholder_id', stakeholderId)
        .then(({ error }) => {
          if (error) {
            console.error("Error deleting stakeholder:", error);
          }
        });
    }
  }, [reportId]);
  
  // Save all materiality data
  const saveAllMaterialityData = useCallback(async () => {
    if (!reportId) return false;
    
    setIsLoading(true);
    try {
      const issuesSaved = await saveIssues(materialityIssues);
      const stakeholdersSaved = await saveStakeholders(stakeholders);
      
      if (issuesSaved && stakeholdersSaved) {
        toast({
          title: "Dati salvati",
          description: "I dati dell'analisi di materialità sono stati salvati con successo",
        });
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        return true;
      } else {
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante il salvataggio dei dati",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error saving materiality data:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio dei dati",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [materialityIssues, stakeholders, reportId, toast]);
  
  const value = {
    // Issues
    materialityIssues,
    setMaterialityIssues,
    selectedIssueIds,
    setSelectedIssueIds,
    addIssue,
    updateIssue,
    removeIssue,
    
    // Stakeholders
    stakeholders,
    setStakeholders,
    addStakeholder,
    updateStakeholder,
    removeStakeholder,
    
    // General
    isLoading,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    lastSaved,
    saveAllMaterialityData
  };
  
  return (
    <MaterialityContext.Provider value={value}>
      {children}
    </MaterialityContext.Provider>
  );
};
