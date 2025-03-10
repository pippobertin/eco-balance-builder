
import { useState } from 'react';
import { Report } from '@/context/types';
import { useReport } from '@/context/ReportContext';

export const useReportDialogs = () => {
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { deleteReport } = useReport();
  
  const handleDeleteReport = async () => {
    if (!reportToDelete) return;
    
    const success = await deleteReport(reportToDelete.id);
    if (success) {
      setReportToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };
  
  return {
    reportToDelete,
    setReportToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteReport
  };
};
