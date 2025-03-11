
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardActions from '@/components/dashboard/DashboardActions';
import NoCompanySelected from '@/components/dashboard/NoCompanySelected';
import AccessError from '@/components/dashboard/AccessError';
import NoReportData from '@/components/dashboard/NoReportData';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useReport } from '@/context/ReportContext';
import { useDashboardData } from '@/hooks/useDashboardData';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentCompany } = useReport();
  const { 
    selectedYear, 
    setSelectedYear, 
    displayData, 
    selectedReport, 
    accessError,
    availableYears
  } = useDashboardData();
  
  const goToCompanies = () => {
    navigate('/companies');
  };
  
  const editReport = (section?: string) => {
    navigate('/report', { 
      state: { 
        activeTab: 'metrics',
        section: section || 'environmental' // Default to environmental if no section specified
      } 
    });
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
              reportYear={selectedReport?.report_year || ""}
              companyName={currentCompany?.name}
              availableYears={availableYears}
            />
            
            <DashboardActions
              onGoToCompanies={goToCompanies}
              onEditReport={() => editReport()}
              selectedReport={selectedReport}
              accessError={accessError}
            />
          </div>
          
          {!currentCompany && (
            <NoCompanySelected onGoToCompanies={goToCompanies} />
          )}
          
          {currentCompany && accessError && (
            <AccessError onGoToCompanies={goToCompanies} />
          )}
          
          {currentCompany && !accessError && !displayData && (
            <NoReportData onEditReport={() => editReport()} />
          )}
          
          {currentCompany && !accessError && displayData && selectedReport && (
            <DashboardContent 
              displayData={displayData} 
              company={currentCompany} 
              report={selectedReport} 
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
