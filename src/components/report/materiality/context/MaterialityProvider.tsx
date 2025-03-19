import React, { createContext, useContext, useState, useEffect } from 'react';
import { MaterialityContextType, MaterialityIssue, Stakeholder } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { safeJsonParse, safeJsonStringify } from '@/integrations/supabase/utils/jsonUtils';
import { calculateAverageMatrix, defaultMaterialityIssues } from '../utils/materialityUtils';
import { useReport } from '@/hooks/use-report-context';
import { useToast } from '@/hooks/use-toast';

const MaterialityContext = createContext<MaterialityContextType | undefined>(undefined);

export const MaterialityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentReport } = useReport();
  const reportId = currentReport?.id;
  const { toast } = useToast();

  const [issues, setIssues] = useState<MaterialityIssue[]>([]);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [esgScore, setEsgScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (reportId) {
      loadDataFromDatabase(reportId);
    } else {
      setIssues(defaultMaterialityIssues);
    }
  }, [reportId]);

  // Load data from database
  const loadDataFromDatabase = async (reportId: string) => {
    setIsLoading(true);
    try {
      // Load issues
      const { data: issuesData, error: issuesError } = await supabase
        .from('materiality_issues')
        .select('*')
        .eq('report_id', reportId);

      if (issuesError) throw issuesError;

      // Load stakeholders
      const { data: stakeholdersData, error: stakeholdersError } = await supabase
        .from('stakeholders')
        .select('*')
        .eq('report_id', reportId);

      if (stakeholdersError) throw stakeholdersError;

      // Load ESG score
      const { data: esgData, error: esgError } = await supabase
        .from('reports')
        .select('materiality_analysis')
        .eq('id', reportId)
        .single();

      if (esgError) throw esgError;

      // Update state
      if (issuesData) {
        setIssues(issuesData as MaterialityIssue[]);
      } else {
        setIssues(defaultMaterialityIssues);
      }

      if (stakeholdersData) {
        setStakeholders(stakeholdersData as Stakeholder[]);
      } else {
        setStakeholders([]);
      }

      if (esgData?.materiality_analysis) {
        const materialityAnalysis = safeJsonParse(esgData.materiality_analysis, {});
        setEsgScore(Number(materialityAnalysis.esgScore) || null);
      } else {
        setEsgScore(null);
      }
    } catch (error) {
      console.error('Error loading data from database:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save data to database
  const saveDataToDatabase = async () => {
    setIsSaving(true);
    try {
      if (!reportId) throw new Error('Report ID is missing');

      // Save issues
      const issuesSaved = await saveIssuesToDatabase(issues, reportId);

      // Save stakeholders
      const stakeholdersSaved = await saveStakeholdersToDatabase(stakeholders, reportId);

      // Save ESG score
      const { error: updateError } = await supabase
        .from('reports')
        .update({
          materiality_analysis: safeJsonStringify({ esgScore: esgScore || 0 })
        })
        .eq('id', reportId);

      if (updateError) throw updateError;

      if (issuesSaved && stakeholdersSaved) {
        toast({
          title: 'Successo',
          description: 'Dati salvati con successo',
        });
      }
    } catch (error) {
      console.error('Error saving data to database:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile salvare i dati',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // When saving issues to database, convert numeric values properly
const saveIssuesToDatabase = async (issues: MaterialityIssue[], reportId: string) => {
  try {
    if (!issues.length || !reportId) return;

    // For each issue, save to database
    for (const issue of issues) {
      const { id, ...issueData } = issue;
      
      // Check if the issue already exists in the database
      const { data, error: checkError } = await supabase
        .from('materiality_issues')
        .select('id')
        .eq('report_id', reportId)
        .eq('issue_id', issue.issue_id)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      // Prepare issue data with proper numeric values
      const issueToSave = {
        report_id: reportId,
        issue_id: issue.issue_id,
        name: issue.name,
        description: issue.description || '',
        impact_relevance: Number(issue.impact_relevance) || 0,
        financial_relevance: Number(issue.financial_relevance) || 0,
        is_material: Boolean(issue.is_material),
        stakeholder_relevance: Number(issue.stakeholder_relevance) || 0,
        iro_selections: issue.iro_selections ? safeJsonStringify(issue.iro_selections) : null,
        updated_at: new Date().toISOString()
      };
      
      if (data) {
        // Update existing issue
        const { error: updateError } = await supabase
          .from('materiality_issues')
          .update(issueToSave)
          .eq('report_id', reportId)
          .eq('issue_id', issue.issue_id);
        
        if (updateError) throw updateError;
      } else {
        // Insert new issue
        const { error: insertError } = await supabase
          .from('materiality_issues')
          .insert(issueToSave);
          
        if (insertError) throw insertError;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error saving issues to database:', error);
    return false;
  }
};

// When saving stakeholders to database, convert numeric values properly
const saveStakeholdersToDatabase = async (stakeholders: Stakeholder[], reportId: string) => {
  try {
    if (!stakeholders.length || !reportId) return;
    
    // For each stakeholder, save to database
    for (const stakeholder of stakeholders) {
      const { id, ...stakeholderData } = stakeholder;
      
      // Check if the stakeholder already exists
      const { data, error: checkError } = await supabase
        .from('stakeholders')
        .select('id')
        .eq('report_id', reportId)
        .eq('stakeholder_id', stakeholder.stakeholder_id)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      // Prepare stakeholder data with proper numeric values
      const stakeholderToSave = {
        report_id: reportId,
        stakeholder_id: stakeholder.stakeholder_id,
        name: stakeholder.name,
        category: stakeholder.category || '',
        influence: Number(stakeholder.influence) || 0,
        interest: Number(stakeholder.interest) || 0,
        contact_info: stakeholder.contact_info || '',
        email: stakeholder.email || '',
        notes: stakeholder.notes || '',
        priority: stakeholder.priority || '',
        survey_status: stakeholder.survey_status || 'pending',
        survey_token: stakeholder.survey_token || '',
        survey_response: stakeholder.survey_response ? safeJsonStringify(stakeholder.survey_response) : null,
        updated_at: new Date().toISOString()
      };
      
      if (data) {
        // Update existing stakeholder
        const { error: updateError } = await supabase
          .from('stakeholders')
          .update(stakeholderToSave)
          .eq('report_id', reportId)
          .eq('stakeholder_id', stakeholder.stakeholder_id);
          
        if (updateError) throw updateError;
      } else {
        // Insert new stakeholder
        const { error: insertError } = await supabase
          .from('stakeholders')
          .insert(stakeholderToSave);
          
        if (insertError) throw insertError;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error saving stakeholders to database:', error);
    return false;
  }
};

  // Update issue
  const updateIssue = (issueId: string, field: keyof MaterialityIssue, value: any) => {
    setIssues(prev =>
      prev.map(issue =>
        issue.issue_id === issueId ? { ...issue, [field]: value } : issue
      )
    );
  };

  // Add issue
  const addIssue = (newIssue: Omit<MaterialityIssue, 'id'>) => {
    setIssues(prev => [...prev, { ...newIssue, id: Math.random().toString() }]);
  };

  // Delete issue
  const deleteIssue = (issueId: string) => {
    setIssues(prev => prev.filter(issue => issue.issue_id !== issueId));
  };

  // Update stakeholder
  const updateStakeholder = (stakeholderId: string, field: keyof Stakeholder, value: any) => {
    setStakeholders(prev =>
      prev.map(stakeholder =>
        stakeholder.stakeholder_id === stakeholderId ? { ...stakeholder, [field]: value } : stakeholder
      )
    );
  };

  // Add stakeholder
  const addStakeholder = (newStakeholder: Omit<Stakeholder, 'id'>) => {
    setStakeholders(prev => [...prev, { ...newStakeholder, id: Math.random().toString() }]);
  };

  // Delete stakeholder
  const deleteStakeholder = (stakeholderId: string) => {
    setStakeholders(prev => prev.filter(stakeholder => stakeholder.stakeholder_id !== stakeholderId));
  };

  // Calculate materiality matrix
  const calculateMaterialityMatrix = () => {
    return calculateAverageMatrix(issues);
  };

  const value: MaterialityContextType = {
    issues,
    stakeholders,
    esgScore,
    setEsgScore,
    isLoading,
    isSaving,
    updateIssue,
    addIssue,
    deleteIssue,
    updateStakeholder,
    addStakeholder,
    deleteStakeholder,
    calculateMaterialityMatrix,
    saveDataToDatabase
  };

  return (
    <MaterialityContext.Provider value={value}>
      {children}
    </MaterialityContext.Provider>
  );
};

export const useMateriality = () => {
  const context = useContext(MaterialityContext);
  if (context === undefined) {
    throw new Error('useMateriality must be used within a MaterialityProvider');
  }
  return context;
};
