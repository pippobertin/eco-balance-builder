
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSummaryCards from '@/components/dashboard/DashboardSummaryCards';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import { useReport } from '@/context/ReportContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { reportData, currentReport, currentCompany } = useReport();
  
  // Set the year based on the current report's year
  const [selectedYear, setSelectedYear] = React.useState<string>("");
  
  // Update the selected year when the current report changes
  useEffect(() => {
    if (currentReport && currentReport.report_year) {
      setSelectedYear(currentReport.report_year);
    }
  }, [currentReport]);
  
  // Log the report data to console for debugging
  console.log("Dati del report nella dashboard:", reportData);
  
  // More thorough check if we have any meaningful data with explicit type checking
  const hasData = (
    // Environmental data check
    (reportData.environmentalMetrics && (
      (typeof reportData.environmentalMetrics.carbonEmissions === 'number' && reportData.environmentalMetrics.carbonEmissions > 0) ||
      (typeof reportData.environmentalMetrics.energyConsumption === 'number' && reportData.environmentalMetrics.energyConsumption > 0) ||
      (typeof reportData.environmentalMetrics.wasteGeneration === 'number' && reportData.environmentalMetrics.wasteGeneration > 0) ||
      (typeof reportData.environmentalMetrics.waterUsage === 'number' && reportData.environmentalMetrics.waterUsage > 0) ||
      (typeof reportData.environmentalMetrics.renewableEnergy === 'number' && reportData.environmentalMetrics.renewableEnergy > 0) ||
      (typeof reportData.environmentalMetrics.totalScope1Emissions === 'number' && reportData.environmentalMetrics.totalScope1Emissions > 0) ||
      (typeof reportData.environmentalMetrics.totalScope2Emissions === 'number' && reportData.environmentalMetrics.totalScope2Emissions > 0) ||
      (typeof reportData.environmentalMetrics.totalScope3Emissions === 'number' && reportData.environmentalMetrics.totalScope3Emissions > 0)
    )) ||
    
    // Social data check
    (reportData.socialMetrics && (
      (typeof reportData.socialMetrics.employeeDiversity === 'number' && reportData.socialMetrics.employeeDiversity > 0) ||
      (typeof reportData.socialMetrics.trainingHours === 'number' && reportData.socialMetrics.trainingHours > 0) ||
      (typeof reportData.socialMetrics.communityEngagement === 'number' && reportData.socialMetrics.communityEngagement > 0) ||
      (typeof reportData.socialMetrics.employeeSatisfaction === 'number' && reportData.socialMetrics.employeeSatisfaction > 0)
    )) ||
    
    // Conduct data check
    (reportData.conductMetrics && (
      (typeof reportData.conductMetrics.governanceCompliance === 'number' && reportData.conductMetrics.governanceCompliance > 0) ||
      (typeof reportData.conductMetrics.policyAdherence === 'number' && reportData.conductMetrics.policyAdherence > 0) ||
      (typeof reportData.conductMetrics.riskManagement === 'number' && reportData.conductMetrics.riskManagement > 0)
    )) ||
    
    // Materiality data check
    (reportData.materialityAnalysis && typeof reportData.materialityAnalysis.esgScore === 'number' && reportData.materialityAnalysis.esgScore > 0)
  );
  
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
              
              {currentReport && (
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
          
          {currentCompany && !hasData && (
            <div className="text-center py-10 my-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-xl font-medium text-gray-800 mb-2">Nessun dato di sostenibilità disponibile</h3>
              <p className="text-gray-700 mb-4">Non sono stati trovati dati ESG per il periodo selezionato.</p>
              <p className="text-gray-600">Compila il report di sostenibilità per visualizzare i dati nella dashboard.</p>
              <Button onClick={editReport} className="mt-4">Compila Report</Button>
            </div>
          )}
          
          {currentCompany && hasData && (
            <>
              {/* Company Info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="text-lg font-medium text-blue-900">
                  {currentCompany.name}
                </h3>
                {currentReport && (
                  <p className="text-sm text-blue-700">
                    Report anno: {currentReport.report_year} | 
                    Tipo: Opzione {currentReport.report_type} | 
                    {currentReport.is_consolidated ? ' Consolidato' : ' Individuale'}
                  </p>
                )}
              </div>
              
              {/* Summary Cards */}
              <DashboardSummaryCards reportData={reportData} />
              
              {/* ESG Breakdown */}
              <DashboardCharts reportData={reportData} />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
