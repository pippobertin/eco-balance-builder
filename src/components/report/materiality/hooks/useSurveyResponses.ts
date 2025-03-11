
import { useToast } from "@/hooks/use-toast";
import { MaterialityIssue, Stakeholder, SurveyResponse } from '../types';

export const useSurveyResponses = (
  stakeholders: Stakeholder[],
  updateStakeholderSurveyStatus: (selectedIds: string[], status: 'sent' | 'completed' | 'pending') => void,
  updateIssuesWithStakeholderRelevance: (updatedIssues: MaterialityIssue[]) => void
) => {
  const { toast } = useToast();

  const sendSurveys = (selectedStakeholders: string[]) => {
    // Update stakeholder survey status
    updateStakeholderSurveyStatus(selectedStakeholders, 'sent');
    
    // In a real application, here you would make an API call to send emails
    console.log("Sending survey to stakeholders:", selectedStakeholders);
  };

  // Handler for receiving survey responses from stakeholders
  const handleSurveyResponse = (response: SurveyResponse, materialIssues: MaterialityIssue[]) => {
    // Process the response and update stakeholder status
    const updatedIssues = processSurveyResponse(response, materialIssues);
    
    // Update issues with new stakeholder relevance data
    updateIssuesWithStakeholderRelevance(updatedIssues);
  };

  // Process survey response and calculate stakeholder relevance
  const processSurveyResponse = (response: SurveyResponse, materialIssues: MaterialityIssue[]) => {
    // Find the stakeholder who responded
    const respondingStakeholder = stakeholders.find(s => s.id === response.stakeholderId);
    
    if (respondingStakeholder) {
      // Update their status to completed
      updateStakeholderSurveyStatus([response.stakeholderId], 'completed');
      
      toast({
        title: "Risposta ricevuta",
        description: `Un nuovo stakeholder ha completato il sondaggio di materialità.`
      });
    }
    
    // Return updated issues with stakeholder relevance calculations
    return calculateStakeholderRelevance(materialIssues, stakeholders, response);
  };

  // Calculate stakeholder relevance for each issue based on survey responses
  const calculateStakeholderRelevance = (
    issues: MaterialityIssue[], 
    allStakeholders: Stakeholder[],
    newResponse?: SurveyResponse
  ): MaterialityIssue[] => {
    // Get stakeholders with responses, including the new one if provided
    const stakeholdersWithResponses = allStakeholders.filter(s => 
      s.surveyResponse || (newResponse && s.id === newResponse.stakeholderId)
    );
    
    return issues.map(issue => {
      // Get all ratings for this issue, including from the new response if available
      const ratings = stakeholdersWithResponses.flatMap(s => {
        if (s.id === newResponse?.stakeholderId) {
          const rating = newResponse.issueRatings.find(r => r.issueId === issue.id)?.relevance;
          return rating !== undefined ? [rating] : [];
        } else if (s.surveyResponse) {
          const rating = s.surveyResponse.issueRatings.find(r => r.issueId === issue.id)?.relevance;
          return rating !== undefined ? [rating] : [];
        }
        return [];
      });
      
      // Calculate average if there are any ratings
      const averageRelevance = ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : undefined;
      
      return {
        ...issue,
        stakeholderRelevance: averageRelevance
      };
    });
  };

  return {
    sendSurveys,
    handleSurveyResponse,
    processSurveyResponse,
    calculateStakeholderRelevance
  };
};
