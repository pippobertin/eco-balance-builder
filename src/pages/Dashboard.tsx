
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSummaryCards from '@/components/dashboard/DashboardSummaryCards';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import { useReport } from '@/context/ReportContext';

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = React.useState<string>("2023");
  const { reportData } = useReport();
  
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
      (typeof reportData.socialMetrics.trainingHours === 'number' && reportData.socialMetrics.trainingHours > a) ||
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
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <DashboardHeader 
            selectedYear={selectedYear} 
            setSelectedYear={setSelectedYear} 
          />
          
          {!hasData && (
            <div className="text-center py-10 my-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-xl font-medium text-gray-800 mb-2">Nessun dato di sostenibilità disponibile</h3>
              <p className="text-gray-700 mb-4">Non sono stati trovati dati ESG per il periodo selezionato.</p>
              <p className="text-gray-600">Compila il report di sostenibilità per visualizzare i dati nella dashboard.</p>
            </div>
          )}
          
          {hasData && (
            <>
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
