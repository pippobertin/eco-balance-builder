
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSummaryCards from '@/components/dashboard/DashboardSummaryCards';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import { useReport } from '@/context/ReportContext';

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState<string>("2023");
  const { reportData } = useReport();
  
  // Log the report data to console for debugging
  console.log("Dati del report nella dashboard:", reportData);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <DashboardHeader 
            selectedYear={selectedYear} 
            setSelectedYear={setSelectedYear} 
          />
          
          {/* Summary Cards */}
          <DashboardSummaryCards reportData={reportData} />
          
          {/* ESG Breakdown */}
          <DashboardCharts reportData={reportData} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
