
import { useContext } from 'react';
import { ReportContext } from '@/context/ReportContext';

export const useReport = () => {
  const context = useContext(ReportContext);
  
  if (!context) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  
  return context;
};
