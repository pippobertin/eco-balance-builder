
import React from 'react';
import { Target } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import IssueItem from './IssueItem';
import AddIssueForm from './AddIssueForm';
import MaterialityReport from './MaterialityReport';
import { MaterialityIssue } from './types';
import { predefinedIssues } from './utils/materialityUtils';

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
  return (
    <>
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Target className="mr-2 h-5 w-5 text-green-500" />
          <h3 className="text-xl font-semibold text-gray-900">Valutazione della Doppia Materialità</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-4">
            L'analisi di materialità valuta la rilevanza delle questioni di sostenibilità considerando due dimensioni:
            <br />- <strong>Rilevanza dell'impatto:</strong> impatti effettivi o potenziali sulle persone o sull'ambiente
            <br />- <strong>Rilevanza finanziaria:</strong> rischi e opportunità finanziarie che derivano dalle questioni di sostenibilità
          </p>
          
          <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
            <p className="text-sm font-medium mb-2 text-gray-900">Come utilizzare questo strumento:</p>
            <ol className="text-sm space-y-1 list-decimal pl-4 text-gray-800">
              <li>Valuta la rilevanza dell'impatto per ciascuna questione spostando il primo slider</li>
              <li>Valuta la rilevanza finanziaria spostando il secondo slider</li>
              <li>Contrassegna come "materiale" le questioni che consideri rilevanti</li>
              <li>Aggiungi questioni personalizzate se necessario</li>
            </ol>
          </div>
        </div>

        <div className="space-y-8">
          {issues.map((issue) => (
            <IssueItem 
              key={issue.id}
              issue={issue}
              onIssueChange={onIssueChange}
              onRemoveIssue={onRemoveIssue}
              isPredefined={predefinedIssues.some(predefined => predefined.id === issue.id)}
            />
          ))}
          
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
