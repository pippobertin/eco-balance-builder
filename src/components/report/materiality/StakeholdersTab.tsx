
import React from 'react';
import { Users, Search, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import StakeholderItem from './StakeholderItem';
import AddStakeholderForm from './AddStakeholderForm';
import StakeholderEngagement from './StakeholderEngagement';
import SurveyProgressBar from './SurveyProgressBar';
import { MaterialityIssue, Stakeholder } from './types';

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
  surveyProgress: {
    sent: number;
    completed: number;
    total: number;
  };
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
  getSurveyStatusText,
  surveyProgress
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showAddForm, setShowAddForm] = React.useState(false);

  const filteredStakeholders = searchTerm
    ? stakeholders.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : stakeholders;

  return (
    <>
      <GlassmorphicCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-blue-500" />
            <h3 className="text-xl font-semibold">Mappatura degli Stakeholder</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {showAddForm ? 'Annulla' : 'Aggiungi Stakeholder'}
          </Button>
        </div>
        
        {showAddForm ? (
          <AddStakeholderForm 
            onAddStakeholder={onAddStakeholder}
            onCancel={() => setShowAddForm(false)}
          />
        ) : (
          <>
            {surveyProgress.total > 0 && (
              <div className="mb-6">
                <SurveyProgressBar 
                  sent={surveyProgress.sent} 
                  completed={surveyProgress.completed} 
                  total={surveyProgress.total} 
                />
              </div>
            )}
          
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cerca stakeholder per nome o categoria..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {filteredStakeholders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nessuno stakeholder trovato. Aggiungi il primo stakeholder per iniziare.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStakeholders.map((stakeholder) => (
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
            )}
          </>
        )}
      </GlassmorphicCard>
      
      {!showAddForm && materialIssues.length > 0 && (
        <StakeholderEngagement 
          materialIssues={materialIssues}
          stakeholders={stakeholders}
          onOpenSurveyDialog={onOpenSurveyDialog}
        />
      )}
    </>
  );
};

export default StakeholdersTab;
