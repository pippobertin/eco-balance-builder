
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

const Dashboard = () => {
  const navigate = useNavigate();
  const { reportData, currentReport, currentCompany, reports, loadReports } = useReport();
  
  // State for selected year and historical report data
  const [selectedYear, setSelectedYear] = React.useState<string>("");
  const [historicalReportData, setHistoricalReportData] = useState<{[key: string]: ReportData}>({});
  const [displayData, setDisplayData] = useState<ReportData | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // Load reports for the current company when component mounts
  useEffect(() => {
    if (currentCompany) {
      loadReports(currentCompany.id);
    }
  }, [currentCompany]);
  
  // Update the selected year when the current report changes
  useEffect(() => {
    if (currentReport && currentReport.report_year) {
      setSelectedYear(currentReport.report_year);
    }
  }, [currentReport]);
  
  // Group reports by year for easy access
  useEffect(() => {
    const reportsByYear: {[key: string]: Report} = {};
    const dataByYear: {[key: string]: ReportData} = {};
    
    // Initialize with current report data
    if (currentReport) {
      reportsByYear[currentReport.report_year] = currentReport;
      dataByYear[currentReport.report_year] = reportData;
    }
    
    // Add other reports from the same company
    reports.forEach(report => {
      if (report.id !== currentReport?.id) {
        reportsByYear[report.report_year] = report;
        
        // Create basic report data structure for each year
        dataByYear[report.report_year] = {
          environmentalMetrics: report.environmental_metrics || {},
          socialMetrics: report.social_metrics || {},
          conductMetrics: report.conduct_metrics || {},
          materialityAnalysis: report.materiality_analysis || { issues: [], stakeholders: [] },
          narrativePATMetrics: report.narrative_pat_metrics || {}
        };
      }
    });
    
    setHistoricalReportData(dataByYear);
  }, [reports, currentReport, reportData]);
  
  // Update display data when selected year changes
  useEffect(() => {
    if (selectedYear) {
      if (selectedYear === currentReport?.report_year) {
        // If selected year is current report, use current report data
        setDisplayData(reportData);
        setSelectedReport(currentReport);
      } else if (historicalReportData[selectedYear]) {
        // If selected year exists in historical data, use that
        setDisplayData(historicalReportData[selectedYear]);
        
        // Find the corresponding report
        const report = reports.find(r => r.report_year === selectedYear);
        setSelectedReport(report || null);
      } else {
        // If no data available for selected year
        setDisplayData(null);
        setSelectedReport(null);
      }
    }
  }, [selectedYear, historicalReportData, reportData, currentReport, reports]);
  
  // Log the report data to console for debugging
  console.log("Current report year:", currentReport?.report_year);
  console.log("Selected year:", selectedYear);
  console.log("Available years:", Object.keys(historicalReportData));
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
              availableYears={Object.keys(historicalReportData)}
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
