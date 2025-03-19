
import { AlertCircle, CheckCircle } from 'lucide-react';
import React from 'react';
import { useReport } from '@/hooks/use-report-context';
import { motion, AnimatePresence } from 'framer-motion';

interface AutoSaveIndicatorProps {
  className?: string;
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ className = "" }) => {
  const { needsSaving, lastSaved } = useReport();
  
  // Format the last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return null;
    
    const now = new Date();
    const savedTime = new Date(lastSaved);
    const diffInMinutes = Math.floor((now.getTime() - savedTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return "ora";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min fa`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ore fa`;
    }
  };
  
  const formattedTime = formatLastSaved();
  
  return (
    <AnimatePresence>
      {needsSaving ? (
        <motion.div
          key="saving"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`flex items-center text-amber-500 text-sm ${className}`}>
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>Salvataggio in corso...</span>
        </motion.div>
      ) : lastSaved && (
        <motion.div
          key="saved"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`flex items-center text-emerald-500 text-sm ${className}`}>
          <CheckCircle className="h-4 w-4 mr-1" />
          <span>Salvato {formattedTime}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AutoSaveIndicator;
