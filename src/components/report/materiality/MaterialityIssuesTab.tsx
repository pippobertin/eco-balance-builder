
import React, { useState, useMemo } from 'react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import IssueItem from './IssueItem';
import AddIssueForm from './AddIssueForm';
import MaterialityReport from './MaterialityReport';
import MaterialityMatrixChart from './MaterialityMatrixChart';
import { MaterialityIssue } from './types';
import { predefinedIssues } from './utils/materialityUtils';
import MaterialityIntro from './components/MaterialityIntro';
import DragDropThemes from './components/DragDropThemes';
import NoIssuesFound from './components/NoIssuesFound';

interface MaterialityIssuesTabProps {
  issues: MaterialityIssue[];
  onIssueChange: (id: string, field: keyof MaterialityIssue, value: any) => void;
  onAddCustomIssue: (name: string, description: string) => void;
  onRemoveIssue: (id: string) => void;
  surveyProgress?: {
    sent: number;
    completed: number;
    total: number;
  };
}

const MaterialityIssuesTab: React.FC<MaterialityIssuesTabProps> = ({
  issues,
  onIssueChange,
  onAddCustomIssue,
  onRemoveIssue,
  surveyProgress = { sent: 0, completed: 0, total: 0 }
}) => {
  const [showDragDropSelector, setShowDragDropSelector] = useState(true);
  
  // Funzione per gestire la selezione di un tema predefinito
  const handleIssueSelect = (predefinedIssue: { id: string; name: string; description: string }) => {
    console.log("Selected issue:", predefinedIssue);
    onAddCustomIssue(predefinedIssue.name, predefinedIssue.description);
  };

  return (
    <>
      <GlassmorphicCard>
        <MaterialityIntro />
        
        {/* Sezione Drag & Drop */}
        <div className="mb-8">
          <DragDropThemes 
            selectedIssues={issues}
            onIssueSelect={handleIssueSelect}
            onIssueRemove={onRemoveIssue}
          />
        </div>

        <div className="space-y-8">
          {issues.length > 0 && <MaterialityMatrixChart issues={issues} />}
          
          {issues.length > 0 ? (
            issues.map((issue) => (
              <IssueItem 
                key={issue.id}
                issue={issue}
                onIssueChange={onIssueChange}
                onRemoveIssue={onRemoveIssue}
                isPredefined={predefinedIssues.some(predefined => predefined.id === issue.id)}
              />
            ))
          ) : (
            <NoIssuesFound />
          )}
          
          <AddIssueForm onAddIssue={onAddCustomIssue} />
        </div>
      </GlassmorphicCard>
      
      <MaterialityReport 
        materialIssues={issues.filter(issue => issue.isMaterial)}
        surveyProgress={surveyProgress}
      />
    </>
  );
};

export default MaterialityIssuesTab;
