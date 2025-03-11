
import { useState } from 'react';
import { Report } from '@/context/types';
import { useReport } from '@/context/ReportContext';
import { useToast } from '@/hooks/use-toast';

export const useReportDialogs = () => {
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { deleteReport } = useReport();
  const { toast } = useToast();
  
  const handleDeleteReport = async () => {
    if (!reportToDelete) return;
    
    try {
      console.log("Deleting report:", reportToDelete.id);
      const success = await deleteReport(reportToDelete.id);
      
      if (success) {
        setReportToDelete(null);
        setIsDeleteDialogOpen(false);
        console.log("Report deleted successfully");
      } else {
        console.error("Failed to delete report");
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante l'eliminazione del report",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione del report",
        variant: "destructive"
      });
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
