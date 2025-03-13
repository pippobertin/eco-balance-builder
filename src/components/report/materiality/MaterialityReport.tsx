
import React from 'react';
import { FileText, Check, UsersRound, Link } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { motion } from 'framer-motion';
import { MaterialityIssue } from './types';
import SurveyProgressBar from './SurveyProgressBar';
import IRODialog from './components/IRODialog';
import { useIROIntegration } from './hooks/useIROIntegration';

interface MaterialityReportProps {
  materialIssues: MaterialityIssue[];
  surveyProgress: {
    sent: number;
    completed: number;
    total: number;
  };
  handleUpdateIssue?: (issueId: string, updatedIssue: Partial<MaterialityIssue>) => void;
}

const MaterialityReport: React.FC<MaterialityReportProps> = ({ 
  materialIssues,
  surveyProgress,
  handleUpdateIssue
}) => {
  const {
    selectedIssue,
    iroDialogOpen,
    handleOpenIRODialog,
    handleCloseIRODialog,
    handleSaveIRO
  } = useIROIntegration(materialIssues, (issueId, updatedIssue) => {
    if (handleUpdateIssue) {
      handleUpdateIssue(issueId, updatedIssue);
    }
  });

  console.log("MaterialityReport rendering with issues:", materialIssues.length);

  return (
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <FileText className="mr-2 h-5 w-5 text-green-500" />
        <h3 className="text-xl font-semibold text-gray-900">Rapporto di Materialità</h3>
      </div>
      
      {surveyProgress.total > 0 && (
        <div className="mb-6">
          <SurveyProgressBar 
            sent={surveyProgress.sent} 
            completed={surveyProgress.completed} 
            total={surveyProgress.total} 
          />
        </div>
      )}
      
      <div className="space-y-4">
        {materialIssues.length === 0 ? (
          <p className="text-sm text-gray-700">
            Nessuna questione è stata contrassegnata come materiale. 
            Utilizza i controlli sopra per valutare e selezionare le questioni materiali per la tua organizzazione.
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-700 mb-4">
              Le seguenti questioni sono state identificate come materiali per la tua organizzazione:
            </p>
            
            <div className="space-y-3">
              {materialIssues.map((issue) => (
                <motion.div 
                  key={issue.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-2 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleOpenIRODialog(issue)}
                >
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{issue.name}</p>
                      <Link className="h-4 w-4 text-blue-500" />
                      <span className="text-xs text-blue-600 font-medium">IRO</span>
                      {issue.iroSelections && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Configurato
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{issue.description}</p>
                    
                    <div className="flex flex-wrap gap-4 mt-2">
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">Rilevanza dell'impatto:</span> {issue.impactRelevance}%
                      </p>
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">Rilevanza finanziaria:</span> {issue.financialRelevance}%
                      </p>
                      
                      {issue.stakeholderRelevance !== undefined && (
                        <p className="text-xs flex items-center text-gray-700">
                          <UsersRound className="h-3 w-3 mr-1 text-blue-500" />
                          <span className="font-medium">Rilevanza stakeholder:</span> {Math.round(issue.stakeholderRelevance)}%
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedIssue && (
        <IRODialog 
          open={iroDialogOpen}
          onOpenChange={(open) => {
            if (!open) handleCloseIRODialog();
          }}
          issue={selectedIssue}
          onSave={handleSaveIRO}
        />
      )}
    </GlassmorphicCard>
  );
};

export default MaterialityReport;
