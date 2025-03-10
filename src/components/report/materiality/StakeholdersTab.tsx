
import React from 'react';
import { Users } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import StakeholderItem from './StakeholderItem';
import AddStakeholderForm from './AddStakeholderForm';
import StakeholderEngagement from './StakeholderEngagement';
import { MaterialityIssue, Stakeholder } from './types';
import { stakeholderCategories } from './utils/materialityUtils';

interface StakeholdersTabProps {
  stakeholders: Stakeholder[];
  materialIssues: MaterialityIssue[];
  onStakeholderChange: (id: string, field: keyof Stakeholder, value: any) => void;
  onAddStakeholder: (stakeholder: Omit<Stakeholder, 'id' | 'priority' | 'surveyStatus'>) => void;
  onRemoveStakeholder: (id: string) => void;
  onOpenSurveyDialog: () => void;
  getStakeholderPriorityColor: (priority: string) => string;
  getSurveyStatusColor: (status?: string) => string;
  getSurveyStatusText: (status?: string) => string;
}

const StakeholdersTab: React.FC<StakeholdersTabProps> = ({
  stakeholders,
  materialIssues,
  onStakeholderChange,
  onAddStakeholder,
  onRemoveStakeholder,
  onOpenSurveyDialog,
  getStakeholderPriorityColor,
  getSurveyStatusColor,
  getSurveyStatusText
}) => {
  return (
    <>
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Users className="mr-2 h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-semibold">Mappatura degli Stakeholder</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            La mappatura degli stakeholder è un processo cruciale per identificare e valutare gli individui, i gruppi e le organizzazioni 
            che possono influenzare o essere influenzati dalle attività dell'impresa. Gli stakeholder prioritari dovrebbero essere 
            coinvolti nel processo di analisi di materialità attraverso sondaggi, interviste o focus group.
          </p>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <p className="text-sm font-medium mb-2">Come utilizzare questo strumento:</p>
            <ol className="text-sm space-y-1 list-decimal pl-4">
              <li>Identifica e aggiungi gli stakeholder rilevanti per la tua organizzazione</li>
              <li>Valuta il loro livello di influenza sull'organizzazione e il loro interesse verso le questioni di sostenibilità</li>
              <li>La priorità sarà calcolata automaticamente in base a influenza e interesse</li>
              <li>Utilizza questa mappatura per decidere quali stakeholder coinvolgere nell'analisi di materialità</li>
            </ol>
          </div>
        </div>
        
        <div className="space-y-6">
          {stakeholders.length > 0 ? (
            <div className="space-y-4">
              {stakeholders.map((stakeholder) => (
                <StakeholderItem 
                  key={stakeholder.id}
                  stakeholder={stakeholder}
                  onStakeholderChange={onStakeholderChange}
                  onRemoveStakeholder={onRemoveStakeholder}
                  getStakeholderPriorityColor={getStakeholderPriorityColor}
                  getSurveyStatusColor={getSurveyStatusColor}
                  getSurveyStatusText={getSurveyStatusText}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Nessuno stakeholder aggiunto</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Inizia aggiungendo gli stakeholder rilevanti per la tua organizzazione utilizzando il modulo sottostante.
              </p>
            </div>
          )}
          
          <AddStakeholderForm 
            stakeholderCategories={stakeholderCategories}
            onAddStakeholder={onAddStakeholder}
          />
          
          {stakeholders.length > 0 && materialIssues.length > 0 && (
            <StakeholderEngagement 
              materialIssues={materialIssues}
              stakeholders={stakeholders}
              onOpenSurveyDialog={onOpenSurveyDialog}
            />
          )}
        </div>
      </GlassmorphicCard>
    </>
  );
};

export default StakeholdersTab;
