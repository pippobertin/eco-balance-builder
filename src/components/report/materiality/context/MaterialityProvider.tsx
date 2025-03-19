
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MaterialityIssue, Stakeholder, SurveyTemplate, IROSelections } from '../types';
import { MaterialityContextType, MaterialityProviderProps } from './types';
import { supabase } from '@/integrations/supabase/client';
import { calculateAverageMatrix, defaultMaterialityIssues, emptyIROSelections } from '../utils/materialityUtils';
import { safeJsonParse, safeJsonStringify } from '@/integrations/supabase/utils/jsonUtils';
import { useToast } from '@/hooks/use-toast';

const MaterialityContext = createContext<MaterialityContextType | undefined>(undefined);

export const MaterialityProvider: React.FC<MaterialityProviderProps> = ({ children, reportId }) => {
  const { toast } = useToast();

  const [issues, setIssues] = useState<MaterialityIssue[]>([]);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [esgScore, setEsgScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Survey state
  const [surveyTemplate, setSurveyTemplate] = useState<SurveyTemplate>({
    title: 'Materiality Assessment Survey',
    description: 'Please rate the following issues based on their importance to your organization.',
    issues: [],
    additionalComments: true
  });
  
  const [surveyDialogOpen, setSurveyDialogOpen] = useState(false);
  const [selectedStakeholders, setSelectedStakeholders] = useState<string[]>([]);
  const [forceResend, setForceResend] = useState(false);

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

      // Update state with mappings from DB fields to our model fields
      if (issuesData && issuesData.length > 0) {
        const mappedIssues: MaterialityIssue[] = issuesData.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          impactRelevance: Number(item.impact_relevance) || 0,
          financialRelevance: Number(item.financial_relevance) || 0,
          isMaterial: Boolean(item.is_material),
          stakeholderRelevance: Number(item.stakeholder_relevance) || 0,
          iroSelections: item.iro_selections ? 
            safeJsonParse(String(item.iro_selections), emptyIROSelections) : 
            emptyIROSelections
        }));
        setIssues(mappedIssues);
      } else {
        setIssues(defaultMaterialityIssues);
      }

      if (stakeholdersData && stakeholdersData.length > 0) {
        const mappedStakeholders: Stakeholder[] = stakeholdersData.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category || '',
          influence: Number(item.influence) || 0,
          interest: Number(item.interest) || 0,
          contactInfo: item.contact_info || '',
          email: item.email || '',
          notes: item.notes || '',
          priority: item.priority || '',
          surveyStatus: item.survey_status as 'pending' | 'sent' | 'completed' || 'pending',
          surveyToken: item.survey_token || '',
          surveyResponse: item.survey_response ? 
            safeJsonParse(String(item.survey_response), undefined) : 
            undefined
        }));
        setStakeholders(mappedStakeholders);
      } else {
        setStakeholders([]);
      }

      if (esgData?.materiality_analysis) {
        const materialityAnalysis = safeJsonParse(String(esgData.materiality_analysis), { esgScore: 0 });
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

  // When saving issues to database, convert to DB field names
  const saveIssuesToDatabase = async (issues: MaterialityIssue[], reportId: string) => {
    try {
      if (!issues.length || !reportId) return;

      // For each issue, save to database
      for (const issue of issues) {
        const { id } = issue;
        
        // Check if the issue already exists in the database
        const { data, error: checkError } = await supabase
          .from('materiality_issues')
          .select('id')
          .eq('report_id', reportId)
          .eq('id', id)
          .maybeSingle();
          
        if (checkError) throw checkError;
        
        // Prepare issue data with proper field names for DB
        const issueToSave = {
          report_id: reportId,
          id: id,
          issue_id: id, // Add issue_id field for database
          name: issue.name,
          description: issue.description || '',
          impact_relevance: Number(issue.impactRelevance) || 0,
          financial_relevance: Number(issue.financialRelevance) || 0,
          is_material: Boolean(issue.isMaterial),
          stakeholder_relevance: Number(issue.stakeholderRelevance) || 0,
          iro_selections: issue.iroSelections ? safeJsonStringify(issue.iroSelections) : null,
          updated_at: new Date().toISOString()
        };
        
        if (data) {
          // Update existing issue
          const { error: updateError } = await supabase
            .from('materiality_issues')
            .update(issueToSave)
            .eq('report_id', reportId)
            .eq('id', id);
        
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

  // When saving stakeholders to database, convert to DB field names
  const saveStakeholdersToDatabase = async (stakeholders: Stakeholder[], reportId: string) => {
    try {
      if (!stakeholders.length || !reportId) return;
      
      // For each stakeholder, save to database
      for (const stakeholder of stakeholders) {
        const { id } = stakeholder;
        
        // Check if the stakeholder already exists
        const { data, error: checkError } = await supabase
          .from('stakeholders')
          .select('id')
          .eq('report_id', reportId)
          .eq('id', id)
          .maybeSingle();
          
        if (checkError) throw checkError;
        
        // Prepare stakeholder data with proper field names for DB
        const stakeholderToSave = {
          report_id: reportId,
          id: id,
          stakeholder_id: id, // Add stakeholder_id field for database
          name: stakeholder.name,
          category: stakeholder.category || '',
          influence: Number(stakeholder.influence) || 0,
          interest: Number(stakeholder.interest) || 0,
          contact_info: stakeholder.contactInfo || '',
          email: stakeholder.email || '',
          notes: stakeholder.notes || '',
          priority: stakeholder.priority || '',
          survey_status: stakeholder.surveyStatus || 'pending',
          survey_token: stakeholder.surveyToken || '',
          survey_response: stakeholder.surveyResponse ? safeJsonStringify(stakeholder.surveyResponse) : null,
          updated_at: new Date().toISOString()
        };
        
        if (data) {
          // Update existing stakeholder
          const { error: updateError } = await supabase
            .from('stakeholders')
            .update(stakeholderToSave)
            .eq('report_id', reportId)
            .eq('id', id);
            
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
  const handleIssueChange = (id: string, field: keyof MaterialityIssue, value: any) => {
    setIssues(prev =>
      prev.map(issue =>
        issue.id === id ? { ...issue, [field]: value } : issue
      )
    );
  };

  // Add issue
  const addCustomIssue = (name: string, description: string) => {
    const newIssue: MaterialityIssue = {
      id: `custom-${Date.now()}`,
      name,
      description,
      impactRelevance: 0,
      financialRelevance: 0,
      isMaterial: false,
      iroSelections: emptyIROSelections
    };
    setIssues(prev => [...prev, newIssue]);
  };

  // Delete issue
  const removeIssue = (id: string) => {
    setIssues(prev => prev.filter(issue => issue.id !== id));
  };

  // Update stakeholder
  const handleStakeholderChange = (id: string, field: keyof Stakeholder, value: any) => {
    setStakeholders(prev =>
      prev.map(stakeholder =>
        stakeholder.id === id ? { ...stakeholder, [field]: value } : stakeholder
      )
    );
  };

  // Add stakeholder
  const addStakeholder = (newStakeholderData: Omit<Stakeholder, 'id' | 'priority' | 'surveyStatus'>) => {
    const id = `stakeholder-${Date.now()}`;
    // Calculate priority based on influence and interest
    const priority = calculatePriority(newStakeholderData.influence, newStakeholderData.interest);
    
    const newStakeholder: Stakeholder = {
      ...newStakeholderData,
      id,
      priority,
      surveyStatus: 'pending'
    };
    
    setStakeholders(prev => [...prev, newStakeholder]);
  };

  // Delete stakeholder
  const removeStakeholder = (id: string) => {
    setStakeholders(prev => prev.filter(stakeholder => stakeholder.id !== id));
  };

  // Calculate priority based on influence and interest
  const calculatePriority = (influence: number, interest: number): string => {
    if (influence >= 3 && interest >= 3) return 'high';
    if (influence >= 3 || interest >= 3) return 'medium';
    return 'low';
  };

  // Get stakeholder groups for survey dialog
  const stakeholderGroups = {
    pending: stakeholders.filter(s => s.surveyStatus === 'pending'),
    sent: stakeholders.filter(s => s.surveyStatus === 'sent'),
    completed: stakeholders.filter(s => s.surveyStatus === 'completed')
  };

  // Get survey progress
  const surveyProgress = {
    sent: stakeholders.filter(s => s.surveyStatus === 'sent' || s.surveyStatus === 'completed').length,
    completed: stakeholders.filter(s => s.surveyStatus === 'completed').length,
    total: stakeholders.length
  };

  // Open survey dialog
  const openSurveyDialog = () => {
    setSurveyTemplate(prev => ({
      ...prev,
      issues: issues.filter(issue => issue.isMaterial)
    }));
    setSurveyDialogOpen(true);
  };

  // Toggle force resend
  const toggleForceResend = () => setForceResend(prev => !prev);

  // Handle sending surveys
  const handleSendSurveys = () => {
    // This would be implemented based on your survey sending mechanism
    console.log("Sending surveys to:", selectedStakeholders);
    
    // Update stakeholder status
    setStakeholders(prev => 
      prev.map(stakeholder => 
        selectedStakeholders.includes(stakeholder.id) 
          ? { 
              ...stakeholder, 
              surveyStatus: 'sent',
              surveyToken: `token-${stakeholder.id}-${Date.now()}`
            } 
          : stakeholder
      )
    );
    
    setSurveyDialogOpen(false);
    setSelectedStakeholders([]);
    
    toast({
      title: "Sondaggi inviati",
      description: `${selectedStakeholders.length} stakeholder hanno ricevuto il sondaggio.`
    });
  };

  // Utility color functions
  const getStakeholderPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSurveyStatusColor = (status?: string): string => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'pending': 
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSurveyStatusText = (status?: string): string => {
    switch (status) {
      case 'completed': return 'Completato';
      case 'sent': return 'Inviato';
      case 'pending': 
      default: return 'In attesa';
    }
  };

  // Calculate material issues
  const materialIssues = issues.filter(issue => issue.isMaterial);

  const value: MaterialityContextType = {
    issues,
    handleIssueChange,
    addCustomIssue,
    removeIssue,
    materialIssues,
    stakeholders,
    addStakeholder,
    removeStakeholder,
    handleStakeholderChange,
    surveyTemplate,
    setSurveyTemplate,
    surveyDialogOpen,
    setSurveyDialogOpen,
    selectedStakeholders,
    setSelectedStakeholders,
    stakeholderGroups,
    forceResend,
    toggleForceResend,
    surveyProgress,
    openSurveyDialog,
    handleSendSurveys,
    getStakeholderPriorityColor,
    getSurveyStatusColor,
    getSurveyStatusText
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
