
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
  
  // Check if we have any data
  const hasData = 
    (reportData.environmentalMetrics && Object.keys(reportData.environmentalMetrics).some(key => 
      typeof reportData.environmentalMetrics[key as keyof typeof reportData.environmentalMetrics] === 'number' && 
      reportData.environmentalMetrics[key as keyof typeof reportData.environmentalMetrics] > 0
    )) ||
    (reportData.socialMetrics && Object.keys(reportData.socialMetrics).some(key => 
      typeof reportData.socialMetrics[key as keyof typeof reportData.socialMetrics] === 'number' && 
      reportData.socialMetrics[key as keyof typeof reportData.socialMetrics] > 0
    )) ||
    (reportData.conductMetrics && Object.keys(reportData.conductMetrics).some(key => 
      typeof reportData.conductMetrics[key as keyof typeof reportData.conductMetrics] === 'number' && 
      reportData.conductMetrics[key as keyof typeof reportData.conductMetrics] > 0
    )) ||
    (reportData.materialityAnalysis && reportData.materialityAnalysis.esgScore > 0);
  
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
