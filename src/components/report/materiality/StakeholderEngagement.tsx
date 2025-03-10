
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { MaterialityIssue, Stakeholder } from './types';

interface StakeholderEngagementProps {
  materialIssues: MaterialityIssue[];
  stakeholders: Stakeholder[];
  onOpenSurveyDialog: () => void;
}

const StakeholderEngagement: React.FC<StakeholderEngagementProps> = ({ 
  materialIssues,
  stakeholders,
  onOpenSurveyDialog
}) => {
  return (
    <GlassmorphicCard className="bg-green-50 border-green-200">
      <div className="flex items-center mb-4">
        <Send className="mr-2 h-5 w-5 text-green-600" />
        <h4 className="text-lg font-medium text-gray-900">Coinvolgimento degli Stakeholder</h4>
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-gray-800">
          Hai identificato {materialIssues.length} questioni materiali e {stakeholders.length} stakeholder. 
          Ora puoi creare un sondaggio per coinvolgere gli stakeholder nella valutazione di materialità.
        </p>
        
        <div className="p-4 bg-white shadow-sm rounded-md border border-gray-100">
          <h5 className="text-sm font-medium mb-2 text-gray-900">Questioni materiali identificate:</h5>
          <ul className="list-disc pl-5 text-sm space-y-1 text-gray-800">
            {materialIssues.map(issue => (
              <li key={issue.id}>{issue.name}</li>
            ))}
          </ul>
        </div>
        
        <Button 
          onClick={onOpenSurveyDialog}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Send className="mr-2 h-4 w-4" />
          Crea e invia sondaggio agli stakeholder
        </Button>
        
        <p className="text-xs text-gray-600 text-center">
          Il sondaggio includerà le questioni materiali identificate e consentirà agli stakeholder di 
          esprimere la loro valutazione sulla rilevanza di ciascuna questione.
        </p>
      </div>
    </GlassmorphicCard>
  );
};

export default StakeholderEngagement;
