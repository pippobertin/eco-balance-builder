
import React from 'react';
import { FileText, Check } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { motion } from 'framer-motion';
import { MaterialityIssue } from './types';

interface MaterialityReportProps {
  materialIssues: MaterialityIssue[];
}

const MaterialityReport: React.FC<MaterialityReportProps> = ({ materialIssues }) => {
  return (
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <FileText className="mr-2 h-5 w-5 text-green-500" />
        <h3 className="text-xl font-semibold">Rapporto di Materialità</h3>
      </div>
      
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
                  <div>
                    <p className="font-medium">{issue.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{issue.description}</p>
                    <p className="text-xs mt-1">
                      <span className="font-medium">Rilevanza dell'impatto:</span> {issue.impactRelevance}% | 
                      <span className="font-medium ml-2">Rilevanza finanziaria:</span> {issue.financialRelevance}%
                    </p>
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
