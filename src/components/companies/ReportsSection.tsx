
import React, { useEffect, useState } from 'react';
import { FileText, Plus, Briefcase, ShieldAlert } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/button';
import { useReport } from '@/context/ReportContext';
import { Report } from '@/context/types';
import AddReportDialog from './dialogs/AddReportDialog';
import ReportList from './ReportList';
import { useReportContext } from './hooks/useReportContext';
import { useAuth } from '@/context/AuthContext';

interface ReportsSectionProps {
  setReportToDelete: (report: Report) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
}

const ReportsSection = ({ setReportToDelete, setIsDeleteDialogOpen }: ReportsSectionProps) => {
  const { reports, loadReports, currentCompany } = useReport();
  const { isAddReportDialogOpen, setIsAddReportDialogOpen } = useReportContext();
  const { user, isAdmin } = useAuth();
  const [accessError, setAccessError] = useState(false);
  
  useEffect(() => {
    const loadReportsData = async () => {
      if (currentCompany) {
        try {
          const loadedReports = await loadReports(currentCompany.id);
          // If user can't access reports for this company
          if (loadedReports.length === 0 && !isAdmin && user && currentCompany.created_by) {
            const isOwnCompany = currentCompany.created_by === user.id;
            if (!isOwnCompany) {
              setAccessError(true);
              return;
            }
          }
          setAccessError(false);
        } catch (error) {
          console.error("Error loading reports:", error);
          setAccessError(true);
        }
      }
    };
    
    setAccessError(false);
    loadReportsData();
  }, [currentCompany, isAdmin, user]);

  const openDeleteDialog = (report: Report, e: React.MouseEvent) => {
    e.stopPropagation();
    setReportToDelete(report);
    setIsDeleteDialogOpen(true);
  };

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
        
        {currentCompany && !accessError && (
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
      
      {!currentCompany ? (
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
        <ReportList reports={reports} onDelete={openDeleteDialog} />
      )}
      
      <AddReportDialog
        open={isAddReportDialogOpen}
        onOpenChange={setIsAddReportDialogOpen}
      />
    </GlassmorphicCard>
  );
};

export default ReportsSection;
