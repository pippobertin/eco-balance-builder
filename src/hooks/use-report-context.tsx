
import { useContext } from 'react';
import { ReportContext } from '@/context/ReportContext';
import { ReportContextType } from '@/context/types';

export const useReport = (): ReportContextType => {
  const context = useContext(ReportContext);
  
  if (!context) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  
  return context;
};
