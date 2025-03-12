import React from 'react';
import MaterialityIssuesTab from '../MaterialityIssuesTab';
import StakeholdersTab from '../StakeholdersTab';
import { MaterialityIssue } from '../types';
import { getStakeholderPriorityColor, getSurveyStatusColor, getSurveyStatusText } from '../utils/materialityUtils';

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
  handleUpdateIssue?: (id: string, updatedIssue: Partial<MaterialityIssue>) => void;
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
  surveyProgress,
  handleUpdateIssue
}) => {
  if (activeTab === 'issues') {
    return (
      <MaterialityIssuesTab 
        issues={issues}
        onIssueChange={handleIssueChange}
        onAddCustomIssue={addCustomIssue}
        onRemoveIssue={removeIssue}
        surveyProgress={surveyProgress}
        handleUpdateIssue={handleUpdateIssue}
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
