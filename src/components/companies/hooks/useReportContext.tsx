
import { useState, useEffect } from 'react';
import { useReport } from '@/context/ReportContext';

export const useReportContext = () => {
  const { currentCompany, companies } = useReport();
  const [isAddReportDialogOpen, setIsAddReportDialogOpen] = useState(false);
  
  return {
    selectedCompany: currentCompany,
    isAddReportDialogOpen,
    setIsAddReportDialogOpen,
    companies
  };
};
