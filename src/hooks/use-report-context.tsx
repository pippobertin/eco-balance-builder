
import { useContext } from 'react';
import { ReportContext, ReportContextType } from '@/context/ReportContext';

export const useReport = (): ReportContextType => {
  const context = useContext(ReportContext);
  
  if (!context) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  
  return context;
};
