
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FileText, Plus, Briefcase, ShieldAlert, Loader2 } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/button';
import { useReport } from '@/context/ReportContext';
import { Report } from '@/context/types';
import AddReportDialog from './dialogs/AddReportDialog';
import ReportList from './ReportList';
import { useReportContext } from './hooks/useReportContext';
import { useAuth } from '@/context/AuthContext';
import { debounce } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReportsSectionProps {
  setReportToDelete: (report: Report) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
}

const ReportsSection = ({ setReportToDelete, setIsDeleteDialogOpen }: ReportsSectionProps) => {
  const { reports, loadReports, currentCompany, loadReport, setCurrentReport } = useReport();
  const { isAddReportDialogOpen, setIsAddReportDialogOpen } = useReportContext();
  const { user, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [accessError, setAccessError] = useState(false);
  const { toast } = useToast();
  const loadingRef = useRef(false);
  const lastCompanyIdRef = useRef<string | null>(null);
  
  const loadReportsData = useCallback(async () => {
    if (!currentCompany) {
      return;
    }
    
    // Skip if already loading or same company
    if (loadingRef.current || lastCompanyIdRef.current === currentCompany.id) {
      return;
    }
    
    loadingRef.current = true;
    lastCompanyIdRef.current = currentCompany.id;
    
    setIsLoading(true);
    setAccessError(false);
    
    try {
      console.log("Loading reports for company:", currentCompany.id);
      const loadedReports = await loadReports(currentCompany.id);
      console.log("Loaded reports:", loadedReports.length);
      
      // If user can't access reports for this company
      if (loadedReports.length === 0 && !isAdmin && user && currentCompany.created_by) {
        const isOwnCompany = currentCompany.created_by === user.id;
        if (!isOwnCompany) {
          setAccessError(true);
        }
      }
    } catch (error) {
      console.error("Error loading reports:", error);
      setAccessError(true);
      toast({
        title: "Errore di caricamento",
        description: "Impossibile caricare i report per questa azienda",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      
      // Reset loading flag after a delay to prevent rapid successive calls
      setTimeout(() => {
        loadingRef.current = false;
      }, 500);
    }
  }, [currentCompany, isAdmin, user, loadReports, toast]);
  
  // Debounce the load function to prevent multiple rapid calls
  const debouncedLoadReports = useCallback(
    debounce(() => {
      loadReportsData();
    }, 300),
    [loadReportsData]
  );
  
  useEffect(() => {
    if (currentCompany && currentCompany.id) {
      console.log("Company changed, loading reports for:", currentCompany.name);
      debouncedLoadReports();
    }
  }, [currentCompany, debouncedLoadReports]);

  const openDeleteDialog = (report: Report, e: React.MouseEvent) => {
    e.stopPropagation();
    setReportToDelete(report);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle report selection with error handling
  const handleSelectReport = useCallback(async (report: Report) => {
    console.log("Selecting report:", report.id);
    try {
      setIsLoading(true);
      // Load the full report data
      const result = await loadReport(report.id);
      
      if (result && result.report) {
        console.log("Report loaded successfully:", result.report.id);
        // The report is now set as currentReport in the context by loadReport
      } else {
        console.error("Failed to load report details");
        toast({
          title: "Errore",
          description: "Impossibile caricare i dettagli del report",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error selecting report:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un problema durante il caricamento del report",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [loadReport, toast]);

  return (
    <GlassmorphicCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <FileText className="mr-2 h-5 w-5 text-green-500" />
          Report di Sostenibilità
          {currentCompany && (
            <span className="ml-2 text-base font-normal text-gray-500">
              - {currentCompany.name}
            </span>
          )}
        </h2>
        
        {currentCompany && !accessError && !isLoading && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setIsAddReportDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Nuovo Report
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
          <span className="ml-2 text-gray-600">Caricamento report...</span>
        </div>
      ) : !currentCompany ? (
        <div className="text-center py-12 text-gray-500">
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Seleziona un'azienda per visualizzare i suoi report</p>
        </div>
      ) : accessError ? (
        <div className="text-center py-12 text-red-500">
          <ShieldAlert className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <p className="font-medium">Accesso non autorizzato</p>
          <p className="text-sm text-red-400 mt-1">Non hai i permessi per visualizzare i report di questa azienda.</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Nessun report presente per questa azienda.</p>
          <p className="text-sm">Crea il tuo primo report di sostenibilità.</p>
        </div>
      ) : (
        <ReportList 
          reports={reports} 
          onDelete={openDeleteDialog} 
          onSelectReport={handleSelectReport}
        />
      )}
      
      <AddReportDialog
        open={isAddReportDialogOpen}
        onOpenChange={setIsAddReportDialogOpen}
      />
    </GlassmorphicCard>
  );
};

export default React.memo(ReportsSection);
