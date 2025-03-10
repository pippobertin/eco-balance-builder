
import React from 'react';
import { FileText, Check, UsersRound } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { motion } from 'framer-motion';
import { MaterialityIssue } from './types';
import SurveyProgressBar from './SurveyProgressBar';

interface MaterialityReportProps {
  materialIssues: MaterialityIssue[];
  surveyProgress: {
    sent: number;
    completed: number;
    total: number;
  };
}

const MaterialityReport: React.FC<MaterialityReportProps> = ({ 
  materialIssues,
  surveyProgress
}) => {
  return (
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <FileText className="mr-2 h-5 w-5 text-green-500" />
        <h3 className="text-xl font-semibold">Rapporto di Materialità</h3>
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
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nessuna questione è stata contrassegnata come materiale. 
            Utilizza i controlli sopra per valutare e selezionare le questioni materiali per la tua organizzazione.
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Le seguenti questioni sono state identificate come materiali per la tua organizzazione:
            </p>
            
            <div className="space-y-3">
              {materialIssues.map((issue) => (
                <motion.div 
                  key={issue.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-2 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900"
                >
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{issue.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{issue.description}</p>
                    
                    <div className="flex flex-wrap gap-4 mt-2">
                      <p className="text-xs">
                        <span className="font-medium">Rilevanza dell'impatto:</span> {issue.impactRelevance}%
                      </p>
                      <p className="text-xs">
                        <span className="font-medium">Rilevanza finanziaria:</span> {issue.financialRelevance}%
                      </p>
                      
                      {issue.stakeholderRelevance !== undefined && (
                        <p className="text-xs flex items-center">
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
    </GlassmorphicCard>
  );
};

export default MaterialityReport;
