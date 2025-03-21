
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays, FileBarChart, Trash2, Loader2 } from 'lucide-react';
import { Report } from '@/context/types';
import { useReport } from '@/context/ReportContext';
import { useToast } from '@/hooks/use-toast';

interface ReportListProps {
  reports: Report[];
  onDelete: (report: Report, e: React.MouseEvent) => void;
  onSelectReport?: (report: Report) => Promise<void> | void;
}

const ReportList = ({ reports, onDelete, onSelectReport }: ReportListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loadReport, setCurrentCompany, companies } = useReport();
  const [loadingReportId, setLoadingReportId] = useState<string | null>(null);

  const handleOpenReport = async (report: Report) => {
    try {
      // Set loading state for this specific report
      setLoadingReportId(report.id);

      // Find and set company first
      const company = companies.find(c => c.id === report.company_id) || null;
      if (!company) {
        toast({
          title: "Errore",
          description: "Azienda associata non trovata",
          variant: "destructive"
        });
        return;
      }
      
      setCurrentCompany(company);
      
      // Load the full report with detailed company data
      if (onSelectReport) {
        await onSelectReport(report);
      } else {
        const result = await loadReport(report.id);
        
        // Verify the report was loaded successfully with company data
        if (!result || !result.report || !result.report.company || !result.report.company.name) {
          toast({
            title: "Avviso",
            description: "Dati del report incompleti. Potrebbero mancare alcune informazioni.",
            variant: "default"  // Changed from "warning" to "default"
          });
        }
      }
      
      // Navigate to report page
      navigate('/report');
    } catch (error) {
      console.error("Error opening report:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'apertura del report",
        variant: "destructive"
      });
    } finally {
      // Clear loading state
      setLoadingReportId(null);
    }
  };
  
  const handleViewDashboard = async (report: Report) => {
    try {
      // Set loading state for this specific report
      setLoadingReportId(report.id);
      
      const company = companies.find(c => c.id === report.company_id) || null;
      if (!company) {
        toast({
          title: "Errore",
          description: "Azienda associata non trovata",
          variant: "destructive"
        });
        return;
      }
      
      setCurrentCompany(company);
      
      // Load the full report
      if (onSelectReport) {
        await onSelectReport(report);
      } else {
        await loadReport(report.id);
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Error viewing dashboard:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'apertura della dashboard",
        variant: "destructive"
      });
    } finally {
      setLoadingReportId(null);
    }
  };

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div 
          key={report.id} 
          className="p-5 rounded-lg border border-gray-200 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <CalendarDays className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-medium">
                Report anno {report.report_year}
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleViewDashboard(report)}
                disabled={loadingReportId === report.id}
              >
                {loadingReportId === report.id ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <FileBarChart className="h-4 w-4 mr-1" />
                )}
                Dashboard
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => handleOpenReport(report)}
                disabled={loadingReportId === report.id}
              >
                {loadingReportId === report.id ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : "Apri Report"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={(e) => onDelete(report, e)}
                disabled={loadingReportId === report.id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Tipo:</span>{" "}
              <span>Opzione {report.report_type}</span>
            </div>
            <div>
              <span className="text-gray-500">Rendicontazione:</span>{" "}
              <span>{report.is_consolidated ? "Consolidata" : "Individuale"}</span>
            </div>
            <div>
              <span className="text-gray-500">Stato:</span>{" "}
              <span className={`${
                report.status === 'published' ? 'text-green-600' : 'text-amber-600'
              }`}>
                {report.status === 'published' ? 'Pubblicato' : 'Bozza'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportList;
