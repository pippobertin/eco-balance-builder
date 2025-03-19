
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useReport } from '@/context/ReportContext';
import { MaterialityIssue, Stakeholder } from '../types';
import { useMaterialityIssues } from '../hooks/useMaterialityIssues';
import { useStakeholders } from '../hooks/useStakeholders';
import { useSurveyDialog } from '../hooks/useSurveyDialog';
import { useSurveyValidation } from '../hooks/useSurveyValidation';
import { useSurveyResponses } from '../hooks/useSurveyResponses';
import MaterialityContext from './MaterialityContext';
import { MaterialityProviderProps } from './types';
import { updateFormWithIssues, updateFormWithStakeholders } from './utils';
import { useToast } from '@/hooks/use-toast';
import { safeJsonStringify } from '@/integrations/supabase/utils/jsonUtils';

export const MaterialityProvider: React.FC<MaterialityProviderProps> = ({
  children,
  formValues,
  setFormValues,
  getStakeholderPriorityColor,
  getSurveyStatusColor,
  getSurveyStatusText
}) => {
  const { toast } = useToast();
  const { reportData, updateReportData, currentReport } = useReport();
  
  // Verifica che ci siano effettivamente temi nel caricamento iniziale
  const initialIssues = formValues.materialityAnalysis?.issues || [];
  console.log("Initial issues in MaterialityProvider:", initialIssues);
  console.log("Initial material issues:", initialIssues.filter(i => i.isMaterial === true).map(i => i.name));
  
  // Use custom hooks for materiality issues
  const { 
    issues, 
    handleIssueChange, 
    addCustomIssue, 
    removeIssue,
    updateIssuesWithStakeholderRelevance
  } = useMaterialityIssues(
    initialIssues,
    async (updatedIssues) => {
      // Update form values
      updateFormWithIssues(
        formValues,
        setFormValues,
        updatedIssues,
        updateReportData,
        reportData
      );
      
      // If we have a current report, save directly to the database
      if (currentReport?.id) {
        try {
          const { error } = await supabase
            .from('materiality_issues')
            .upsert(
              updatedIssues.map(issue => ({
                report_id: currentReport.id,
                issue_id: issue.id,
                name: issue.name,
                description: issue.description,
                impact_relevance: issue.impactRelevance,
                financial_relevance: issue.financialRelevance,
                is_material: issue.isMaterial,
                stakeholder_relevance: issue.stakeholderRelevance || 0,
                iro_selections: issue.iroSelections ? safeJsonStringify(issue.iroSelections) : null,
                updated_at: new Date().toISOString()
              })),
              { onConflict: 'report_id,issue_id' }
            );
            
          if (error) {
            throw error;
          }
          
          console.log("Materiality issues saved to database successfully");
        } catch (error) {
          console.error("Error saving materiality issues:", error);
          toast({
            title: "Errore",
            description: "Impossibile salvare i temi materiali",
            variant: "destructive"
          });
        }
      }
    }
  );
  
  // Use stakeholders hook
  const { 
    stakeholders, 
    addStakeholder, 
    removeStakeholder, 
    handleStakeholderChange, 
    updateStakeholderSurveyStatus,
    processSurveyResponse
  } = useStakeholders(
    formValues.materialityAnalysis?.stakeholders,
    async (updatedStakeholders) => {
      // Update form values
      updateFormWithStakeholders(
        formValues,
        setFormValues,
        updatedStakeholders,
        updateReportData,
        reportData
      );
      
      // If we have a current report, save directly to the database
      if (currentReport?.id) {
        try {
          const { error } = await supabase
            .from('stakeholders')
            .upsert(
              updatedStakeholders.map(stakeholder => ({
                report_id: currentReport.id,
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
                survey_response: stakeholder.surveyResponse ? safeJsonStringify(stakeholder.surveyResponse) : null,
                updated_at: new Date().toISOString()
              })),
              { onConflict: 'report_id,stakeholder_id' }
            );
            
          if (error) {
            throw error;
          }
          
          console.log("Stakeholders saved to database successfully");
        } catch (error) {
          console.error("Error saving stakeholders:", error);
          toast({
            title: "Errore",
            description: "Impossibile salvare gli stakeholder",
            variant: "destructive"
          });
        }
      }
    }
  );
  
  // Use strict equality to ensure only true values are included
  const materialIssues = issues.filter(issue => issue.isMaterial === true);
  console.log("Material issues in MaterialityProvider:", materialIssues.length);
  console.log("Material issue names:", materialIssues.map(i => i.name));
  
  // Use survey dialog hook
  const { 
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
    openSurveyDialog: openSurveyDialogInternal
  } = useSurveyDialog(materialIssues, stakeholders);

  // Use survey validation hook
  const {
    validateSurveySending,
    openSurveyDialog: validateAndOpenSurvey
  } = useSurveyValidation();

  // Use survey responses hook
  const {
    sendSurveys,
    handleSurveyResponse
  } = useSurveyResponses(
    stakeholders,
    updateStakeholderSurveyStatus,
    updateIssuesWithStakeholderRelevance
  );
  
  // Load materiality issues and stakeholders from the database when the report changes
  useEffect(() => {
    const loadMaterialityData = async () => {
      if (currentReport?.id) {
        try {
          // Load materiality issues
          const { data: issuesData, error: issuesError } = await supabase
            .from('materiality_issues')
            .select('*')
            .eq('report_id', currentReport.id);
            
          if (issuesError) {
            console.error("Error loading materiality issues:", issuesError);
          } else if (issuesData && issuesData.length > 0) {
            console.log("Loaded materiality issues from database:", issuesData.length);
            
            const formattedIssues: MaterialityIssue[] = issuesData.map(issue => ({
              id: issue.issue_id,
              name: issue.name,
              description: issue.description,
              impactRelevance: issue.impact_relevance,
              financialRelevance: issue.financial_relevance,
              isMaterial: issue.is_material,
              stakeholderRelevance: issue.stakeholder_relevance,
              iroSelections: issue.iro_selections ? JSON.parse(issue.iro_selections) : undefined
            }));
            
            // Update the issues state directly
            const processIssues = async () => {
              for (const issue of formattedIssues) {
                await handleIssueChange(issue);
              }
            };
            
            processIssues();
          }
          
          // Load stakeholders
          const { data: stakeholdersData, error: stakeholdersError } = await supabase
            .from('stakeholders')
            .select('*')
            .eq('report_id', currentReport.id);
            
          if (stakeholdersError) {
            console.error("Error loading stakeholders:", stakeholdersError);
          } else if (stakeholdersData && stakeholdersData.length > 0) {
            console.log("Loaded stakeholders from database:", stakeholdersData.length);
            
            const formattedStakeholders: Stakeholder[] = stakeholdersData.map(stakeholder => ({
              id: stakeholder.stakeholder_id,
              name: stakeholder.name,
              category: stakeholder.category,
              influence: stakeholder.influence,
              interest: stakeholder.interest,
              contactInfo: stakeholder.contact_info,
              email: stakeholder.email,
              notes: stakeholder.notes,
              priority: stakeholder.priority,
              surveyStatus: stakeholder.survey_status,
              surveyToken: stakeholder.survey_token,
              surveyResponse: stakeholder.survey_response ? JSON.parse(stakeholder.survey_response) : undefined
            }));
            
            // Update the stakeholders state
            for (const stakeholder of formattedStakeholders) {
              if (stakeholders.some(s => s.id === stakeholder.id)) {
                handleStakeholderChange(stakeholder);
              } else {
                addStakeholder(stakeholder);
              }
            }
          }
        } catch (error) {
          console.error("Error loading materiality data:", error);
          toast({
            title: "Errore",
            description: "Impossibile caricare i dati di materialità",
            variant: "destructive"
          });
        }
      }
    };
    
    loadMaterialityData();
  }, [currentReport?.id]);

  // Open survey dialog with validation
  const openSurveyDialog = () => {
    validateAndOpenSurvey(materialIssues, stakeholders);
    if (materialIssues.length > 0 && stakeholders.length > 0) {
      openSurveyDialogInternal();
    }
  };
  
  // Handle survey sending
  const handleSendSurveys = () => {
    if (validateSurveySending(selectedStakeholders)) {
      sendSurveys(selectedStakeholders);
      setSurveyDialogOpen(false);
    }
  };

  // Debug log the status of material issues whenever they change
  useEffect(() => {
    const materialCount = issues.filter(issue => issue.isMaterial === true).length;
    console.log(`MaterialityProvider: Total issues: ${issues.length}, Material issues: ${materialCount}`);
    if (materialCount > 0) {
      console.log("Material issue names:", issues.filter(i => i.isMaterial === true).map(i => i.name));
    }
  }, [issues]);

  const value = {
    // Issues
    issues,
    handleIssueChange,
    addCustomIssue,
    removeIssue,
    materialIssues,
    
    // Stakeholders
    stakeholders,
    addStakeholder,
    removeStakeholder,
    handleStakeholderChange,
    
    // Survey
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
    
    // Actions
    openSurveyDialog,
    handleSendSurveys,
    
    // Utility functions
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

export default MaterialityProvider;
