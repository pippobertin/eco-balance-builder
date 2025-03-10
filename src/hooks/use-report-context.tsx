
import { useContext } from 'react';
import { ReportContext } from '@/context/ReportContext';
import type { ReportContextType } from '@/context/types';

// Hook for using the report context
export const useReport = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
};
