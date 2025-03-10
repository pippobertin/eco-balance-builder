import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSummaryCards from '@/components/dashboard/DashboardSummaryCards';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import { useReport } from '@/context/ReportContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { ReportData, Report } from '@/context/types';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { reportData, currentReport, currentCompany, reports, loadReports, loadReport } = useReport();
  
  // State for selected year and historical report data
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [historicalReportData, setHistoricalReportData] = useState<{[key: string]: ReportData}>({});
  const [displayData, setDisplayData] = useState<ReportData | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // Load reports for the current company when component mounts
  useEffect(() => {
    const loadCompanyReports = async () => {
      if (currentCompany) {
        try {
          await loadReports(currentCompany.id);
        } catch (error) {
          console.error("Error loading reports:", error);
          toast({
            title: "Errore",
            description: "Impossibile caricare i report dell'azienda",
            variant: "destructive"
          });
        }
      }
    };
    
    loadCompanyReports();
  }, [currentCompany]);
  
  // Update the selected year when the current report changes
  useEffect(() => {
    if (currentReport && currentReport.report_year) {
      setSelectedYear(currentReport.report_year);
    }
  }, [currentReport]);
  
  // When selected year changes, load the appropriate report data
  useEffect(() => {
    const handleYearChange = async () => {
      if (!selectedYear || !currentCompany) return;
      
      // If selected year is current report, we already have the data
      if (currentReport && selectedYear === currentReport.report_year) {
        setDisplayData(reportData);
        setSelectedReport(currentReport);
        return;
      }
      
      // Otherwise find the report for the selected year
      const reportForYear = reports.find(r => r.report_year === selectedYear);
      
      if (reportForYear) {
        // Load this report's data
        await loadReport(reportForYear.id);
        setSelectedReport(reportForYear);
        // Note: reportData will be updated by loadReport via context
      } else {
        // If no report exists for this year
        setDisplayData(null);
        setSelectedReport(null);
        toast({
          title: "Nessun report",
          description: `Non esiste un report per l'anno ${selectedYear}`,
          variant: "warning"
        });
      }
    };
    
    handleYearChange();
  }, [selectedYear, reports, currentReport, currentCompany]);
  
  // Update display data when report data changes
  useEffect(() => {
    if (selectedReport && selectedReport.id === currentReport?.id) {
      setDisplayData(reportData);
    }
  }, [reportData, selectedReport, currentReport]);
  
  // Debug logs
  console.log("Current report year:", currentReport?.report_year);
  console.log("Selected year:", selectedYear);
  console.log("Available reports:", reports.map(r => r.report_year));
  console.log("Display data for selected year:", displayData);
  
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
          {/* Header */}
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
              
              {selectedReport && (
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
          
          {currentCompany && !displayData && (
            <div className="text-center py-10 my-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-xl font-medium text-gray-800 mb-2">Nessun dato di sostenibilità disponibile</h3>
              <p className="text-gray-700 mb-4">Non sono stati trovati dati ESG per il periodo selezionato.</p>
              <p className="text-gray-600">Compila il report di sostenibilità per visualizzare i dati nella dashboard.</p>
              <Button onClick={editReport} className="mt-4">Compila Report</Button>
            </div>
          )}
          
          {currentCompany && displayData && (
            <>
              {/* Company Info */}
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
              
              {/* Summary Cards */}
              <DashboardSummaryCards reportData={displayData} />
              
              {/* ESG Breakdown */}
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
