import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSummaryCards from '@/components/dashboard/DashboardSummaryCards';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import { useReport } from '@/context/ReportContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, ShieldAlert } from 'lucide-react';
import { ReportData, Report } from '@/context/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const { reportData, currentReport, currentCompany, reports, loadReports, loadReport } = useReport();
  
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [historicalReportData, setHistoricalReportData] = useState<{[key: string]: ReportData}>({});
  const [displayData, setDisplayData] = useState<ReportData | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [accessError, setAccessError] = useState<boolean>(false);
  
  useEffect(() => {
    const loadCompanyReports = async () => {
      if (currentCompany) {
        try {
          const loadedReports = await loadReports(currentCompany.id);
          if (loadedReports.length === 0) {
            setAccessError(true);
          } else {
            setAccessError(false);
          }
        } catch (error) {
          console.error("Error loading reports:", error);
          setAccessError(true);
          toast({
            title: "Errore",
            description: "Impossibile caricare i report dell'azienda",
            variant: "destructive"
          });
        }
      }
    };
    
    setAccessError(false);
    loadCompanyReports();
  }, [currentCompany]);
  
  useEffect(() => {
    if (currentReport && currentReport.report_year) {
      setSelectedYear(currentReport.report_year);
    }
  }, [currentReport]);
  
  useEffect(() => {
    const handleYearChange = async () => {
      if (!selectedYear || !currentCompany) return;
      
      if (currentReport && selectedYear === currentReport.report_year) {
        setDisplayData(reportData);
        setSelectedReport(currentReport);
        return;
      }
      
      const reportForYear = reports.find(r => r.report_year === selectedYear);
      
      if (reportForYear) {
        try {
          const loadReportResult = await loadReport(reportForYear.id);
          console.log("Load report result:", loadReportResult);
          
          if (loadReportResult && loadReportResult.report) {
            setSelectedReport(loadReportResult.report);
            const newReportData = {
              environmentalMetrics: loadReportResult.report.environmental_metrics || {},
              socialMetrics: loadReportResult.report.social_metrics || {},
              conductMetrics: loadReportResult.report.conduct_metrics || {},
              materialityAnalysis: loadReportResult.report.materiality_analysis || { issues: [], stakeholders: [] },
              narrativePATMetrics: loadReportResult.report.narrative_pat_metrics || {}
            };
            setDisplayData(newReportData);
            setAccessError(false);
          } else {
            console.error("Report data not found or access denied");
            setSelectedReport(null);
            setDisplayData(null);
            setAccessError(true);
          }
        } catch (error) {
          console.error("Error loading report:", error);
          setAccessError(true);
          setSelectedReport(null);
          setDisplayData(null);
          toast({
            title: "Errore",
            description: "Impossibile caricare il report selezionato",
            variant: "destructive"
          });
        }
      } else {
        setDisplayData(null);
        setSelectedReport(null);
        toast({
          title: "Nessun report",
          description: `Non esiste un report per l'anno ${selectedYear}`,
          variant: "default"
        });
      }
    };
    
    handleYearChange();
  }, [selectedYear, reports, currentReport, currentCompany]);
  
  useEffect(() => {
    if (selectedReport && selectedReport.id === currentReport?.id) {
      setDisplayData(reportData);
    }
  }, [reportData, selectedReport, currentReport]);
  
  console.log("Current report year:", currentReport?.report_year);
  console.log("Selected year:", selectedYear);
  console.log("Available reports:", reports.map(r => r.report_year));
  console.log("Display data for selected year:", displayData);
  console.log("Access error:", accessError);
  
  const goToCompanies = () => {
    navigate('/companies');
  };
  
  const editReport = () => {
    navigate('/report');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-6">
            <DashboardHeader 
              selectedYear={selectedYear} 
              setSelectedYear={setSelectedYear} 
              reportYear={currentReport?.report_year || ""} 
              companyName={currentCompany?.name}
              availableYears={reports.map(r => r.report_year)}
            />
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={goToCompanies}
              >
                <ArrowLeft className="h-4 w-4" />
                Torna alle Aziende
              </Button>
              
              {selectedReport && !accessError && (
                <Button 
                  className="flex items-center gap-2"
                  onClick={editReport}
                >
                  <FileText className="h-4 w-4" />
                  Modifica Report
                </Button>
              )}
            </div>
          </div>
          
          {!currentCompany && (
            <div className="text-center py-10 my-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-xl font-medium text-gray-800 mb-2">Nessuna azienda selezionata</h3>
              <p className="text-gray-700 mb-4">Seleziona un'azienda e un report per visualizzare i dati nella dashboard.</p>
              <Button onClick={goToCompanies}>Vai alla lista aziende</Button>
            </div>
          )}
          
          {currentCompany && accessError && (
            <div className="text-center py-10 my-6 bg-red-50 rounded-lg border border-red-200">
              <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-2" />
              <h3 className="text-xl font-medium text-red-800 mb-2">Accesso non autorizzato</h3>
              <p className="text-gray-700 mb-4">Non hai i permessi per visualizzare i report di questa azienda.</p>
              <Button onClick={goToCompanies} variant="default">Torna alle tue aziende</Button>
            </div>
          )}
          
          {currentCompany && !accessError && !displayData && (
            <div className="text-center py-10 my-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-xl font-medium text-gray-800 mb-2">Nessun dato di sostenibilità disponibile</h3>
              <p className="text-gray-700 mb-4">Non sono stati trovati dati ESG per il periodo selezionato.</p>
              <p className="text-gray-600">Compila il report di sostenibilità per visualizzare i dati nella dashboard.</p>
              <Button onClick={editReport} className="mt-4">Compila Report</Button>
            </div>
          )}
          
          {currentCompany && !accessError && displayData && (
            <>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="text-lg font-medium text-blue-900">
                  {currentCompany.name}
                </h3>
                {selectedReport && (
                  <p className="text-sm text-blue-700">
                    Report anno: {selectedReport.report_year} | 
                    Tipo: Opzione {selectedReport.report_type} | 
                    {selectedReport.is_consolidated ? ' Consolidato' : ' Individuale'}
                  </p>
                )}
              </div>
              
              <DashboardSummaryCards reportData={displayData} />
              
              <DashboardCharts reportData={displayData} companyName={currentCompany.name} />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
