
import React, { useState, useEffect, createContext, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MaterialityIssue, Stakeholder, IROSelections } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { safeJsonParse, safeJsonStringify } from '@/integrations/supabase/utils/jsonUtils';

export interface MaterialityContextType {
  materialityIssues: MaterialityIssue[];
  setMaterialityIssues: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>;
  selectedIssueIds: Set<string>;
  setSelectedIssueIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  addIssue: (issue: Omit<MaterialityIssue, 'id'>) => void;
  updateIssue: (issueId: string, updates: Partial<MaterialityIssue>) => void;
  removeIssue: (issueId: string) => void;
  
  stakeholders: Stakeholder[];
  setStakeholders: React.Dispatch<React.SetStateAction<Stakeholder[]>>;
  addStakeholder: (stakeholder: Omit<Stakeholder, 'id'>) => void;
  updateStakeholder: (stakeholderId: string, updates: Partial<Stakeholder>) => void;
  removeStakeholder: (stakeholderId: string) => void;
  
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  lastSaved: Date | null;
  saveAllMaterialityData: () => Promise<boolean>;
}

export const MaterialityContext = createContext<MaterialityContextType | null>(null);

export const materialityIssuesDefaults: MaterialityIssue[] = [];

export const MaterialityProvider: React.FC<{
  children: React.ReactNode;
  reportId: string | null;
}> = ({ children, reportId }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [materialityIssues, setMaterialityIssues] = useState<MaterialityIssue[]>([]);
  const [selectedIssueIds, setSelectedIssueIds] = useState<Set<string>>(new Set());
  
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  
  useEffect(() => {
    if (reportId) {
      loadMaterialityData(reportId);
    }
  }, [reportId]);
  
  const loadMaterialityData = async (reportId: string) => {
    setIsLoading(true);
    
    try {
      const { data: issuesData, error: issuesError } = await supabase
        .from('materiality_issues')
        .select('*')
        .eq('report_id', reportId);
      
      if (issuesError) {
        console.error("Error loading materiality issues:", issuesError);
        throw issuesError;
      }
      
      const { data: stakeholdersData, error: stakeholdersError } = await supabase
        .from('stakeholders')
        .select('*')
        .eq('report_id', reportId);
      
      if (stakeholdersError) {
        console.error("Error loading stakeholders:", stakeholdersError);
        throw stakeholdersError;
      }
      
      let issues: MaterialityIssue[] = [];
      if (issuesData && issuesData.length > 0) {
        issues = issuesData.map(item => {
          const impactRelevance = parseFloat(item.impact_relevance as string) || 0;
          const financialRelevance = parseFloat(item.financial_relevance as string) || 0;
          const stakeholderRelevance = parseFloat(item.stakeholder_relevance as string) || 0;
          
          const iroSelectionsString = typeof item.iro_selections === 'string' 
            ? item.iro_selections 
            : JSON.stringify(item.iro_selections);
            
          return {
            id: item.issue_id,
            name: item.name,
            description: item.description || '',
            impactRelevance,
            financialRelevance,
            isMaterial: item.is_material || false,
            stakeholderRelevance,
            iroSelections: safeJsonParse<IROSelections>(
              iroSelectionsString, 
              {
                selectedPositiveImpacts: [],
                selectedNegativeImpacts: [],
                selectedRisks: [],
                selectedOpportunities: [],
                selectedActions: []
              }
            )
          };
        });
        
        const selectedIds = new Set<string>();
        issues.forEach(issue => {
          if (issue.isMaterial) {
            selectedIds.add(issue.id);
          }
        });
        setSelectedIssueIds(selectedIds);
      } else {
        issues = materialityIssuesDefaults;
      }
      
      let stakeholdersArray: Stakeholder[] = [];
      if (stakeholdersData && stakeholdersData.length > 0) {
        stakeholdersArray = stakeholdersData.map(item => {
          const influence = parseInt(item.influence as string) || 0;
          const interest = parseInt(item.interest as string) || 0;
          
          const surveyResponseString = typeof item.survey_response === 'string' 
            ? item.survey_response 
            : JSON.stringify(item.survey_response);
            
          return {
            id: item.stakeholder_id,
            name: item.name,
            category: item.category || '',
            influence,
            interest,
            contactInfo: item.contact_info || '',
            email: item.email || '',
            notes: item.notes || '',
            priority: item.priority || 'medium',
            surveyStatus: (item.survey_status as "pending" | "sent" | "completed") || 'pending',
            surveyToken: item.survey_token || '',
            surveyResponse: safeJsonParse(surveyResponseString, null)
          };
        });
      }
      
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
    if (!reportId) return false;
    
    try {
      const { data, error: checkError } = await supabase
        .from('materiality_issues')
        .select('issue_id')
        .eq('report_id', reportId)
        .eq('issue_id', issue.id)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking if issue exists:", checkError);
        return false;
      }
      
      // Convert numeric values to strings for the database
      const issueData = {
        report_id: reportId,
        issue_id: issue.id,
        name: issue.name,
        description: issue.description,
        impact_relevance: issue.impactRelevance.toString(),
        financial_relevance: issue.financialRelevance.toString(),
        is_material: issue.isMaterial,
        stakeholder_relevance: (issue.stakeholderRelevance || 0).toString(),
        iro_selections: safeJsonStringify(issue.iroSelections),
        updated_at: new Date().toISOString()
      };
      
      let result;
      
      if (data) {
        // Update existing issue
        const { error: updateError } = await supabase
          .from('materiality_issues')
          .update(issueData)
          .eq('report_id', reportId)
          .eq('issue_id', issue.id);
        
        if (updateError) throw updateError;
        result = true;
      } else {
        // Insert new issue
        const { error: insertError } = await supabase
          .from('materiality_issues')
          .insert(issueData);
        
        if (insertError) throw insertError;
        result = true;
      }
      
      return result;
    } catch (error) {
      console.error("Error saving issue:", error);
      return false;
    }
  };
  
  const saveIssues = async (issues: MaterialityIssue[]) => {
    if (!reportId) return false;
    
    try {
      const results = await Promise.all(
        issues.map(issue => saveIssue(issue, reportId))
      );
      
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
    if (!reportId) return false;
    
    try {
      const { data, error: checkError } = await supabase
        .from('stakeholders')
        .select('stakeholder_id')
        .eq('report_id', reportId)
        .eq('stakeholder_id', stakeholder.id)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking if stakeholder exists:", checkError);
        return false;
      }
      
      // Convert numeric values to strings for the database
      const stakeholderData = {
        report_id: reportId,
        stakeholder_id: stakeholder.id,
        name: stakeholder.name,
        category: stakeholder.category,
        influence: stakeholder.influence.toString(),
        interest: stakeholder.interest.toString(),
        contact_info: stakeholder.contactInfo,
        email: stakeholder.email,
        notes: stakeholder.notes,
        priority: stakeholder.priority,
        survey_status: stakeholder.surveyStatus,
        survey_token: stakeholder.surveyToken,
        survey_response: safeJsonStringify(stakeholder.surveyResponse),
        updated_at: new Date().toISOString()
      };
      
      let result;
      
      if (data) {
        // Update existing stakeholder
        const { error: updateError } = await supabase
          .from('stakeholders')
          .update(stakeholderData)
          .eq('report_id', reportId)
          .eq('stakeholder_id', stakeholder.id);
        
        if (updateError) throw updateError;
        result = true;
      } else {
        // Insert new stakeholder
        const { error: insertError } = await supabase
          .from('stakeholders')
          .insert(stakeholderData);
        
        if (insertError) throw insertError;
        result = true;
      }
      
      return result;
    } catch (error) {
      console.error("Error saving stakeholder:", error);
      return false;
    }
  };
  
  const saveStakeholders = async (stakeholdersArray: Stakeholder[]) => {
    if (!reportId) return false;
    
    try {
      const results = await Promise.all(
        stakeholdersArray.map(stakeholder => saveStakeholder(stakeholder, reportId))
      );
      
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
  
  const addIssue = useCallback((issue: Omit<MaterialityIssue, 'id'>) => {
    const newIssue: MaterialityIssue = {
      ...issue,
      id: uuidv4(),
    };
    
    setMaterialityIssues(prev => [...prev, newIssue]);
    setHasUnsavedChanges(true);
    
    if (reportId) {
      saveIssue(newIssue, reportId);
    }
  }, [reportId]);
  
  const updateIssue = useCallback((issueId: string, updates: Partial<MaterialityIssue>) => {
    setMaterialityIssues(prev => 
      prev.map(issue => 
        issue.id === issueId ? { ...issue, ...updates } : issue
      )
    );
    setHasUnsavedChanges(true);
    
    if (reportId) {
      const updatedIssue = materialityIssues.find(issue => issue.id === issueId);
      if (updatedIssue) {
        saveIssue({ ...updatedIssue, ...updates }, reportId);
      }
    }
  }, [materialityIssues, reportId]);
  
  const removeIssue = useCallback((issueId: string) => {
    setMaterialityIssues(prev => prev.filter(issue => issue.id !== issueId));
    setHasUnsavedChanges(true);
    
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
  
  const addStakeholder = useCallback((stakeholder: Omit<Stakeholder, 'id'>) => {
    const newStakeholder: Stakeholder = {
      ...stakeholder,
      id: uuidv4(),
    };
    
    setStakeholders(prev => [...prev, newStakeholder]);
    setHasUnsavedChanges(true);
    
    if (reportId) {
      saveStakeholder(newStakeholder, reportId);
    }
  }, [reportId]);
  
  const updateStakeholder = useCallback((stakeholderId: string, updates: Partial<Stakeholder>) => {
    setStakeholders(prev => 
      prev.map(stakeholder => 
        stakeholder.id === stakeholderId ? { ...stakeholder, ...updates } : stakeholder
      )
    );
    setHasUnsavedChanges(true);
    
    if (reportId) {
      const updatedStakeholder = stakeholders.find(stakeholder => stakeholder.id === stakeholderId);
      if (updatedStakeholder) {
        saveStakeholder({ ...updatedStakeholder, ...updates }, reportId);
      }
    }
  }, [stakeholders, reportId]);
  
  const removeStakeholder = useCallback((stakeholderId: string) => {
    setStakeholders(prev => prev.filter(stakeholder => stakeholder.id !== stakeholderId));
    setHasUnsavedChanges(true);
    
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
    materialityIssues,
    setMaterialityIssues,
    selectedIssueIds,
    setSelectedIssueIds,
    addIssue,
    updateIssue,
    removeIssue,
    
    stakeholders,
    setStakeholders,
    addStakeholder,
    updateStakeholder,
    removeStakeholder,
    
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
