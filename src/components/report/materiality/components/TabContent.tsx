
import React from 'react';
import MaterialityIssuesTab from '../MaterialityIssuesTab';
import StakeholdersTab from '../StakeholdersTab';

interface TabContentProps {
  activeTab: string;
  issues: any[];
  handleIssueChange: (id: string, field: any, value: any) => void;
  addCustomIssue: (name: string, description: string) => void;
  removeIssue: (id: string) => void;
  materialIssues: any[];
  stakeholders: any[];
  handleStakeholderChange: (id: string, field: any, value: any) => void;
  addStakeholder: (stakeholder: any) => void;
  removeStakeholder: (id: string) => void;
  openSurveyDialog: () => void;
  getStakeholderPriorityColor: (priority: string) => string;
  getSurveyStatusColor: (status?: string) => string;
  getSurveyStatusText: (status?: string) => string;
  surveyProgress: {
    sent: number;
    completed: number;
    total: number;
  };
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  issues,
  handleIssueChange,
  addCustomIssue,
  removeIssue,
  materialIssues,
  stakeholders,
  handleStakeholderChange,
  addStakeholder,
  removeStakeholder,
  openSurveyDialog,
  getStakeholderPriorityColor,
  getSurveyStatusColor,
  getSurveyStatusText,
  surveyProgress
}) => {
  if (activeTab === 'issues') {
    return (
      <MaterialityIssuesTab 
        issues={issues}
        onIssueChange={handleIssueChange}
        onAddCustomIssue={addCustomIssue}
        onRemoveIssue={removeIssue}
        surveyProgress={surveyProgress}
      />
    );
  }
  
  if (activeTab === 'stakeholders') {
    return (
      <StakeholdersTab 
        stakeholders={stakeholders}
        materialIssues={materialIssues}
        onStakeholderChange={handleStakeholderChange}
        onAddStakeholder={addStakeholder}
        onRemoveStakeholder={removeStakeholder}
        onOpenSurveyDialog={openSurveyDialog}
        getStakeholderPriorityColor={getStakeholderPriorityColor}
        getSurveyStatusColor={getSurveyStatusColor}
        getSurveyStatusText={getSurveyStatusText}
        surveyProgress={surveyProgress}
      />
    );
  }
  
  return null;
};

export default TabContent;
