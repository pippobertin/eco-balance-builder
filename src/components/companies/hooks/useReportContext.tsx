
import { useState } from 'react';
import { useReport } from '@/context/ReportContext';

export const useReportContext = () => {
  const { currentCompany } = useReport();
  const [isAddReportDialogOpen, setIsAddReportDialogOpen] = useState(false);
  
  return {
    selectedCompany: currentCompany,
    isAddReportDialogOpen,
    setIsAddReportDialogOpen
  };
};
