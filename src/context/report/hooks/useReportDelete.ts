
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Report } from '@/context/types';
import { useReportOperations } from '../reportOperations';
import { localStorageUtils } from '../localStorageUtils';

export const useReportDelete = (
  setReports: React.Dispatch<React.SetStateAction<Report[]>>,
  setCurrentReport: React.Dispatch<React.SetStateAction<Report | null>>,
  resetReportData: () => void
) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { deleteReport: deleteReportData } = useReportOperations();

  // Handle delete report
  const handleDeleteReport = async (reportId: string): Promise<boolean> => {
    setLoading(true);
    const success = await deleteReportData(reportId);
    
    if (success) {
      // Remove the deleted report from the reports array
      setReports(prev => prev.filter(r => r.id !== reportId));
      toast({
        title: "Report eliminato con successo",
      });
      
      // If the deleted report was the current one, reset state
      const currentReportId = localStorageUtils.getCurrentReportId();
      if (currentReportId === reportId) {
        setCurrentReport(null);
        resetReportData();
        localStorageUtils.removeCurrentReportId();
      }
    }
    
    setLoading(false);
    return success;
  };

  return {
    loading,
    handleDeleteReport
  };
};
