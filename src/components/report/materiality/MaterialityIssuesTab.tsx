
import React, { useState, useMemo } from 'react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import IssueItem from './IssueItem';
import AddIssueForm from './AddIssueForm';
import MaterialityReport from './MaterialityReport';
import MaterialityMatrixChart from './MaterialityMatrixChart';
import { MaterialityIssue } from './types';
import { predefinedIssues } from './utils/materialityUtils';
import { issueMatchesTheme } from './utils/issueFilterUtils';
import MaterialityIntro from './components/MaterialityIntro';
import ESRSThemeFilter from './components/ESRSThemeFilter';
import PredefinedIssuesSelector from './components/PredefinedIssuesSelector';
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
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [showPredefinedSelector, setShowPredefinedSelector] = useState(false);
  
  const addedIssueIds = useMemo(() => issues.map(issue => issue.id), [issues]);
  
  const filteredIssues = useMemo(() => {
    if (selectedTheme === 'all') return issues;
    
    return issues.filter(issue => {
      const matchingPredefined = predefinedIssues.find(p => p.id === issue.id);
      if (!matchingPredefined) return false;
      
      return issueMatchesTheme(issue.id, selectedTheme);
    });
  }, [issues, selectedTheme]);
      
  const filteredPredefinedIssues = useMemo(() => {
    return predefinedIssues.filter(issue => {
      if (addedIssueIds.includes(issue.id)) return false;
      
      return selectedTheme === 'all' || issueMatchesTheme(issue.id, selectedTheme);
    });
  }, [selectedTheme, addedIssueIds]);
  
  const addPredefinedIssue = (predefinedIssue: { id: string; name: string; description: string }) => {
    onAddCustomIssue(predefinedIssue.name, predefinedIssue.description);
  };

  const togglePredefinedSelector = () => {
    setShowPredefinedSelector(!showPredefinedSelector);
  };

  return (
    <>
      <GlassmorphicCard>
        <MaterialityIntro />
        
        <ESRSThemeFilter 
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          showPredefinedSelector={showPredefinedSelector}
          togglePredefinedSelector={togglePredefinedSelector}
        />
        
        {showPredefinedSelector && (
          <PredefinedIssuesSelector 
            filteredPredefinedIssues={filteredPredefinedIssues}
            addPredefinedIssue={addPredefinedIssue}
          />
        )}

        <div className="space-y-8">
          {issues.length > 0 && <MaterialityMatrixChart issues={issues} />}
          
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
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
